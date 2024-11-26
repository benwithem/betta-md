'use client';

import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { MaintenanceForm } from '../components/maintinence/MaintenanceForm';
import { Container, Title } from '@mantine/core';

export default function MaintenancePage() {
  return (
    <MainLayout>
      <Container size="lg" py="xl">
        <Title order={1} mb="xl">Maintenance Log</Title>
        <MaintenanceForm />
      </Container>
    </MainLayout>
  );
}
