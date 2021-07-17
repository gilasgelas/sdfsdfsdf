import React from 'react';
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import { SmartApp } from './SmartApp';
import { Link } from '@reach/router';
import { UserAvatar } from '@etsoo/react';

export function UserMenu() {
  // App
  const app = SmartApp.instance;

  // User context
  const Context = app.userState.context;

  // User menu anchor
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();

  // User menu open or not
  const isMenuOpen = Boolean(anchorEl);

  // User menu
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(undefined);
  };

  // Sign out
  const handleSignout = () => {
    // Close menu
    setAnchorEl(undefined);

    // Sign out
    app.api
      .put<boolean>('User/Signout', undefined, {
        onError: (error) => {
          console.log(error);
          // Prevent further processing
          return false;
        }
      })
      .then((_result) => {
        // Clear
        app.userLogout();

        // Go to login page
        app.toLoginPage();
      });
  };

  return (
    <React.Fragment>
      <IconButton
        edge="end"
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <Context.Consumer>
          {(user) => (
            <UserAvatar title={user.state.name} src={user.state.avatar} />
          )}
        </Context.Consumer>
      </IconButton>
      <Menu
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: -0.4,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        disableScrollLock={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={isMenuOpen}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} to="/home/updateavatar">
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{app.get('updateAvatar')}</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/home/changepassword">
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{app.get('changePassword')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{app.get('signout')}</ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
