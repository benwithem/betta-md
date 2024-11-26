// app/components/parameters/WaterParameterCard.tsx
import { Card, Group, Text, ThemeIcon } from '@mantine/core';
import { IconProps } from '@tabler/icons-react';
import type { FC } from 'react';

interface WaterParameterCardProps {
  icon: FC<IconProps>;
  label: string;
  value: string | number;
  prevValue?: string | number;
  status?: 'good' | 'warning' | 'critical';
  unit?: string;
}

export function WaterParameterCard({
  icon: Icon,
  label,
  value,
  prevValue,
  status = 'good',
  unit = ''
}: WaterParameterCardProps) {
  const statusColors = {
    good: 'green',
    warning: 'yellow',
    critical: 'red'
  };

  return (
    <Card withBorder radius="md" padding="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            {label}
          </Text>
          <Text size="lg" fw={500}>
            {value}
            {unit && <span style={{ fontSize: '0.8em' }}>{unit}</span>}
          </Text>
          {prevValue && (
            <Text c="dimmed" size="sm" mt={4}>
              Previous: {prevValue}
              {unit && unit}
            </Text>
          )}
        </div>
        <ThemeIcon
          size="lg"
          radius="md"
          variant="light"
          color={statusColors[status]}
        >
          <Icon size={20} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}