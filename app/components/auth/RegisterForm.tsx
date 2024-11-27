'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Text,
  Anchor,
  Divider
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        router.push('/auth/login?registered=true');
      } else {
        // Registration failed
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error}
          </Alert>
        )}

        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Create a strong password"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
        >
          Create Account
        </Button>

        <Divider label="or" labelPosition="center" />

        <Text c="dimmed" size="sm" ta="center">
          Already have an account?{' '}
          <Anchor component={Link} href="/auth/login" size="sm">
            Login
          </Anchor>
        </Text>

        <Text size="xs" c="dimmed" ta="center">
          By registering, you agree to our{' '}
          <Anchor href="#" target="_blank" size="xs">
            Terms of Service
          </Anchor>{' '}
          and{' '}
          <Anchor href="#" target="_blank" size="xs">
            Privacy Policy
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}