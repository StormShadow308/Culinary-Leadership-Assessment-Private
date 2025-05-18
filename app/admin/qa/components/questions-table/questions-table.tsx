'use client';

import { useState } from 'react';

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Table,
  Text,
  useMantineTheme,
} from '@mantine/core';

import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import { IconEdit } from '@tabler/icons-react';

import { EditQuestionModal } from './edit-question-modal';

type Question = {
  id: number;
  text: string;
  category: string;
  orderNumber: number;
  assessmentId: string | null;
  assessmentTitle: string | null;
};

interface QuestionsTableProps {
  data: Array<Question>;
}

export function QuestionsTable({ data }: QuestionsTableProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const theme = useMantineTheme();

  // Use Mantine's useMediaQuery hook to determine screen size
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleEditClick = (question: Question) => {
    setSelectedQuestion(question);
    open();
  };

  return (
    <>
      {isMobile ? (
        // Card layout for mobile
        <Box p="md">
          {data.map(question => (
            <Card key={question.id} p="lg" radius="md" withBorder mb="md">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{`#${question.orderNumber}`}</Text>
                <ActionIcon variant="subtle" onClick={() => handleEditClick(question)}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>
              <Text mb="md">{question.text}</Text>
              <Flex justify="space-between" wrap="wrap" gap="xs">
                <Badge>{question.category}</Badge>
                <Text size="sm" c="dimmed">
                  {question.assessmentTitle || 'No assessment'}
                </Text>
              </Flex>
            </Card>
          ))}
        </Box>
      ) : (
        // Table layout for desktop
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order</Table.Th>
              <Table.Th>Question</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map(question => (
              <Table.Tr key={question.id}>
                <Table.Td>{question.orderNumber}</Table.Td>
                <Table.Td>{question.text}</Table.Td>
                <Table.Td>
                  <Badge>{question.category}</Badge>
                </Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon variant="subtle" onClick={() => handleEditClick(question)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {selectedQuestion && (
        <EditQuestionModal
          opened={opened}
          onClose={() => {
            close();
            // Reset tab to 'text' by re-initializing the component
            setTimeout(() => setSelectedQuestion(null), 0);
          }}
          questionId={selectedQuestion.id}
          initialQuestionText={selectedQuestion.text}
        />
      )}
    </>
  );
}
