'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';

import { authClient } from '~/lib/auth-client';

const createNewOrganisationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
});

type CreateNewOrganisationPayload = z.infer<typeof createNewOrganisationSchema>;

const firstWords = [
  'Global',
  'Advanced',
  'Strategic',
  'Digital',
  'Elite',
  'Innovative',
  'Premier',
  'Dynamic',
  'Universal',
  'Apex',
];

const middleWords = [
  'Tech',
  'Solution',
  'Vision',
  'Data',
  'Insight',
  'Logic',
  'Frontier',
  'System',
  'Network',
  'Quantum',
];

const lastWords = [
  'Partners',
  'Group',
  'Labs',
  'Ventures',
  'Dynamics',
  'Industries',
  'Solutions',
  'Innovations',
  'Systems',
  'Enterprise',
];

function getRandomName() {
  const first = firstWords[Math.floor(Math.random() * firstWords.length)];
  const middle = middleWords[Math.floor(Math.random() * middleWords.length)];
  const last = lastWords[Math.floor(Math.random() * lastWords.length)];
  return `${first} ${middle} ${last}`;
}

export default function NewOragnisationPage() {
  const [randomSuggestion] = useState(getRandomName());
  const [isCreatingOrganisation, setIsCreatingOrganisation] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: zodResolver(createNewOrganisationSchema),
  });

  function useRandomName() {
    const name = randomSuggestion;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    setValue('name', name);
    setValue('slug', slug);
  }

  const handleCreateOrganisation = async (data: CreateNewOrganisationPayload) => {
    setIsCreatingOrganisation(true);
    await authClient.organization
      .create({ name: data.name, slug: data.slug })
      .then(() => {
        redirect('/organisation');
      })
      .finally(() => {
        setIsCreatingOrganisation(false);
      });
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient
      .signOut({ fetchOptions: { onSuccess: () => redirect('/sign-in') } })
      .finally(() => {
        setIsSigningOut(false);
      });
  };

  return (
    <Modal opened={true} onClose={() => {}} title="Create new organisation" centered size="lg">
      <form onSubmit={handleSubmit(handleCreateOrganisation)}>
        <Stack>
          <TextInput
            type="text"
            label="Name"
            placeholder="My Organization"
            {...register('name')}
            error={formState.errors.name?.message}
          />
          <Group gap="xs" style={{ marginTop: -5 }}>
            <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }} onClick={useRandomName}>
              Need inspiration? How about{' '}
              <Text span fw={500} c="orange">
                {randomSuggestion}
              </Text>
              ?
            </Text>
          </Group>
          <TextInput
            type="text"
            label="Slug"
            placeholder="my-organisation"
            {...register('slug')}
            error={formState.errors.slug?.message}
          />
          <Group justify="flex-end">
            <Button mt="lg" variant="outline" onClick={handleSignOut} loading={isSigningOut}>
              Sign out
            </Button>
            <Button mt="lg" type="submit" loading={isCreatingOrganisation}>
              Create organisation
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
