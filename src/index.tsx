import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SmartApp } from './app/SmartApp';
import { Router } from '@reach/router';
import { NotFound } from './NotFound';
import Password from './login/Password';
import { CssBaseline } from '@material-ui/core';
import Home from './main/Home';

// Root
const root = document.getElementById('root')!;

// App
SmartApp.setup();
const app = SmartApp.instance;

// Lazy load components
const About = React.lazy(() => import('./login/About'));
const Register = React.lazy(() => import('./login/Register'));
const RegisterPassword = React.lazy(() => import('./login/RegisterPassword'));
const RegisterVerify = React.lazy(() => import('./login/RegisterVerify'));
const RegisterComplete = React.lazy(() => import('./login/RegisterComplete'));
const CallbackVerify = React.lazy(() => import('./login/CallbackVerify'));
const CallbackComplete = React.lazy(() => import('./login/CallbackComplete'));
const Terms = React.lazy(() => import('./login/Terms'));

// Notifier provider
const NotifierProvider = SmartApp.notifierProvider;

// Culture provider
const CultureStateProvider = SmartApp.cultureState.provider;

// User state
const UserStateProvider = app.userState.provider;

// Page state
const PageStateProvider = SmartApp.pageState.provider;

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <CultureStateProvider>
      <NotifierProvider />
      <UserStateProvider
        update={(dispatch) => {
          app.userStateDispatch = dispatch;
        }}
      >
        <PageStateProvider
          update={(dispatch) => {
            app.pageStateDispatch = dispatch;
          }}
        >
          <React.Suspense fallback={null}>
            <Router basepath={app.settings.homepage} primary={true}>
              <App path="/" />

              <About path="/login/about" />
              <Register path="/login/register/*" />
              <RegisterPassword path="/login/registerpassword/:username" />
              <RegisterVerify path="/login/registerverify/:username" />
              <RegisterComplete path="/login/registercomplete/:username" />
              <CallbackVerify path="/login/callbackverify/:username" />
              <CallbackComplete path="/login/callbackcomplete/:username" />
              <Password path="/login/password/:username" />
              <Terms path="/login/terms" />

              <Home path="/home/*" />

              <NotFound default />
            </Router>
          </React.Suspense>
        </PageStateProvider>
      </UserStateProvider>
    </CultureStateProvider>
  </React.Fragment>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV !== 'production') {
  reportWebVitals(console.log);
}
