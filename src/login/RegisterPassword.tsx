import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { Link, Redirect, RouteComponentProps } from '@reach/router';
import { SmartApp } from '../app/SmartApp';
import { SharedLayout } from './SharedLayout';
import { TextFieldEx, TextFieldExMethods } from '@etsoo/react';
import { Helper } from '../app/Helper';
import { StorageUtils } from '@etsoo/shared';
import { Constants } from '../app/Constants';

function RegisterPassword(props: RouteComponentProps<{ username: string }>) {
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

  if (username == null) {
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

  // Next
  const nextClick = () => {
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

    // Hold the password
    StorageUtils.setSessionData(Constants.FieldRegisterPassword, repeat.value);

    // Continue
    navigate!(
      app.transformUrl('/login/registerverify/' + encodeURIComponent(id))
    );
  };

  return (
    <SharedLayout
      title={app.get('createPassword')!}
      subTitle={<Typography variant="subtitle2">{id}</Typography>}
      buttons={[
        <Button
          variant="outlined"
          component={Link}
          key="back"
          to={app.transformUrl('/login/register')}
        >
          {app.get('back')}
        </Button>,
        <Button variant="contained" key="next" onClick={nextClick}>
          {app.get('nextStep')}
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
          nextClick();
          e.preventDefault();
        }}
      />
      <Typography variant="body2">* {passwordTip}</Typography>
    </SharedLayout>
  );
}

export default RegisterPassword;
