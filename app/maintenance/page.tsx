'use client';

import { Container, Title, Stack } from '@mantine/core';
import { MainLayout } from '../components/layout/MainLayout';
import { MaintenanceForm } from '../components/maintinence/MaintenanceForm';

export default function MaintenancePage() {
  return (
    <MainLayout>
      <Container size="lg">
        <Stack>
          <Title order={1}>Maintenance Log</Title>
          <MaintenanceForm />
        </Stack>
      </Container>
    </MainLayout>
  );
}