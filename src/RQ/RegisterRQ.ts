/**
 * Register request data
 */
export type RegisterRQ = {
  /**
   * Email or mobile
   */
  id: string;

  /**
   * Verification code id
   */
  codeId: string;

  /**
   * Password
   */
  password: string;

  /**
   * Name
   */
  name: string;

  /**
   * Country
   */
  country: string;
};
