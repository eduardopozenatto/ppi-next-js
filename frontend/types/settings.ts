export interface TagPermissions {
  viewItems: boolean;
  requestLoans: boolean;
  viewNotifications: boolean;
  viewInventory: boolean;
  generateReports: boolean;
  approveLoans: boolean;
  manageItems: boolean;
  deleteItems: boolean;
  manageUsers: boolean;
  manageTags: boolean;
  manageCategories: boolean;
  managePermissions: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
  permissions: TagPermissions;
  userCount?: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserPermissionOverride {
  userId: string;
  tagId: string;
  customOverrides: Partial<TagPermissions>;
}
