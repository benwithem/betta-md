'use client';

import { useEffect } from 'react';
import { Button, Container, Text, Title, Stack } from '@mantine/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="md">
        <Title order={1} c="blue.8">Something went wrong!</Title>
        <Text c="dimmed" size="lg" ta="center">
          {error.message || 'An unexpected error occurred.'}
        </Text>
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
}
