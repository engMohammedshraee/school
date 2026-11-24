import type { Permission, RoleKey, SchoolMembership } from '@/types';
import { getRole } from './db';

// Mock permission engine — frontend UX only.
// Real authorization will be enforced by the Laravel backend.
// Never rely on hiding UI elements as a security measure.

export function getMembershipPermissions(membership: SchoolMembership): Permission[] {
  const role = getRole(membership.roleId);
  return role?.permissions ?? [];
}

export function can(permission: Permission, membership: SchoolMembership | null): boolean {
  if (!membership) return false;
  const perms = getMembershipPermissions(membership);
  return perms.includes(permission);
}

export function canAccessSchool(schoolId: string, membership: SchoolMembership | null): boolean {
  if (!membership) return false;
  return membership.schoolId === schoolId;
}

export function canAccessBranch(branchId: string, membership: SchoolMembership | null): boolean {
  if (!membership) return false;
  // empty branchIds = all branches in school
  if (membership.branchIds.length === 0) return true;
  return membership.branchIds.includes(branchId);
}

export function hasRole(roleKey: RoleKey, membership: SchoolMembership | null): boolean {
  if (!membership) return false;
  return membership.roleKey === roleKey;
}

export function isPlatformAdmin(membership: SchoolMembership | null): boolean {
  return hasRole('platform_super_admin', membership);
}

export function isSchoolScoped(membership: SchoolMembership | null): boolean {
  if (!membership) return false;
  const role = getRole(membership.roleId);
  return role?.scope === 'school' || role?.scope === 'branch';
}

export function isBranchScoped(membership: SchoolMembership | null): boolean {
  if (!membership) return false;
  const role = getRole(membership.roleId);
  return role?.scope === 'branch';
}
