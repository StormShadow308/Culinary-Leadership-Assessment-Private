'use client';

import { useState, useEffect } from 'react';
import { 
  Paper, 
  Stack, 
  Title, 
  Button, 
  Modal, 
  TextInput, 
  Select, 
  Textarea,
  Group,
  NumberInput
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { QuestionsTable } from './components/questions-table';

interface Question {
  id: number;
  text: string;
  category: string;
  orderNumber: number;
  assessmentId: string;
  assessmentTitle: string;
}

interface Assessment {
  id: string;
  title: string;
}

export default function QAAdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    category: '',
    orderNumber: 1,
    assessmentId: '',
    options: [{ text: '', orderNumber: 1 }, { text: '', orderNumber: 2 }]
  });

  useEffect(() => {
    fetchQuestions();
    fetchAssessments();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch questions',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/admin/assessments');
      if (!response.ok) throw new Error('Failed to fetch assessments');
      const data = await response.json();
      setAssessments(data.assessments || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create question');
      }

      const data = await response.json();
      setQuestions([...questions, data.question]);
      setCreateModalOpen(false);
      setFormData({
        text: '',
        category: '',
        orderNumber: 1,
        assessmentId: '',
        options: [{ text: '', orderNumber: 1 }, { text: '', orderNumber: 2 }]
      });
      notifications.show({
        title: 'Success',
        message: 'Question created successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error creating question:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create question',
        color: 'red',
      });
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', orderNumber: formData.options.length + 1 }]
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mobile-page-container">
      <Stack h="100%" gap="md">
        <Group justify="space-between">
          <Title order={2}>Questions & Answers</Title>
          <Button leftSection={<IconPlus size="1rem" />} onClick={() => setCreateModalOpen(true)}>
          Create Question
        </Button>
      </Group>

      <Paper h="100%" withBorder>
        <QuestionsTable data={questions} onRefresh={fetchQuestions} />
      </Paper>

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Question"
        size="lg"
      >
        <Stack gap="md">
          <Textarea
            label="Question Text"
            placeholder="Enter the question text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            minRows={3}
          />
          
          <TextInput
            label="Category"
            placeholder="Enter question category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          
          <NumberInput
            label="Order Number"
            placeholder="Enter order number"
            value={formData.orderNumber}
            onChange={(value) => setFormData({ ...formData, orderNumber: Number(value) || 1 })}
            required
            min={1}
          />
          
          <Select
            label="Assessment"
            placeholder="Select assessment"
            data={assessments.map(assessment => ({ 
              value: assessment.id, 
              label: assessment.title 
            }))}
            value={formData.assessmentId}
            onChange={(value) => setFormData({ ...formData, assessmentId: value || '' })}
            required
          />

          <div>
            <Group justify="space-between" mb="sm">
              <Title order={4}>Options</Title>
              <Button size="xs" onClick={addOption}>
                Add Option
              </Button>
            </Group>
            
            <Stack gap="sm">
              {formData.options.map((option, index) => (
                <Group key={index}>
                  <TextInput
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    style={{ flex: 1 }}
                    required
                  />
                  {formData.options.length > 2 && (
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Group>
              ))}
            </Stack>
          </div>

          <Group justify="flex-end">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuestion}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
      </Stack>
    </div>
  );
}