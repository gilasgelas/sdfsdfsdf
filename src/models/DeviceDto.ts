/**
 * Device data
 */
export type DeviceDto = {
  /**
   * Device id
   */
  id: number;

  /**
   * Name
   */
  name: string;

  /**
   * Enabled
   */
  enabled: boolean;

  /**
   * Last login date
   */
  lastLoginDate?: Date;

  /**
   * Last successful login date
   */
  lastSuccessLoginDate?: Date;
};
