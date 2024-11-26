'use client';

import { 
  Group, 
  Burger, 
  UnstyledButton, 
  ThemeIcon, 
  Text 
} from '@mantine/core';
import { IconFish } from '@tabler/icons-react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function Header({ opened, toggle }: HeaderProps) {
  return (
    <AppShell.Header style={{
      background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-cyan-6) 100%)',
      borderBottom: 'none'
    }}>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
          />
          <UnstyledButton component={Link} href="/">
            <Group>
              <ThemeIcon 
                size="lg" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                style={{ border: '2px solid white' }}
              >
                <IconFish size={20} />
              </ThemeIcon>
              <Text fw={700} size="lg" c="white">
                Betta-MD
              </Text>
            </Group>
          </UnstyledButton>
        </Group>

        <Group>
          <ThemeToggle />
          <UserMenu />
        </Group>
      </Group>
    </AppShell.Header>
  );
}


