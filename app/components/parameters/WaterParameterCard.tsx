'use client';

import { 
  Text, 
  Paper,
  Group,
  Badge,
  Timeline,
  Transition,
  rem
} from '@mantine/core';
import { 
  IconCheck,
  IconAlertCircle,
  IconDroplet
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface WaterParameterCardProps { 
  icon: typeof IconDroplet;
  label: string;
  value: string;
  prevValue?: string;
  color?: string;
  status?: 'good' | 'warning' | 'critical';
  lastUpdated?: string;
}

export function WaterParameterCard({ 
  icon: Icon, 
  label, 
  value, 
  prevValue,
  color = 'blue',
  status = 'good',
  lastUpdated = '2h ago'
}: WaterParameterCardProps) {
  const [showDetails, { toggle }] = useDisclosure(false);
  
  const statusColor = {
    good: 'green',
    warning: 'yellow',
    critical: 'red'
  }[status];

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      radius="lg" 
      withBorder
      onClick={toggle}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" mb="xs">
        <Group>
          <Icon 
            size={28} 
            color={`var(--mantine-color-${color}-6)`} 
            stroke={1.5} 
          />
          <div>
            <Text size="sm" fw={500} tt="uppercase" c="dimmed">
              {label}
            </Text>
            <Group gap="xs">
              <Text fw={700} size="xl">
                {value}
              </Text>
              {prevValue && (
                <Text size="sm" c="dimmed" style={{ marginTop: rem(4) }}>
                  from {prevValue}
                </Text>
              )}
            </Group>
          </div>
        </Group>
        <Badge color={statusColor} variant="light" size="lg">
          {status.toUpperCase()}
        </Badge>
      </Group>

      <Transition mounted={showDetails} transition="slide-down" duration={200}>
        {(styles) => (
          <div style={styles}>
            <Text size="sm" c="dimmed" mb="sm">
              Last updated {lastUpdated}
            </Text>
            <Timeline active={1} bulletSize={24} lineWidth={2}>
              <Timeline.Item 
                bullet={<IconCheck size={12} />} 
                title="Previous reading"
              >
                <Text size="xs" mt={4}>{prevValue}</Text>
              </Timeline.Item>
              <Timeline.Item 
                bullet={<IconAlertCircle size={12} />} 
                title="Current reading"
              >
                <Text size="xs" mt={4}>{value}</Text>
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Transition>
    </Paper>
  );
}