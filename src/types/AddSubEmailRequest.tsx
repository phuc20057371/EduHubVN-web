export type SendSubEmailOtpRequest = {
  email: string;
};

export type AddSubEmailRequest = {
  email: string;
  otp: string;
};