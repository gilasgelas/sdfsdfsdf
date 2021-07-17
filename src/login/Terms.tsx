import { PList } from '@etsoo/react';
import { Button } from '@material-ui/core';
import { Link, RouteComponentProps } from '@reach/router';
import { SmartApp } from '../app/SmartApp';
import { SharedLayout } from './SharedLayout';

function Terms(props: RouteComponentProps) {
  // App
  const app = SmartApp.instance;

  return (
    <SharedLayout
      title={app.get('terms')!}
      buttons={
        <Button variant="contained" component={Link} to={app.transformUrl('/')}>
          {app.get('back')}
        </Button>
      }
      {...props}
    >
      <PList items={app.get<string[]>('termsPage')} />
    </SharedLayout>
  );
}

export default Terms;
