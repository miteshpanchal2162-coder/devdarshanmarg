import { Global, Module } from "@nestjs/common";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService, RelationValidationService],
  exports: [PrismaService, RelationValidationService],
})
export class PrismaModule {}
