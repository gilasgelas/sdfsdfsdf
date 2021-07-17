import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';
import { SmartApp } from '../app/SmartApp';
import { SharedLayout } from './SharedLayout';
import { StorageUtils } from '@etsoo/shared';
import { CountdownButton, TextFieldEx, TextFieldExMethods } from '@etsoo/react';
import {
  ActionResultError,
  ActionResultId,
  IActionResult
} from '@etsoo/appscript';
import { Constants } from '../app/Constants';

function RegisterVerify(props: RouteComponentProps<{ username: string }>) {
  // App
  const app = SmartApp.instance;

  // Destruct
  const { navigate, username } = props;

  // Refs
  const inputRef = React.useRef<HTMLInputElement>();
  const mRef = React.createRef<TextFieldExMethods>();

  if (username == null) {
    return <Redirect to={app.transformUrl('/login/register')} />;
  }

  // Code id
  let codeId = StorageUtils.getSessionData(Constants.CodeFieldRegister, '');

  // Decode
  const id = decodeURIComponent(username);

  // Tip
  const enterCodeTip = app.get('enterCodeTip')?.replace('{0}', id);

  // Resending
  const resending = async () => {
    const data = {
      country: app.settings.currentCountry.id
    };

    let api: string;
    if (id.indexOf('@') === -1) {
      api = 'SendSMS';
      Object.assign(data, {
        mobile: id,
        action: 1
      });
    } else {
      api = 'SendEmail';
      Object.assign(data, {
        email: id,
        action: 2,
        timezone: app.settings.timeZone ?? app.ipData?.timezone
      });
    }

    var result = await app.api.put<ActionResultId>(`AuthCode/${api}`, data);

    // Error, back to normal
    if (result == null) return 0;

    if (!result.success) {
      // Popup
      app.notifier.alert(ActionResultError.format(result));
      return 0;
    }

    if (result.data?.id == null) {
      return 0;
    }

    codeId = result.data?.id.toString();

    StorageUtils.setSessionData(Constants.CodeFieldRegister, codeId);

    mRef.current?.setError(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }

    return 90;
  };

  // Submit
  const submit = async () => {
    const input = inputRef.current!;
    if (input.value === '') {
      input.focus();
      return;
    }

    const result = await app.api.put<IActionResult>('AuthCode/Validate', {
      id: codeId,
      code: input.value
    });

    if (result == null) return;

    if (!result.success) {
      mRef.current?.setError(result.title);
      return 0;
    }

    navigate!(app.transformUrl('/login/registercomplete/' + username));
  };

  return (
    <SharedLayout
      title={app.get('verification')!}
      subTitle={<Typography variant="subtitle2">{enterCodeTip}</Typography>}
      buttons={[
        <CountdownButton
          variant="outlined"
          key="resending"
          ref={(instance: HTMLButtonElement | null) => {
            if (codeId === '') instance?.click();
          }}
          onAction={resending}
        >
          {app.get('resending')}
        </CountdownButton>,
        <Button variant="contained" key="submit" onClick={submit}>
          {app.get('submit')}
        </Button>
      ]}
      {...props}
    >
      <TextFieldEx
        label={app.get('enterCode')}
        autoCorrect="off"
        autoCapitalize="none"
        inputProps={{ inputMode: 'numeric' }}
        ref={mRef}
        inputRef={inputRef}
        showClear={true}
        onEnter={(e) => {
          submit();
          e.preventDefault();
        }}
      />
    </SharedLayout>
  );
}

export default RegisterVerify;
