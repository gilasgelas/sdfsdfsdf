import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';
import { SmartApp } from '../app/SmartApp';
import { SharedLayout } from './SharedLayout';
import { TextFieldEx, TextFieldExMethods } from '@etsoo/react';
import { Helper } from '../app/Helper';
import { StorageUtils } from '@etsoo/shared';
import { ActionResultError, IActionResult } from '@etsoo/appscript';
import { Constants } from '../app/Constants';
import { ResetPasswordRQ } from '../RQ/ResetPasswordRQ';

function CallbackComplete(props: RouteComponentProps<{ username: string }>) {
  // Destructure
  const { navigate } = props;

  // App
  const app = SmartApp.instance;

  // Password tip
  const passwordTip = app.get('passwordTip');

  // Refs
  const passwordRef = React.useRef<HTMLInputElement>();
  const passwordMethodRef = React.createRef<TextFieldExMethods>();

  const repeatRef = React.useRef<HTMLInputElement>();
  const repeatMethodRef = React.createRef<TextFieldExMethods>();

  // Destruct
  const { username } = props;

  const codeId = StorageUtils.getSessionData(Constants.CodeFieldCallback, '');

  if (username == null || codeId === '') {
    return <Redirect to={app.transformUrl('/')} />;
  }

  // Decode
  const id = decodeURIComponent(username);

  // Repeat step
  const repeatStep = (check: boolean = false) => {
    const password = passwordRef.current!;
    if (password.value === '') {
      password.focus();
      return false;
    }

    if (!Helper.isValidPassword(password.value)) {
      passwordMethodRef.current?.setError(app.get('passwordTip'));
      password.focus();
      return false;
    }

    if (!check) repeatRef.current?.focus();

    return true;
  };

  // Submit
  const submitClick = async () => {
    if (!repeatStep(true)) {
      return;
    }

    const repeat = repeatRef.current!;
    if (repeat.value === '') {
      repeat.focus();
      return;
    }

    if (repeat.value !== passwordRef.current?.value) {
      repeatMethodRef.current?.setError(app.get('passwordRepeatError'));
      return;
    }

    // Submit data
    const data: ResetPasswordRQ = {
      id,
      codeId,
      password: repeat.value,
      country: app.settings.currentCountry.id
    };

    const result = await app.api.put<IActionResult>('Auth/ResetPassword', data);
    if (result == null) return;

    if (result.success) {
      // Clear the code
      StorageUtils.setSessionData(Constants.CodeFieldCallback, undefined);

      // Back to the login page
      navigate!(app.transformUrl(`/login/password/${username}`));
      return;
    }

    app.notifier.alert(ActionResultError.format(result));
  };

  return (
    <SharedLayout
      title={app.get('createPassword')!}
      subTitle={<Typography variant="subtitle2">{id}</Typography>}
      buttons={[
        <Button variant="contained" key="next" onClick={submitClick}>
          {app.get('submit')}
        </Button>
      ]}
      {...props}
    >
      <TextFieldEx
        label={app.get('yourPassword')}
        showPassword={true}
        autoComplete="new-password"
        autoFocus
        inputRef={passwordRef}
        ref={passwordMethodRef}
        onEnter={(e) => {
          repeatStep();
          e.preventDefault();
        }}
      />
      <TextFieldEx
        label={app.get('repeatPassword')}
        showPassword={true}
        inputRef={repeatRef}
        ref={repeatMethodRef}
        onEnter={(e) => {
          submitClick();
          e.preventDefault();
        }}
      />
      <Typography variant="body2">* {passwordTip}</Typography>
    </SharedLayout>
  );
}

export default CallbackComplete;
