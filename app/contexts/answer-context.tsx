'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the data structure
export interface QuestionAnswer {
  id: string;
  question: string;
  bestWorst: 'Best' | 'Worst';
  culinaryA: string;
  culinaryB: string;
  culinaryC: string;
  culinaryD: string;
  culinaryE: string;
  culinaryF: string;
  culinaryG: string;
  culinaryH: string;
  culinaryI: string;
  culinaryJ: string;
  culinaryK: string;
  culinaryL: string;
  culinaryM: string;
  culinaryN: string;
  culinaryO: string;
  culinaryP: string;
  culinaryQ: string;
  culinaryR: string;
  culinaryS: string;
  culinaryT: string;
  culinaryU: string;
  culinaryV: string;
  culinaryW: string;
  culinaryX: string;
  culinaryY: string;
  culinaryZ: string;
}

export interface AnswerColumn {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

// Exact answers from the screenshot for Culinary A
const culinaryAAnswers = [
  'D', 'A', 'E', 'D', 'B', 'D', 'D', 'C', 'B', 'C',
  'E', 'A', 'A', 'C', 'A', 'D', 'D', 'B', 'A', 'D',
  'C', 'E', 'B', 'C', 'B', 'D', 'A', 'C', 'B', 'E',
  'C', 'A', 'A', 'B', 'A', 'D', 'A', 'C', 'A', 'C'
];

// Generate all 20 questions with Best/Worst pairs (40 total)
const generateAllQuestions = (): QuestionAnswer[] => {
  const questions: QuestionAnswer[] = [];
  const answerOptions = ['A', 'B', 'C', 'D', 'E'];

  // Use a simple hash function for deterministic "random" values for other columns
  const getDeterministicAnswer = (questionId: string, columnId: string): string => {
    const seed = questionId.charCodeAt(0) + columnId.charCodeAt(columnId.length - 1);
    return answerOptions[seed % answerOptions.length];
  };
  
  for (let i = 1; i <= 20; i++) {
    const questionId = `Q${i}`;
    const bestIndex = (i - 1) * 2;
    const worstIndex = (i - 1) * 2 + 1;
    
    // Best version
    questions.push({
      id: `${i * 2 - 1}`,
      question: questionId,
      bestWorst: 'Best',
      culinaryA: culinaryAAnswers[bestIndex], // Use exact answers from screenshot
      culinaryB: '', // Empty for admin to fill
      culinaryC: '',
      culinaryD: '',
      culinaryE: '',
      culinaryF: '',
      culinaryG: '',
      culinaryH: '',
      culinaryI: '',
      culinaryJ: '',
      culinaryK: '',
      culinaryL: '',
      culinaryM: '',
      culinaryN: '',
      culinaryO: '',
      culinaryP: '',
      culinaryQ: '',
      culinaryR: '',
      culinaryS: '',
      culinaryT: '',
      culinaryU: '',
      culinaryV: '',
      culinaryW: '',
      culinaryX: '',
      culinaryY: '',
      culinaryZ: '',
    });
    
    // Worst version
    questions.push({
      id: `${i * 2}`,
      question: questionId,
      bestWorst: 'Worst',
      culinaryA: culinaryAAnswers[worstIndex], // Use exact answers from screenshot
      culinaryB: '', // Empty for admin to fill
      culinaryC: '',
      culinaryD: '',
      culinaryE: '',
      culinaryF: '',
      culinaryG: '',
      culinaryH: '',
      culinaryI: '',
      culinaryJ: '',
      culinaryK: '',
      culinaryL: '',
      culinaryM: '',
      culinaryN: '',
      culinaryO: '',
      culinaryP: '',
      culinaryQ: '',
      culinaryR: '',
      culinaryS: '',
      culinaryT: '',
      culinaryU: '',
      culinaryV: '',
      culinaryW: '',
      culinaryX: '',
      culinaryY: '',
      culinaryZ: '',
    });
  }
  return questions;
};

// Generate columns A-Z
const generateColumns = (): AnswerColumn[] => {
  const columns: AnswerColumn[] = [];
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // A-Z
    columns.push({
      id: `culinary${letter}`,
      name: `Culinary ${letter}`,
      enabled: i === 0, // Only A is enabled by default
      order: i + 1
    });
  }
  return columns;
};

