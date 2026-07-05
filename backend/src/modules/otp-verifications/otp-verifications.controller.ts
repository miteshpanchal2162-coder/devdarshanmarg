import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateOtpVerificationDto, OtpVerificationQueryDto } from "./dto/otp-verification.dto";
import { OtpVerificationResponseDto } from "./dto/otp-verification-response.dto";
import { UpdateOtpVerificationDto } from "./dto/update-otp-verification.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { OtpVerificationsService } from "./otp-verifications.service";

@ApiTags("OTP Verifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("otp-verifications")
export class OtpVerificationsController {
  constructor(private readonly service: OtpVerificationsService) {}

  @Get()
  @ApiOperation({ summary: "List OTP verifications" })
  @ApiPaginatedResponse(OtpVerificationResponseDto)
  findAll(@Query() query: OtpVerificationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get OTP verification by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create OTP verification" })
  @ApiBody({ type: CreateOtpVerificationDto })
  create(@Body() dto: CreateOtpVerificationDto) {
    return this.service.createOtp(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update OTP verification" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateOtpVerificationDto })
  update(@Param("id") id: string, @Body() dto: UpdateOtpVerificationDto) {
    return this.service.updateOtp(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete OTP verification" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteOtp(id);
  }

  @Patch(":id/verify")
  @ApiOperation({ summary: "Verify OTP with submitted code" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: VerifyOtpDto })
  verify(@Param("id") id: string, @Body() dto: VerifyOtpDto) {
    return this.service.verifyOtp(id, dto.otp);
  }

  @Patch(":id/retry")
  @ApiOperation({ summary: "Increment OTP retry count" })
  @ApiParam({ name: "id", type: String })
  incrementRetry(@Param("id") id: string) {
    return this.service.incrementRetry(id);
  }
}
