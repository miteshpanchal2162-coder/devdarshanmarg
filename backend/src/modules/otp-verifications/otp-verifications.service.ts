import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OtpVerification } from "@prisma/client";
import { OtpPurpose } from "../../common/enums/otp-purpose.enum";
import { addDurationToNow } from "../../common/utils/duration.util";
import { hashOtp, verifyOtpHash } from "../../common/utils/otp-hash.util";
import { generateOtpCode } from "../../common/utils/otp.util";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
} from "../../common/utils/query.util";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  CreateOtpVerificationDto,
  OtpVerificationQueryDto,
} from "./dto/otp-verification.dto";
import { UpdateOtpVerificationDto } from "./dto/update-otp-verification.dto";

@Injectable()
export class OtpVerificationsService extends BaseCrudService<OtpVerification> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super(
      prisma.otpVerification,
      ["mobile", "email", "purpose"],
      ["mobile", "email", "purpose", "expireTime", "verifiedTime", "retryCount", "createdAt", "updatedAt"],
      ["mobile", "email", "purpose"],
    );
  }

  async findAll(query: OtpVerificationQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["mobile", "email", "purpose"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...this.buildVerificationFilters(query),
    });

    const [items, total] = await Promise.all([
      this.prisma.otpVerification.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.otpVerification.count({ where }),
    ]);

    return createPaginatedResponse(
      items.map((item) => this.toSafeResponse(item)),
      createPaginationMeta(page, limit, total),
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "OTP verification fetched successfully",
      this.toSafeResponse(await super.findOne(id)),
    );
  }

  async createOtp(dto: CreateOtpVerificationDto) {
    this.validateContact(dto.mobile, dto.email);
    this.validateExpiryDate(dto.expireTime);
    await this.ensureNoActiveDuplicate(dto);

    const item = await super.create({
      mobile: dto.mobile,
      email: dto.email,
      otp: hashOtp(dto.otp),
      purpose: dto.purpose,
      expireTime: new Date(dto.expireTime),
      retryCount: dto.retryCount ?? 0,
    });

    return createApiResponse("OTP verification created successfully", this.toSafeResponse(item));
  }

  async updateOtp(id: string, dto: UpdateOtpVerificationDto) {
    const existing = await super.findOne(id);

    if (existing.verifiedTime) {
      throw new ConflictException("Verified OTP records cannot be updated");
    }

    const mobile = dto.mobile ?? existing.mobile ?? undefined;
    const email = dto.email ?? existing.email ?? undefined;
    this.validateContact(mobile, email);

    if (dto.expireTime) {
      this.validateExpiryDate(dto.expireTime);
    }

    const { otp, ...rest } = dto;
    const item = await super.update(id, {
      ...rest,
      ...(otp ? { otp: hashOtp(otp) } : {}),
      ...(dto.expireTime ? { expireTime: new Date(dto.expireTime) } : {}),
    });

    return createApiResponse("OTP verification updated successfully", this.toSafeResponse(item));
  }

  async deleteOtp(id: string) {
    await super.findOne(id);
    const item = await this.prisma.otpVerification.delete({ where: { id } });
    return createApiResponse("OTP verification deleted successfully", this.toSafeResponse(item));
  }

  async verifyOtp(id: string, submittedOtp: string) {
    const item = await super.findOne(id);

    if (item.verifiedTime) {
      throw new ConflictException("OTP has already been used");
    }

    if (item.expireTime <= new Date()) {
      throw new BadRequestException("OTP has expired");
    }

    if (!verifyOtpHash(item.otp, submittedOtp)) {
      throw new UnauthorizedException("Invalid OTP");
    }

    const verified = await super.update(id, { verifiedTime: new Date() });
    return createApiResponse("OTP verified successfully", this.toSafeResponse(verified));
  }

  async incrementRetry(id: string) {
    const item = await super.findOne(id);

    if (item.verifiedTime) {
      throw new ConflictException("Verified OTP records cannot be retried");
    }

    const updated = await super.update(id, { retryCount: item.retryCount + 1 });
    return createApiResponse("OTP retry count updated successfully", this.toSafeResponse(updated));
  }

  async sendPublicOtp(mobile: string, purpose: OtpPurpose) {
    this.validateMobile(mobile);
    this.validatePublicPurpose(purpose);

    await this.invalidateActiveOtps(mobile, purpose);

    const otp = generateOtpCode();
    const expireTime = addDurationToNow(
      this.configService.get<string>("otp.expiresIn") ?? "5m",
    );

    const item = await super.create({
      mobile,
      otp: hashOtp(otp),
      purpose,
      expireTime,
      retryCount: 0,
    });

    return this.toSafeResponse(item);
  }

  async verifyPublicOtp(mobile: string, purpose: OtpPurpose, submittedOtp: string) {
    this.validateMobile(mobile);
    this.validatePublicPurpose(purpose);

    const item = await this.prisma.otpVerification.findFirst({
      where: {
        mobile,
        purpose,
        verifiedTime: null,
        expireTime: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!item) {
      throw new BadRequestException("OTP not found or expired");
    }

    const maxRetries = this.configService.get<number>("otp.maxRetries") ?? 5;
    if (item.retryCount >= maxRetries) {
      throw new BadRequestException("Maximum OTP verification attempts exceeded");
    }

    if (!verifyOtpHash(item.otp, submittedOtp)) {
      await super.update(item.id, { retryCount: item.retryCount + 1 });
      throw new UnauthorizedException("Invalid OTP");
    }

    const verified = await super.update(item.id, { verifiedTime: new Date() });
    return this.toSafeResponse(verified);
  }

  async findVerifiedPublicOtp(id: string, mobile: string, purpose: OtpPurpose) {
    const item = await this.prisma.otpVerification.findFirst({
      where: {
        id,
        mobile,
        purpose,
        verifiedTime: { not: null },
      },
    });

    if (!item) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }

    return item;
  }

  private async invalidateActiveOtps(mobile: string, purpose: string) {
    await this.prisma.otpVerification.updateMany({
      where: {
        mobile,
        purpose,
        verifiedTime: null,
        expireTime: { gt: new Date() },
      },
      data: { expireTime: new Date() },
    });
  }

  private validateMobile(mobile: string) {
    if (!/^\+?[0-9]{7,20}$/.test(mobile)) {
      throw new BadRequestException("Invalid mobile number");
    }
  }

  private validatePublicPurpose(purpose: string) {
    if (!Object.values(OtpPurpose).includes(purpose as OtpPurpose)) {
      throw new BadRequestException("Invalid OTP purpose");
    }
  }

  private toSafeResponse(item: OtpVerification) {
    const { otp: _otp, ...safeItem } = item;
    return safeItem;
  }

  private buildVerificationFilters(query: OtpVerificationQueryDto) {
    const filters: Record<string, unknown> = {};

    if (query.isVerified === true) {
      filters.verifiedTime = { not: null };
    } else if (query.isVerified === false) {
      filters.verifiedTime = null;
    }

    if (query.isExpired === true) {
      filters.expireTime = { lt: new Date() };
    } else if (query.isExpired === false) {
      filters.expireTime = { gte: new Date() };
    }

    return filters;
  }

  private async ensureNoActiveDuplicate(dto: CreateOtpVerificationDto) {
    const existing = await this.prisma.otpVerification.findFirst({
      where: {
        purpose: dto.purpose,
        verifiedTime: null,
        expireTime: { gt: new Date() },
        ...(dto.mobile ? { mobile: dto.mobile } : {}),
        ...(dto.email ? { email: dto.email } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("An active OTP already exists for this contact and purpose");
    }
  }

  private validateContact(mobile?: string, email?: string) {
    if (!mobile && !email) {
      throw new BadRequestException("Either mobile or email is required");
    }
  }

  private validateExpiryDate(expireTime: string) {
    if (new Date(expireTime) <= new Date()) {
      throw new BadRequestException("OTP expiry time must be in the future");
    }
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["mobile", "email", "purpose"]);
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowed.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private buildWhere(where: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }

  private resolveSortBy(sortBy?: string) {
    if (!sortBy) return undefined;
    const allowed = new Set([
      "mobile",
      "email",
      "purpose",
      "expireTime",
      "verifiedTime",
      "retryCount",
      "createdAt",
      "updatedAt",
    ]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
