'use client';

import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { z } from 'zod';

import { useAction } from 'next-safe-action/hooks';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Modal, Stack, TextInput } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

import { IconPlus } from '@tabler/icons-react';


import { ComboboxComponent } from '~/components/combobox-component';

import { inviteStudentAction } from './invite-student.action';
import { inviteFormSchema } from './invite-student.schema';

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteStudentProps {
  currentCohorts: Array<string>;
  organizationId?: string;
}

export function InviteStudent({ currentCohorts, organizationId: propOrganizationId }: InviteStudentProps) {
  const [opened, { open, close }] = useDisclosure();

  const [cohorts, setCohorts] = useState(currentCohorts);

  // Get organization ID from the current context
  // This should match the logic in the organization dashboard
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // Get organization ID from props, URL parameters, or default
  useEffect(() => {
    console.log('🔍 Getting organization ID...');
    console.log('🔍 Prop organizationId:', propOrganizationId);
    
    if (propOrganizationId) {
      console.log('✅ Using organizationId from props:', propOrganizationId);
      setOrganizationId(propOrganizationId);
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const orgId = urlParams.get('orgId');
    console.log('🔍 URL orgId:', orgId);
    
    if (orgId) {
      console.log('✅ Using orgId from URL:', orgId);
      setOrganizationId(orgId);
    } else {
      console.log('🔧 Using fallback organization ID');
      setOrganizationId('org-culinary-leadership-academy');
    }
  }, [propOrganizationId]);

  const { executeAsync, isExecuting } = useAction(inviteStudentAction, {
    onSuccess: (data) => {
      console.log('✅ Invite successful:', data);
      reset();
      close();
    },
    onError: (error) => {
      console.error('❌ Invite failed:', error);
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
    console.log('🔍 Submitting invite form:', data);
    console.log('🔍 Organization ID:', organizationId);
    
    if (!organizationId) {
      console.error('❌ Organization ID not available');
      return;
    }
    
    console.log('✅ Executing invite action with organizationId:', organizationId);
    executeAsync({ ...data, organizationId });
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
              value={organizationId || ''}
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
