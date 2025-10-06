'use client';

import { useState } from 'react';
import { Button, ActionIcon, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface AdminRefreshButtonProps {
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function AdminRefreshButton({ variant = 'icon', size = 'sm' }: AdminRefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force a refresh of the page data
      router.refresh();
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  };

  if (variant === 'button') {
    return (
      <Button
        leftSection={<IconRefresh size={16} />}
        onClick={handleRefresh}
        loading={isRefreshing}
        size={size}
        variant="light"
      >
        Refresh Data
      </Button>
    );
  }

  return (
    <Tooltip label="Refresh data">
      <ActionIcon
        variant="subtle"
        size={size}
        onClick={handleRefresh}
        loading={isRefreshing}
      >
        <IconRefresh size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
