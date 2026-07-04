import { Injectable } from "@nestjs/common";
import { DeitySymbol } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeitySymbolsService extends DeityChildCrudService<DeitySymbol> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deitySymbol,
      {
        allowedFilterFields: ["featured"],
        allowedSortFields: ["symbolCode", "symbolName", "featured"],
        messageName: "Deity symbol",
        searchableFields: ["symbolCode", "symbolName", "description"],
        uniqueField: "symbolCode",
      },
      relationValidation,
    );
  }
}
