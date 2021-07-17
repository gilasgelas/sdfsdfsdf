import * as Yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';
import { Helper } from './Helper';

/**
 * Validate password
 * https://github.com/jquense/yup/issues/312 for TypeScript
 * errorMessage is one parameter, add any parameters you need
 * use function, not arrow function, in order to hold the this reference
 */
Yup.addMethod(Yup.string, 'validatePassword', function (errorMessage: string) {
  return this.test('validate-password', errorMessage, function (value) {
    const { path, createError } = this;

    return (
      (value != null && Helper.isValidPassword(value)) ||
      createError({ path, message: errorMessage })
    );
  });
});

declare module 'Yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends Yup.BaseSchema<TType, TContext, TOut> {
    validatePassword(errorMessage?: string): StringSchema<TType, TContext>;
  }
}

export default Yup;
