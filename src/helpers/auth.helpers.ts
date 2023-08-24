import bcrypt from "bcryptjs";

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 12);
};

export const correctPassword = (
  candidatePassword: string,
  userPassword: string
): boolean => {
  return bcrypt.compareSync(candidatePassword, userPassword);
};
