import Layout from './Layout';
import { Card, Text, Button, Group } from '@mantine/core';

const AquariumTracker = () => {
  return (
    <Layout>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text weight={700} size="xl" mb="sm">
          Aquarium Tracker
        </Text>
        <Text size="sm" color="dimmed">
          Track your aquarium parameters and get dosing recommendations.
        </Text>
        <Group position="right" mt="md">
          <Button variant="light" color="blue">
            Add New Log
          </Button>
        </Group>
      </Card>
    </Layout>
  );
};

export default AquariumTracker;