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
  Modal,
  Stack,
  Alert,
  Button,
} from '@mantine/core';

import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import { IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

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
  onRefresh?: () => void;
}

export function QuestionsTable({ data, onRefresh }: QuestionsTableProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpen, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const theme = useMantineTheme();

  // Use Mantine's useMediaQuery hook to determine screen size
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleEditClick = (question: Question) => {
    setSelectedQuestion(question);
    open();
  };

  const handleDeleteClick = (question: Question) => {
    setSelectedQuestion(question);
    openDelete();
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch('/api/admin/questions/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: selectedQuestion.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete question');
      }

      if (onRefresh) {
        onRefresh();
      }
      closeDelete();
      setSelectedQuestion(null);
      notifications.show({
        title: 'Success',
        message: 'Question deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete question',
        color: 'red',
      });
    }
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
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(question => (
              <tr key={question.id}>
                <td>{question.orderNumber}</td>
                <td>{question.text}</td>
                <td>
                  <Badge>{question.category}</Badge>
                </td>
                <td>
                  <Group>
                    <ActionIcon variant="subtle" onClick={() => handleEditClick(question)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(question)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
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
          onRefresh={onRefresh}
        />
      )}

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={closeDelete}
        title="Delete Question"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning" color="red">
            This will delete the question and all associated data. This action cannot be undone.
          </Alert>
          <Text>Are you sure you want to delete this question?</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeDelete}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteQuestion}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
