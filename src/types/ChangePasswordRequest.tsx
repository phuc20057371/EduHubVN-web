export type ChangePasswordRequest = {
  email: string;
  otp: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};