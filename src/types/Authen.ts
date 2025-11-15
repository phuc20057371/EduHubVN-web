export type LoginReq = {
    email: string;
    password: string;
};

export type ChangePasswordReq = {
    email: string;
    otp: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type ResetPasswordReq = {
    subAdminId: string;
    newPassword: string;
};

export type ResetPasswordUserReq = {
    email: string;
    otp: string;
    newPassword: string;

}