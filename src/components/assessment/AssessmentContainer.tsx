import React from 'react';
import { useAssessment } from './AssessmentContext';
import { assessmentQuestions } from './assessmentData';
import QuestionCard from './QuestionCard';
import AssessmentIntro from './AssessmentIntro';
import AssessmentComplete from './AssessmentComplete';
import { Progress } from '@/components/ui/progress';

const AssessmentContainer: React.FC = () => {
  const {
    currentQuestionIndex,
    userResponses,
    setCurrentQuestionIndex,
    updateUserResponse,
    isAssessmentComplete,
    startAssessment,
    submitAssessment,
  } = useAssessment();

  // If assessment not started yet, show intro
  if (currentQuestionIndex === -1) {
    return <AssessmentIntro onStart={startAssessment} />;
  }

  // If assessment is complete, show completion screen
  if (isAssessmentComplete) {
    return <AssessmentComplete responses={userResponses} />;
  }

  // Get current question
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  
  // Get user response for current question
  const currentResponse = userResponses.find(
    (response) => response.questionId === currentQuestion.id
  );

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAssessment();
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <QuestionCard
        question={currentQuestion}
        userResponse={currentResponse}
        onResponseChange={updateUserResponse}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === assessmentQuestions.length - 1}
      />
    </div>
  );
};

export default AssessmentContainer; 