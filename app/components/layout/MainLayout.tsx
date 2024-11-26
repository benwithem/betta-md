'use client';

import { 
  AppShell, 
  Box
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Navbar } from './Navbar';

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <Header opened={opened} toggle={toggle} />
      <Navbar pathname={pathname} />
      
      <AppShell.Main style={{ 
        backgroundColor: 'var(--mantine-color-gray-0)',
        backgroundImage: 'radial-gradient(var(--mantine-color-blue-0) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        <Box style={{ minHeight: '100vh' }}>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;