import { SmartApp } from './SmartApp';

/**
 * User detect callback interface
 */
export interface IUserDetectCallback {
  (): void;
}

/**
 * User detector component
 * @returns component
 */
export function UserDetector(props: { success?: IUserDetectCallback }) {
  // App
  const app = SmartApp.instance;

  // Success callback
  const { success } = props;

  return (
    <app.userStateUpdate
      update={(authorized) => {
        if (authorized == null) {
          app.tryLogin();
        } else if (!authorized) {
          app.toLoginPage();
        } else if (success != null) {
          success();
        }
      }}
    />
  );
}
