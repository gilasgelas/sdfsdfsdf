import { IActionResult } from '@etsoo/appscript';
import { ISmartUser } from '../app/SmartUser';

/**
 * User login result
 */
export type LoginResult = IActionResult<ISmartUser>;
