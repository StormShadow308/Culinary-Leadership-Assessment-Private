'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';


const createNewOrganisationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
});


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

  const handleCreateOrganisation = async () => {
    setIsCreatingOrganisation(true);
    try {
      // For now, just redirect to organisation page
      // You can implement organization creation API later
      redirect('/organisation');
    } catch (error) {
      console.error('Error creating organization:', error);
    } finally {
      setIsCreatingOrganisation(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // For now, just redirect to sign-in page
      // You can implement proper sign out later
      redirect('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
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
