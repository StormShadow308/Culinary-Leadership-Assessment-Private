'use client';

import { Group, Badge } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

interface LastUpdatedIndicatorProps {
  className?: string;
}

export function LastUpdatedIndicator({ className }: LastUpdatedIndicatorProps) {
  return (
    <Group gap="xs" className={className}>
      <IconClock size={14} />
      <Badge size="xs" color="green" variant="light">
        Live Data
      </Badge>
    </Group>
  );
}
