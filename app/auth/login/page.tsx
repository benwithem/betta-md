'use client';

import { Container, Paper, Title } from '@mantine/core';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} mb="lg" ta="center">
          Login to Betta-MD
        </Title>
        <LoginForm />
      </Paper>
    </Container>
  );
}