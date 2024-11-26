'use client';

import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <Center h="100vh">
      <Stack align="center" gap="xs">
        <Loader size="lg" color="blue" />
        <Text size="sm" c="dimmed">{message}</Text>
      </Stack>
    </Center>
  );
}


