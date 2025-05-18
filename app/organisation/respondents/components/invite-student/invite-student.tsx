'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { z } from 'zod';

import { useAction } from 'next-safe-action/hooks';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Modal, Stack, TextInput } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

import { IconPlus } from '@tabler/icons-react';

import { authClient } from '~/lib/auth-client';

import { ComboboxComponent } from '~/components/combobox-component';

import { inviteStudentAction } from './invite-student.action';
import { inviteFormSchema } from './invite-student.schema';

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteStudentProps {
  currentCohorts: Array<string>;
}

export function InviteStudent({ currentCohorts }: InviteStudentProps) {
  const [opened, { open, close }] = useDisclosure();

  const [cohorts, setCohorts] = useState(currentCohorts);

  const { data: sessionData } = authClient.useSession();

  const { executeAsync, isExecuting } = useAction(inviteStudentAction, {
    onSuccess: () => {
      reset();
      close();
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: { name: '', email: '', cohort: '' },
  });

  const onSubmit = (data: InviteFormValues) => {
    executeAsync({ ...data, organizationId: sessionData?.session?.activeOrganizationId });
  };

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus size={16} />}>
        Invite
      </Button>
      <Modal centered opened={opened} onClose={close} title="Add respondent">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Enter respondent name"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <TextInput
              label="Email"
              placeholder="Enter respondent email"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <Controller
              name="cohort"
              control={control}
              render={({ field }) => (
                <ComboboxComponent
                  label="Cohort"
                  data={cohorts}
                  setData={setCohorts}
                  error={errors.cohort?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <input
              type="hidden"
              {...register('organizationId')}
              value={sessionData?.session?.activeOrganizationId}
            />
            <Button type="submit" mt="md" loading={isExecuting}>
              Invite
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
