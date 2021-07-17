export type ResetPasswordRQ = {
  /**
   * Email or mobile
   */
  id: string;

  /**
   * Verification code id
   */
  codeId: string;

  /**
   * New password
   */
  password: string;

  /**
   * Country
   */
  country: string;
};
