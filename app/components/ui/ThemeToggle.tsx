'use client';

import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <Tooltip label={`Switch to ${computedColorScheme === 'dark' ? 'light' : 'dark'} theme`}>
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
        variant="subtle"
        color="gray"
        size="lg"
      >
        {computedColorScheme === 'dark' ? (
          <IconSun size={20} color="white" />
        ) : (
          <IconMoon size={20} color="white" />
        )}
      </ActionIcon>
    </Tooltip>
  );
}


