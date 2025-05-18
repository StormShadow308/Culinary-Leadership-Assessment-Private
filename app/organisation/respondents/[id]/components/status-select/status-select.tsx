'use client';

import { useState } from 'react';

import { useAction } from 'next-safe-action/hooks';

import { Group, Select } from '@mantine/core';

import { notifications } from '@mantine/notifications';

import { updateStudentStatusAction } from './update-status.action';

interface StatusSelectProps {
  studentId: string;
  initialStatus: 'Stay' | 'Out';
}

export function StatusSelect({ studentId, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<string | null>(initialStatus);
  const { executeAsync, isExecuting } = useAction(updateStudentStatusAction);

  const handleStatusChange = async (value: string | null) => {
    if (!value || value === status) return;

    setStatus(value);

    try {
      const result = await executeAsync({
        studentId,
        status: value as 'Stay' | 'Out',
      });

      if (result.serverError || result.validationErrors) {
        notifications.show({ color: 'red', title: 'Error', message: 'Failed to update status' });
        // Revert to previous value on error
        setStatus(initialStatus);
        return;
      }

      if (result.data?.error) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: result.data.message || 'Failed to update status',
        });
        // Revert to previous value on error
        setStatus(initialStatus);
        return;
      }

      if (result.data?.success) {
        notifications.show({
          color: 'green',
          title: 'Success',
          message: 'Status updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'An unexpected error occurred',
      });
      // Revert to previous value on error
      setStatus(initialStatus);
    }
  };

  return (
    <Group>
      <Select
        data={[
          { value: 'Stay', label: 'Stay' },
          { value: 'Out', label: 'Out' },
        ]}
        value={status}
        onChange={handleStatusChange}
        disabled={isExecuting}
        styles={theme => ({
          input: {
            backgroundColor: status === 'Stay' ? theme.colors.green[0] : theme.colors.red[0],
            borderColor: status === 'Stay' ? theme.colors.green[5] : theme.colors.red[5],
            color: status === 'Stay' ? theme.colors.green[9] : theme.colors.red[9],
            fontWeight: 500,
          },
        })}
      />
    </Group>
  );
}
