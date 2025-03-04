import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AssessmentContextType, UserResponse, assessmentQuestions } from './assessmentData';

// Create the context with a default value
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Provider component
interface AssessmentProviderProps {
  children: ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // -1 means not started
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState<boolean>(false);

  // Start the assessment
  const startAssessment = () => {
    setCurrentQuestionIndex(0);
    setUserResponses([]);
    setIsAssessmentComplete(false);
  };

  // Update user response for a question
  const updateUserResponse = (response: UserResponse) => {
    setUserResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (r) => r.questionId === response.questionId
      );

      if (existingResponseIndex !== -1) {
        // Update existing response
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex] = response;
        return updatedResponses;
      } else {
        // Add new response
        return [...prevResponses, response];
      }
    });
  };

  // Submit the assessment
  const submitAssessment = () => {
    setIsAssessmentComplete(true);
    // Here you would typically send the results to a server
    console.log('Assessment submitted:', userResponses);
  };

  // Context value
  const value: AssessmentContextType = {
    currentQuestionIndex,
    userResponses,
    setCurrentQuestionIndex,
    updateUserResponse,
    isAssessmentComplete,
    startAssessment,
    submitAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

// Custom hook to use the assessment context
export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}; 