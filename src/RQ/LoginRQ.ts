import { LoginIdRQ } from './LoginIdRQ';

/**
 * Login request data
 */
export type LoginRQ = LoginIdRQ & {
  /**
   * Password
   */
  pwd: string;

  /**
   * Organization
   */
  org?: number;

  /**
   * Service
   */
  service?: string;

  /**
   * Time zone
   */
  timezone?: string;
};
