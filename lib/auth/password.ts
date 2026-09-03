import bcrypt from 'bcryptjs';

/**
 * Compares a plaintext password attempt with the stored ADMIN_PASSWORD_HASH using bcrypt.
 * Never throws internal errors and safely protects against timing attacks.
 */
export async function verifyAdminPassword(
  plainPassword: string,
  storedHash: string
): Promise<boolean> {
  if (!plainPassword || !storedHash) {
    return false;
  }
  try {
    return await bcrypt.compare(plainPassword, storedHash);
  } catch {
    return false;
  }
}

/**
 * Utility function to generate a bcrypt password hash for setting up ADMIN_PASSWORD_HASH.
 * Standard work factor: 10 rounds.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}
