import { Button } from '@material-ui/core';
import { RouteComponentProps, navigate } from '@reach/router';
import { SmartApp } from './app/SmartApp';
import { SharedLayout } from './login/SharedLayout';

/**
 * Not found case component
 */
export function NotFound(props: RouteComponentProps) {
  // Destruct
  const { location } = props;

  // App
  const app = SmartApp.instance;

  // Currently, navigate from props always failed with step number -1
  const goBack = () => {
    navigate(-1);
  };

  return (
    <SharedLayout
      title={app.get('pageNotFound')!}
      buttons={
        <Button variant="contained" onClick={goBack}>
          {app.get('back')}
        </Button>
      }
      {...props}
    >
      <p>
        <b>Origin</b>: {location!.origin}
        <br />
        <b>URL</b>: {location!.href}
      </p>
    </SharedLayout>
  );
}
