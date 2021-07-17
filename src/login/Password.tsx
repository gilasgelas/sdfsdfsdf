import React from 'react';
import { Button, FormControlLabel, Switch, Link, Box } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';
import { SmartApp } from '../app/SmartApp';
import { SharedLayout } from './SharedLayout';
import { IActionResult, IResultData } from '@etsoo/appscript';
import { HBox, TextFieldEx, TextFieldExMethods } from '@etsoo/react';
import { Lock } from '@material-ui/icons';
import { StorageUtils } from '@etsoo/shared';
import { Constants } from '../app/Constants';
import { LoginResult } from '../models/LoginResult';
import { IApiPayload } from '@etsoo/restclient';
import { LoginRQ } from '../RQ/LoginRQ';

function Password(props: RouteComponentProps<{ username: string }>) {
  // App
  const app = SmartApp.instance;

  // Password ref
  const passwordRef = React.useRef<HTMLInputElement>();
  const mRef = React.createRef<TextFieldExMethods>();

  // Button
  const [buttonDisabled, updateButtonDisabled] = React.useState<boolean>(false);

  // Keep or not
  const [keep, updateKeep] = React.useState<boolean>(
    StorageUtils.getLocalData(Constants.FieldLoginKeep, false)
  );

  // Destruct
  const { navigate, username } = props;

  if (username == null) {
    return <Redirect to={app.transformUrl('/')} />;
  }

  // Decode
  const id = decodeURIComponent(username);

  // Hold on cache
  StorageUtils.setLocalData(Constants.FieldUserIdSaved, id);

  // Format title
  const formatTitle = (result: IActionResult<IResultData>) => {
    let disabled: boolean = false;
    let title: string = result.title ?? 'Unknown';

    switch (result.type) {
      case 'UserFrozen':
      case 'DeviceFrozen':
        const frozenTime = new Date(result.data?.frozenTime);
        console.log(frozenTime, app.culture);
        title = title.replace('{0}', frozenTime.toLocaleString(app.culture));
        disabled = true;
        break;
      case 'AccountExpired':
        const expiry = new Date(result.data?.expiry);
        title = title.replace('{0}', expiry.toLocaleString(app.culture));
        disabled = true;
        break;
      case 'OrgExpired':
        const orgExpiry = new Date(result.data?.orgExpiry);
        title = title.replace('{0}', orgExpiry.toLocaleString(app.culture));
        disabled = true;
        break;
      case 'DeviceDisabled':
      case 'AccountDisabled':
      case 'OrgDisabled':
        disabled = true;
        break;
    }

    return [disabled, title];
  };

  // Submit
  const submit = async () => {
    // password
    const password = passwordRef.current?.value.trim();
    if (password == null || password.length < 4) {
      passwordRef.current?.focus();
      return;
    }

    // Model
    const data: LoginRQ = {
      id,
      pwd: password,
      country: app.settings.currentCountry.id,
      timezone: app.settings.timeZone ?? app.ipData?.timezone
    };

    const payload: IApiPayload<LoginResult, any> = {};
    const result = await app.api.post<LoginResult>('Auth/Login', data, payload);

    if (result != null) {
      if (result.success) {
        // Token
        const refreshToken = app.getResponseToken(payload.response);

        if (refreshToken == null || result.data == null) {
          app.notifier.alert(app.get('unknownError')!);
          return;
        }

        // User data
        const userData = result.data;

        // User login
        app.userLogin(userData, refreshToken, keep);

        // Keep
        StorageUtils.setLocalData(Constants.FieldLoginKeep, keep);

        // Navigate to service
        navigate!(app.transformUrl('/home'));
      } else {
        const [disabled, title] = formatTitle(result);
        mRef.current?.setError(title);

        if (disabled) {
          updateButtonDisabled(true);
        } else {
          passwordRef.current?.focus();
        }
      }
    }
  };

  return (
    <SharedLayout
      title={id}
      buttons={
        <Button variant="contained" onClick={submit} disabled={buttonDisabled}>
          {app.get('submit')}
        </Button>
      }
      {...props}
    >
      <input hidden name="username" defaultValue={id} autoComplete="username" />
      <HBox spacing={1} alignItems="flex-start">
        <Box sx={{ paddingTop: 3 }}>
          <Lock color="primary" />
        </Box>
        <TextFieldEx
          name="password"
          label={app.get('yourPassword')}
          showPassword={true}
          autoComplete="current-password"
          inputRef={passwordRef}
          ref={mRef}
          autoFocus
          onEnter={(e) => {
            submit();
            e.preventDefault();
          }}
        />
      </HBox>
      <FormControlLabel
        control={
          <Switch
            checked={keep}
            onChange={(e) => updateKeep(e.target.checked)}
          />
        }
        label={app.get('keepLogged')}
      />
      <div>
        <Link href={app.transformUrl(`/login/callbackverify/${username}`)}>
          {app.get('forgotPasswordTip')}
        </Link>
      </div>
    </SharedLayout>
  );
}

export default Password;
