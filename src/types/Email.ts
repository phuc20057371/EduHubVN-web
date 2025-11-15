export type EmailReq = {
    email: string;
}

export type EmailOtp = {
    email: string;
    otp: string;
}

export type EmailSent = {
    to: string;
    subject: string;
    body: string;
};