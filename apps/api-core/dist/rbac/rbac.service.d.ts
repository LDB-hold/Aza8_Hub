import { PermissionKey, RoleKey } from '@aza8/core-domain';
export declare class RbacService {
    getPermissionsForRole(role: RoleKey | null | undefined): PermissionKey[];
}
