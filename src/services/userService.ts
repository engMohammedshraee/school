import { db } from './db';
import type { User } from '@/types';

export function getUserById(id: string): User | undefined {
  return db.users.find((u) => u.id === id);
}

export function getUserByNationalId(nationalId: string): User | undefined {
  return db.users.find((u) => u.nationalId === nationalId);
}

export function maskNationalId(id: string): string {
  if (id.length <= 4) return id;
  return `******${id.slice(-4)}`;
}
