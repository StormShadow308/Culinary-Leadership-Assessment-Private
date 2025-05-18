'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAction } from 'next-safe-action/hooks';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Group, Modal, Select, Stack, Tabs, Text, Textarea } from '@mantine/core';

import { editQuestionAction } from './edit-question.action';
import { type FormValues, editQuestionSchema } from './edit-question.schema';
import { fetchQuestionDetailsAction } from './fetch-question-details.action';

interface Option {
  id: string;
  questionId: number;
  text: string;
}

interface EditQuestionModalProps {
  opened: boolean;
  onClose: () => void;
  questionId: number;
  initialQuestionText: string;
}

export function EditQuestionModal(props: EditQuestionModalProps) {
  const { opened, onClose, questionId, initialQuestionText } = props;

  const [options, setOptions] = useState<Option[]>([]);
  const [editableOptions, setEditableOptions] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<string | null>('text');
  const [currentAnswers, setCurrentAnswers] = useState<{
    bestOptionId: string;
    worstOptionId: string;
  }>({ bestOptionId: '', worstOptionId: '' });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editQuestionSchema),
    defaultValues: {
      questionId,
      text: initialQuestionText,
      bestOptionId: '',
      worstOptionId: '',
      optionUpdates: [],
    },
  });

  // Reset form when questionId or initialQuestionText changes
  useEffect(() => {
    reset({
      questionId,
      text: initialQuestionText,
      bestOptionId: currentAnswers.bestOptionId,
      worstOptionId: currentAnswers.worstOptionId,
      optionUpdates: [],
    });
  }, [questionId, initialQuestionText, reset, currentAnswers]);

  const { executeAsync: updateQuestion, isExecuting } = useAction(editQuestionAction, {
    onSuccess: () => {
      // Close modal and reset form on success
      onClose();
      reset();
    },
  });

  // Fetch options and correct answers when modal opens or questionId changes
  useEffect(() => {
    if (opened && questionId) {
      // Reset to the question text tab whenever a new question is selected
      setCurrentTab('text');

      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await fetchQuestionDetailsAction(questionId);

          if (data.options) {
            setOptions(data.options);

            // Initialize editable options state
            const optionsState = data.options.reduce(
              (acc, option) => {
                acc[option.id] = option.text;
                return acc;
              },
              {} as { [key: string]: string }
            );

            setEditableOptions(optionsState);
          }

          if (data.correctAnswers) {
            const newAnswers = {
              bestOptionId: data.correctAnswers.bestOptionId,
              worstOptionId: data.correctAnswers.worstOptionId,
            };

            setCurrentAnswers(newAnswers);
            setValue('bestOptionId', data.correctAnswers.bestOptionId);
            setValue('worstOptionId', data.correctAnswers.worstOptionId);
          } else {
            // Reset answers if none exist for this question
            setCurrentAnswers({ bestOptionId: '', worstOptionId: '' });
            setValue('bestOptionId', '');
            setValue('worstOptionId', '');
          }

          // Ensure the text field is set to the initialQuestionText
          setValue('text', initialQuestionText);
        } catch (error) {
          console.error('Failed to fetch question details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [opened, questionId, setValue, initialQuestionText]);

  const handleOptionChange = (optionId: string, newText: string) => {
    setEditableOptions(prev => ({
      ...prev,
      [optionId]: newText,
    }));
  };

  const onSubmit = (data: FormValues) => {
    // Only send the fields relevant to the current tab
    const payload = {
      questionId: data.questionId,
      ...(currentTab === 'text' ? { text: data.text } : {}),
      ...(currentTab === 'answers'
        ? {
            bestOptionId: data.bestOptionId,
            worstOptionId: data.worstOptionId,
          }
        : {}),
      ...(currentTab === 'options'
        ? {
            optionUpdates: Object.entries(editableOptions)
              .map(([optionId, text]) => ({
                optionId,
                text,
              }))
              .filter(update => {
                // Only include options where text has changed
                const originalOption = options.find(opt => opt.id === update.optionId);
                return originalOption && originalOption.text !== update.text;
              }),
          }
        : {}),
    };

    updateQuestion(payload);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Question" centered size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={currentTab} onChange={setCurrentTab}>
          <Tabs.List>
            <Tabs.Tab value="text">Question Text</Tabs.Tab>
            <Tabs.Tab value="answers">Correct Answers</Tabs.Tab>
            <Tabs.Tab value="options">Edit Options</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="text" pt="md">
            <Stack>
              <Textarea
                label="Question Text"
                placeholder="Enter question text"
                autosize
                minRows={3}
                {...register('text')}
                error={errors.text?.message}
                key={`question-text-${questionId}`} // Force re-render when questionId changes
              />
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="answers" pt="md">
            <Stack>
              <Select
                label="Best Option"
                placeholder="Select best option"
                data={options.map(option => ({ value: option.id, label: option.text }))}
                value={currentAnswers.bestOptionId}
                onChange={value => {
                  setValue('bestOptionId', value || '');
                  setCurrentAnswers(prev => ({ ...prev, bestOptionId: value || '' }));
                }}
                error={errors.bestOptionId?.message}
                disabled={loading}
              />
              <Select
                label="Worst Option"
                placeholder="Select worst option"
                data={options.map(option => ({ value: option.id, label: option.text }))}
                value={currentAnswers.worstOptionId}
                onChange={value => {
                  setValue('worstOptionId', value || '');
                  setCurrentAnswers(prev => ({ ...prev, worstOptionId: value || '' }));
                }}
                error={errors.worstOptionId?.message}
                disabled={loading}
              />
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="options" pt="md">
            <Stack>
              {options.map(option => (
                <Textarea
                  key={option.id}
                  label={`Option ${options.indexOf(option) + 1}`}
                  placeholder="Enter option text"
                  value={editableOptions[option.id] || ''}
                  onChange={e => handleOptionChange(option.id, e.target.value)}
                  autosize
                  minRows={2}
                  disabled={loading}
                />
              ))}
              {options.length === 0 && !loading && (
                <Text size="sm" c="dimmed">
                  No options available for this question.
                </Text>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isExecuting}>
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
