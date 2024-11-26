'use client';

import { 
  Container, 
  Stack, 
  Card, 
  Group, 
  Title, 
  Text, 
  Tooltip, 
  ActionIcon, 
  Button, 
  Paper, 
  RingProgress, 
  SimpleGrid 
} from '@mantine/core';
import { IconRefresh, IconPlus, IconDroplet, IconThermometer, IconTestPipe2Filled, IconAlertTriangle } from '@tabler/icons-react';
import { MainLayout } from '../components/layout/MainLayout';
import { WaterParameterCard } from '../components/parameters/WaterParameterCard';

export default function AquariumTracker() {
  return (
    <MainLayout>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Header Section */}
          <Card shadow="sm" p="lg" radius="lg" withBorder>
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={2} c="blue.7" mb="xs">Aquarium Tracker</Title>
                <Text c="dimmed" size="sm">
                  Track your aquarium parameters and get dosing recommendations
                </Text>
              </div>
              <Group>
                <Tooltip label="Refresh readings">
                  <ActionIcon variant="light" color="blue" size="lg" radius="md">
                    <IconRefresh size={20} />
                  </ActionIcon>
                </Tooltip>
                <Button 
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                  leftSection={<IconPlus size={16} />}
                  radius="md"
                >
                  Add New Log
                </Button>
              </Group>
            </Group>

            {/* Water Quality Overview */}
            <Paper bg="blue.0" p="md" radius="md" mb="lg">
              <Group align="flex-start">
                <RingProgress
                  size={80}
                  thickness={8}
                  roundCaps
                  sections={[{ value: 87, color: 'blue' }]}
                  label={
                    <Text ta="center" size="xs" fw={700}>
                      87%
                    </Text>
                  }
                />
                <div>
                  <Text fw={500} mb={5}>Water Quality Score</Text>
                  <Text size="sm" c="dimmed">
                    Your aquarium is in good condition. pH levels could use some attention.
                  </Text>
                </div>
              </Group>
            </Paper>

            {/* Stats Cards */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <WaterParameterCard 
                icon={IconDroplet}
                label="Last Water Change"
                value="3 days ago"
                prevValue="7 days ago"
                color="blue"
                status="good"
              />
              <WaterParameterCard 
                icon={IconThermometer}
                label="Temperature"
                value="78.5°F"
                prevValue="77.8°F"
                color="orange"
                status="warning"
              />
              <WaterParameterCard 
                icon={IconTestPipe2Filled}
                label="pH Level"
                value="7.2"
                prevValue="7.0"
                color="violet"
                status="good"
              />
            </SimpleGrid>
          </Card>

          {/* Recent Logs Section */}
          <Card shadow="sm" p="lg" radius="lg" withBorder>
            <Title order={3} mb="lg">Recent Logs</Title>
            <Paper py="xl" px="md" bg="gray.0" radius="md">
              <Stack align="center" gap="md">
                <IconAlertTriangle size={40} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed" ta="center">
                  No logs recorded yet. Add your first water parameter log to start tracking.
                </Text>
                <Button variant="light" color="blue">
                  Create First Log
                </Button>
              </Stack>
            </Paper>
          </Card>
        </Stack>
      </Container>
    </MainLayout>
  );
}