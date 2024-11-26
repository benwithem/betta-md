'use client';

import { AppShell, NavLink, ThemeIcon } from '@mantine/core';
import { 
  IconHome, 
  IconChartBar, 
  IconDroplet, 
  IconFlask,
  IconSettings 
} from '@tabler/icons-react';
import Link from 'next/link';

interface NavbarProps {
  pathname: string;
}

export function Navbar({ pathname }: NavbarProps) {
  const links = [
    { 
      label: 'Dashboard', 
      icon: IconHome, 
      href: '/' 
    },
    { 
      label: 'Aquarium Tracker', 
      icon: IconChartBar, 
      href: '/aquarium' 
    },
    { 
      label: 'Maintenance', 
      icon: IconDroplet, 
      href: '/maintenance' 
    },
    { 
      label: 'Water Tests', 
      icon: IconFlask, 
      href: '/tests' 
    },
    { 
      label: 'Settings', 
      icon: IconSettings, 
      href: '/settings' 
    }
  ];

  return (
    <AppShell.Navbar p="md" style={{
      background: 'linear-gradient(180deg, var(--mantine-color-blue-0) 0%, white 100%)'
    }}>
      {links.map((link) => (
        <NavLink
          key={link.href}
          component={Link}
          href={link.href}
          label={link.label}
          leftSection={
            <ThemeIcon variant="light" size="sm">
              <link.icon size={16} />
            </ThemeIcon>
          }
          active={pathname === link.href}
        />
      ))}
    </AppShell.Navbar>
  );
}

