export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ResponseMessage {
  CREATED = "Created successfully",
  UPDATED = "Updated successfully",
  DELETED = "Deleted successfully",
  RESTORED = "Restored successfully",
  FETCHED = "Fetched successfully",
  LIST_FETCHED = "List fetched successfully",
}

export enum PermissionAction {
  VIEW = "view",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  RESTORE = "restore",
  PUBLISH = "publish",
  APPROVE = "approve",
  IMPORT = "import",
  EXPORT = "export",
  MANAGE = "manage",
}
