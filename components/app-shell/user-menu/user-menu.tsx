import { redirect } from 'next/navigation';

import { Menu, MenuDropdown, MenuItem, MenuLabel } from '@mantine/core';

import { IconLogout } from '@tabler/icons-react';

import { authClient } from '~/lib/auth-client';

import { ThemeSelect } from './theme-select';
import { UserInfo } from './user-info';

export function UserMenu() {
  const signOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => redirect('/sign-in') } });
  };

  return (
    <>
      <Menu
        width={150}
        position="bottom"
        transitionProps={{ transition: 'pop-top-right' }}
        withinPortal
      >
        <UserInfo />
        <MenuDropdown>
          <ThemeSelect />
          <MenuLabel>Account</MenuLabel>
          <MenuItem onClick={signOut} leftSection={<IconLogout width={16} />}>
            Sign out
          </MenuItem>
        </MenuDropdown>
      </Menu>
    </>
  );
}
