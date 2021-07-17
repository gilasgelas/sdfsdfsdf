import { IActionResult } from '@etsoo/appscript';
import { CommonPage, TextFieldEx, VBox } from '@etsoo/react';
import { DomUtils } from '@etsoo/shared';
import { Button } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useFormik } from 'formik';
import React from 'react';
import { Helper } from '../app/Helper';
import { SmartApp } from '../app/SmartApp';
import { UserDetector } from '../app/UserDetector';
import Yup from '../app/YupHelper';

// App
const app = SmartApp.instance;

/**
 * Validate password
 * errorMessage is one parameter, add any parameters you need
 * use function, not arrow function, in order to hold the this reference
 */
Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  'validatePassword',
  function (errorMessage: string) {
    return this.test('validate-password', errorMessage, function (value) {
      const { path, createError } = this;

      return (
        (value != null && Helper.isValidPassword(value)) ||
        createError({ path, message: errorMessage })
      );
    });
  }
);

// Form validation schema
const validationSchema = Yup.object({
  oldPassword: Yup.string().required(
    app.get<string>('currentPasswordRequired')
  ),
  password: Yup.string()
    .validatePassword(app.get<string>('passwordTip'))
    .required(app.get<string>('newPasswordRequired'))
    .notOneOf([Yup.ref('oldPassword')], app.get<string>('newPasswordTip')),
  rePassword: Yup.string()
    .required(app.get<string>('repeatPasswordRequired'))
    // oneOf([Yup.ref('newPassword'), null], "Passwords mush match") will fail
    // ref is not proper for reach validation, ref field value is not ready
    .oneOf([Yup.ref('password')], app.get<string>('passwordRepeatError'))
});

// Change password
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
function ChangePassword(_props: RouteComponentProps) {
  // Formik
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      rePassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Submit data
      const data = {
        oldPassword: values.oldPassword,
        password: values.password
      };

      var result = await app.api.put<IActionResult>(
        'User/ChangePassword',
        data
      );
      if (result == null) return;

      if (result.success) {
        // Tip and clear
        app.notifier.succeed(
          app.get('passwordChangeSuccess')!,
          undefined,
          () => {
            // Sign out
            app.api
              .put<boolean>('User/Signout', undefined, {
                onError: (error) => {
                  console.log(error);
                  // Prevent further processing
                  return false;
                }
              })
              .then((_result) => {
                // Clear
                app.userLogout();

                // Go to login page
                app.toLoginPage();
              });
          }
        );
      } else {
        formik.setFieldError('oldPassword', result.title);
        DomUtils.setFocus('oldPassword');
      }
    }
  });

  React.useEffect(() => {
    // Page title
    app.setPageTitle(app.get('changePassword')!);
  }, []);

  return (
    <CommonPage maxWidth="xs">
      <UserDetector />
      <form
        onSubmit={(event) => {
          formik.handleSubmit(event);
          DomUtils.setFocus(formik.errors);
        }}
      >
        <VBox spacing={2}>
          <TextFieldEx
            name="oldPassword"
            label={app.get('currentPassword')}
            showPassword={true}
            autoFocus
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
            }
            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          />
          <TextFieldEx
            name="password"
            label={app.get('newPassword')}
            showPassword={true}
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextFieldEx
            name="rePassword"
            label={app.get('repeatPassword')}
            showPassword={true}
            value={formik.values.rePassword}
            onChange={formik.handleChange}
            error={
              formik.touched.rePassword && Boolean(formik.errors.rePassword)
            }
            helperText={formik.touched.rePassword && formik.errors.rePassword}
          />
          <Button variant="contained" type="submit" fullWidth>
            {app.get('submit')}
          </Button>
        </VBox>
      </form>
    </CommonPage>
  );
}

export default ChangePassword;
