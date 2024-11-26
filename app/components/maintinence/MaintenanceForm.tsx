import React, { useState } from 'react';
import { 
  NumberInput, 
  Button, 
  Box, 
  Title, 
  Group, 
  Stack,
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';

interface MaintenanceLogFormValues {
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
}

export function MaintenanceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<MaintenanceLogFormValues>({
    initialValues: {
      ph: 7.0,
      ammonia: 0,
      nitrite: 0,
      nitrate: 0,
    },
    validate: {
      ph: (value) => (value < 0 || value > 14 ? 'pH must be between 0 and 14' : null),
      ammonia: (value) => (value < 0 ? 'Ammonia cannot be negative' : null),
      nitrite: (value) => (value < 0 ? 'Nitrite cannot be negative' : null),
      nitrate: (value) => (value < 0 ? 'Nitrate cannot be negative' : null),
    },
  });

  const handleSubmit = async (values: MaintenanceLogFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/maintenance-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No need for Authorization header with our mock setup
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        form.reset();
      } else {
        const errorData: { error?: string } = await response.json();
        setSubmitError(errorData.error || 'Failed to create maintenance log');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maw={400} mx="auto">
      <Title order={2} mb="md">Add Maintenance Log</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <NumberInput
            label="pH"
            placeholder="Enter pH value"
            min={0}
            max={14}
            step={0.1}
            {...form.getInputProps('ph')}
          />
          <NumberInput
            label="Ammonia (ppm)"
            placeholder="Enter ammonia level"
            min={0}
            step={0.01}
          />
          <NumberInput
            label="Nitrite (ppm)"
            placeholder="Enter nitrite level"
            min={0}
            step={0.01}
            {...form.getInputProps('nitrite')}
          />
          <NumberInput
            label="Nitrate (ppm)"
            placeholder="Enter nitrate level"
            min={0}
            step={0.1}
            {...form.getInputProps('nitrate')}
          />
          {submitError && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">
              {submitError}
            </Alert>
          )}
          {submitSuccess && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Success!" color="green">
              Maintenance log created successfully!
            </Alert>
          )}
          <Group justify="flex-end" mt="md">
            <Button type="submit" loading={isSubmitting}>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
