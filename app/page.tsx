'use client';

import { MainLayout } from '../app/components/layout/MainLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  SimpleGrid,
  Card,
  Group,
  ThemeIcon,
  Button,
  Paper,
  RingProgress
} from '@mantine/core';
import { 
  IconFish, 
  IconDroplet,
  IconFlask,
  IconChartBar 
} from '@tabler/icons-react';
import Link from 'next/link';

const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href,
  color = 'blue' 
}: {
  title: string;
  description: string;
  icon: typeof IconFish;
  href: string;
  color?: string;
}) => (
  <Card 
    component={Link}
    href={href}
    shadow="sm" 
    padding="lg" 
    radius="md" 
    withBorder
    style={{ 
      textDecoration: 'none',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-5px)' }
    }}
  >
    <Group>
      <ThemeIcon 
        size="xl" 
        radius="md" 
        variant="light" 
        color={color}
      >
        <Icon size={28} />
      </ThemeIcon>
      <div>
        <Text fw={500} size="lg" mb={5}>{title}</Text>
        <Text c="dimmed" size="sm">{description}</Text>
      </div>
    </Group>
  </Card>
);

export default function HomePage() {
  return (
    <MainLayout>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Welcome Section */}
          <div>
            <Title order={1} size="h2" mb="xs">Welcome to Betta-MD</Title>
            <Text c="dimmed" size="lg">
              Your comprehensive aquarium management dashboard
            </Text>
          </div>

          {/* Tank Status Overview */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group align="flex-start" mb="md">
              <RingProgress
                size={100}
                thickness={10}
                roundCaps
                sections={[
                  { value: 40, color: 'cyan' },
                  { value: 30, color: 'blue' },
                  { value: 20, color: 'indigo' }
                ]}
                label={
                  <Group justify="center">
                    <IconFish size={20} />
                  </Group>
                }
              />
              <div>
                <Text fw={500} size="lg">Tank Health Overview</Text>
                <Text size="sm" c="dimmed" mt={5}>
                  Your aquarium is in good condition. Next water change recommended in 2 days.
                </Text>
              </div>
            </Group>

            <Paper bg="blue.0" p="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>Quick Actions Needed</Text>
                  <Text size="xs" c="dimmed">Check pH levels and perform water test</Text>
                </div>
                <Button variant="light" size="xs" component={Link} href="/aquarium">
                  Go to Tracker
                </Button>
              </Group>
            </Paper>
          </Card>

          {/* Main Navigation Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            <DashboardCard
              title="Aquarium Tracker"
              description="Monitor water parameters and get recommendations"
              icon={IconChartBar}
              href="/aquarium"
              color="blue"
            />
            <DashboardCard
              title="Maintenance Log"
              description="Track water changes and maintenance tasks"
              icon={IconDroplet}
              href="/maintenance"
              color="cyan"
            />
            <DashboardCard
              title="Water Tests"
              description="Record and analyze water test results"
              icon={IconFlask}
              href="/tests"
              color="indigo"
            />
          </SimpleGrid>

          {/* Recent Activity or Tips could go here */}
        </Stack>
      </Container>
    </MainLayout>
  );
}