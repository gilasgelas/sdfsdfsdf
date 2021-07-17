import React from 'react';
import { TextFieldEx } from '@etsoo/react';
import { Button } from '@material-ui/core';
import { Link, RouteComponentProps } from '@reach/router';
import { SmartApp } from '../app/SmartApp';
import { SharedLayout } from './SharedLayout';
import { IActionResult } from '@etsoo/appscript';

function Register(props: RouteComponentProps<{ '*': string }>) {
  // Destructure
  const { navigate } = props;

  let username = props['*'];
  if (username) username = decodeURIComponent(username);

  // App
  const app = SmartApp.instance;

  // Login id field
  const loginRef = React.useRef<HTMLInputElement>();

  // Next button click
  const nextClick = async () => {
    // Input check
    const input = loginRef.current!;
    const id = input.value.trim();
    if (id == null || id === '') {
      input.focus();
      return;
    }

    // Get the result
    const data = {
      id,
      country: app.settings.currentCountry.id
    };

    const result = await app.api.get<IActionResult>('Auth/LoginId', data);

    if (result != null) {
      if (result.success) {
        // Account registered
        app.notifier.confirm(app.get('userFound')!, undefined, (value) => {
          if (value) {
            navigate!(
              app.transformUrl('/login/password/' + encodeURIComponent(id))
            );
          } else {
            input.focus();
          }
        });
      } else {
        // Continue
        navigate!(
          app.transformUrl('/login/registerpassword/' + encodeURIComponent(id))
        );
      }
    }
  };

  return (
    <SharedLayout
      title={app.get('register')!}
      buttons={[
        <Button
          variant="outlined"
          component={Link}
          key="back"
          to={app.transformUrl('/')}
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
        label={app.get('loginId')}
        inputRef={loginRef}
        autoFocus
        autoCorrect="off"
        autoCapitalize="none"
        inputProps={{ inputMode: 'email' }}
        showClear={true}
        defaultValue={username}
        onEnter={(e) => {
          nextClick();
          e.preventDefault();
        }}
      />
    </SharedLayout>
  );
}

export default Register;
