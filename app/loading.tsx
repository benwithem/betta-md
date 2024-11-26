import { Container, Loader, Center } from '@mantine/core';

export default function Loading() {
  return (
    <Container size="md" py="xl">
      <Center>
        <Loader color="blue" size="lg" />
      </Center>
    </Container>
  );
}
