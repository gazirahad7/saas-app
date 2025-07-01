import bcrypt from "bcryptjs";

export function saltAndHashPassword(plainPassword: string) {
  return bcrypt.hashSync(plainPassword, 10);
}

export function comparePassword(plainPassword: string, hash: string) {
  return bcrypt.compareSync(plainPassword, hash);
}