// Context type
interface AnswerContextType {
  // Data
  questions: QuestionAnswer[];
  columns: AnswerColumn[];
  loading: boolean;
  
  // Actions
  updateAnswer: (questionId: string, columnId: string, value: string) => void;
  updateColumn: (columnId: string, updates: Partial<AnswerColumn>) => void;
  toggleColumn: (columnId: string) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  resetData: () => void;
  
  // Computed
  enabledColumns: AnswerColumn[];
  filteredQuestions: (searchTerm: string) => QuestionAnswer[];
}

// Create context
const AnswerContext = createContext<AnswerContextType | undefined>(undefined);

// Storage key for persistence
const STORAGE_KEY = 'culinary-answers-data';

// Provider component
export function AnswerProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
  const [columns, setColumns] = useState<AnswerColumn[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedQuestions = localStorage.getItem(`${STORAGE_KEY}-questions`);
        const savedColumns = localStorage.getItem(`${STORAGE_KEY}-columns`);
        
        if (savedQuestions && savedColumns) {
          setQuestions(JSON.parse(savedQuestions));
          setColumns(JSON.parse(savedColumns));
        } else {
          // Initialize with default data
          const defaultQuestions = generateAllQuestions();
          const defaultColumns = generateColumns();
          setQuestions(defaultQuestions);
          setColumns(defaultColumns);
          
          // Save to localStorage
          localStorage.setItem(`${STORAGE_KEY}-questions`, JSON.stringify(defaultQuestions));
          localStorage.setItem(`${STORAGE_KEY}-columns`, JSON.stringify(defaultColumns));
        }
      } catch (error) {
        console.error('Error loading answer data:', error);
        // Fallback to default data
        const defaultQuestions = generateAllQuestions();
        const defaultColumns = generateColumns();
        setQuestions(defaultQuestions);
        setColumns(defaultColumns);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(`${STORAGE_KEY}-questions`, JSON.stringify(questions));
        localStorage.setItem(`${STORAGE_KEY}-columns`, JSON.stringify(columns));
      } catch (error) {
        console.error('Error saving answer data:', error);
      }
    }
  }, [questions, columns, loading]);

  // Update a specific answer
  const updateAnswer = (questionId: string, columnId: string, value: string) => {
    setQuestions(prev => prev.map(question => 
      question.id === questionId 
        ? { ...question, [columnId]: value }
        : question
    ));
  };

  // Update column properties
  const updateColumn = (columnId: string, updates: Partial<AnswerColumn>) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  // Toggle column enabled state
  const toggleColumn = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, enabled: !col.enabled } : col
    ));
  };

  // Reorder columns
  const reorderColumns = (fromIndex: number, toIndex: number) => {
    setColumns(prev => {
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      return newColumns.map((col, index) => ({ ...col, order: index + 1 }));
    });
  };

  // Reset data to defaults
  const resetData = () => {
    const defaultQuestions = generateAllQuestions();
    const defaultColumns = generateColumns();
    setQuestions(defaultQuestions);
    setColumns(defaultColumns);
  };

  // Get enabled columns
  const enabledColumns = columns.filter(col => col.enabled).sort((a, b) => a.order - b.order);

  // Filter questions by search term
  const filteredQuestions = (searchTerm: string) => {
    if (!searchTerm) return questions;
    return questions.filter(question =>
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.bestWorst.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const value: AnswerContextType = {
    questions,
    columns,
    loading,
    updateAnswer,
    updateColumn,
    toggleColumn,
    reorderColumns,
    resetData,
    enabledColumns,
    filteredQuestions,
  };

  return (
    <AnswerContext.Provider value={value}>
      {children}
    </AnswerContext.Provider>
  );
}

// Hook to use the context
export function useAnswerContext() {
  const context = useContext(AnswerContext);
  if (context === undefined) {
    throw new Error('useAnswerContext must be used within an AnswerProvider');
  }
  return context;
}
