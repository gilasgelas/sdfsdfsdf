import { IdLabelDto } from '@etsoo/appscript';
import { ListPage, ListPageForwardRef, Tiplist } from '@etsoo/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography
} from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { SmartApp } from '../app/SmartApp';
import { UserDetector } from '../app/UserDetector';
import { LoginHistoryDto } from '../models/LoginHistoryDto';

function LoginHistory(props: RouteComponentProps) {
  // App
  const app = SmartApp.instance;

  // Refs
  const ref = React.createRef<ListPageForwardRef>();

  // Load data
  const reloadData = async () => {
    ref.current?.reset();
  };

  React.useEffect(() => {
    // Page title
    app.setPageTitle(app.get('menuLoginHistory')!);
  }, [app]);

  return (
    <React.Fragment>
      <UserDetector success={reloadData} />
      <ListPage<LoginHistoryDto>
        mRef={ref}
        onRefresh={reloadData}
        fields={[
          <Tiplist<IdLabelDto>
            label={app.get('device')!}
            name="deviceId"
            search
            loadData={async (keyword, id) => {
              return await app.api.post<IdLabelDto[]>(
                'User/DeviceList',
                {
                  id,
                  keyword
                },
                { defaultValue: [], showLoading: false }
              );
            }}
          />
        ]}
        listItemSize={150}
        loadData={async (data, page, loadBatchSize) => {
          data.set('currentPage', page.toString());
          data.set('batchSize', loadBatchSize.toString());
          return await app.api.post<LoginHistoryDto[]>(
            'User/LoginHistory',
            data,
            { defaultValue: [], showLoading: false }
          );
        }}
        itemRenderer={({ index, data, style }) => {
          return data == null ? (
            <LinearProgress />
          ) : (
            <div style={style}>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {data.deviceName}
                  </Typography>

                  <Typography variant="caption" noWrap>
                    {[data.country, data.language, data.timezone].join(', ')}
                  </Typography>

                  <Typography
                    variant="body2"
                    noWrap
                    color={data.success ? 'green' : 'red'}
                  >
                    {data.success ? 'Success' : 'Failed: ' + data.reason}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant="caption" noWrap>
                      {app.formatDate(data.creation, 'ds')}
                    </Typography>
                    <Button size="small">JSON data</Button>
                  </Box>
                </CardContent>
              </Card>
            </div>
          );
        }}
      />
    </React.Fragment>
  );
}

export default LoginHistory;
