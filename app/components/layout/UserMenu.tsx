'use client';

import { Avatar, Menu, Text } from '@mantine/core';
import { 
  IconUser, 
  IconSettings, 
  IconHelp, 
  IconLogout 
} from '@tabler/icons-react';

export function UserMenu() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar 
          color="blue" 
          radius="xl" 
          style={{ cursor: 'pointer' }}
        >
          AQ
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconUser size={14} />}>
          Profile
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconHelp size={14} />}>
          Help
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item 
          leftSection={<IconLogout size={14} />}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}


