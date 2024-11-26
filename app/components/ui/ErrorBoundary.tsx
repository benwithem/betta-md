'use client';

import { Alert, Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="md">
        <Alert 
          icon={<IconAlertCircle size={24} />}
          title="Something went wrong!"
          color="red"
          radius="md"
        >
          {error.message}
        </Alert>
        <Button 
          onClick={reset}
          variant="light"
          color="blue"
          size="md"
        >
          Try again
        </Button>
      </Stack>
    </Container>
  );
