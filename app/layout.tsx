import { AppShell, Header, Footer, Navbar, Text, useMantineTheme, MantineTheme } from '@mantine/core';
import Link from 'next/link';

const Layout: React.FC = ({ children }) => {
  const theme: MantineTheme = useMantineTheme();

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs" style={{ backgroundColor: theme.colors.blue[6] }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Link href="/">
              <Text size="xl" weight={700} color="white" style={{ cursor: 'pointer' }}>
                Betta-MD
              </Text>
            </Link>
          </div>
        </Header>
      }
      footer={
        <Footer height={60} p="xs" style={{ backgroundColor: theme.colors.blue[6] }}>
          <Text size="sm" color="white">
            © 2023 Betta-MD. All rights reserved.
          </Text>
        </Footer>
      }
      navbar={
        <Navbar p="xs" width={{ base: 300 }} style={{ backgroundColor: theme.colors.blue[5] }}>
          <Navbar.Link href="/" color="white">
            Home
          </Navbar.Link>
          <Navbar.Link href="/aquarium" color="white">
            Aquarium Tracker
          </Navbar.Link>
        </Navbar>
      }
    >
      {children}
    </AppShell>
  );
};

export default Layout;