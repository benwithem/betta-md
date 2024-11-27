'use client';

import { Container, Paper, Title } from '@mantine/core';
import { RegisterForm } from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} mb="lg" ta="center">
          Create Account
        </Title>
        <RegisterForm />
      </Paper>
    </Container>
  );
}