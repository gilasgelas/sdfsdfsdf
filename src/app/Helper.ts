/**
 * Helper class
 */
export class Helper {
  /**
   * Is static password
   * @param password Input password
   */
  static isValidPassword(password: string) {
    // Length check
    if (password.length < 6) return false;

    // One letter and number required
    if (/\d+/gi.test(password) && /[a-z]+/gi.test(password)) {
      return true;
    }

    return false;
  }
}
