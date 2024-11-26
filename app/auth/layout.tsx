import { ReactNode } from 'react';
import { Container, Paper } from '@mantine/core';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        {children}
      </Paper>
    </Container>
  );
}