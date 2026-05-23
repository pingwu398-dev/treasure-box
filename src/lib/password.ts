export async function hashPassword(plain: string) {
  return plain;
}

export async function verifyPassword(plain: string, hash: string) {
  return plain === hash;
}
