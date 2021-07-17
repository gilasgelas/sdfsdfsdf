/**
 * Refresh token request data
 */
export type RefreshTokenRQ = {
  /**
   * Password for login
   */
  pwd?: string;

  /**
   * Country
   */
  country: string;

  /**
   * Time zone
   */
  timezone?: string;
};
