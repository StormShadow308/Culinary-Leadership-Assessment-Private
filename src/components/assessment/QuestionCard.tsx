import React, { useState, useEffect } from 'react';
import { Question, UserResponse } from './assessmentData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionCardProps {
  question: Question;
  userResponse: UserResponse | undefined;
  onResponseChange: (response: UserResponse) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userResponse,
  onResponseChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [bestOption, setBestOption] = useState<string | null>(userResponse?.bestOptionId || null);
  const [worstOption, setWorstOption] = useState<string | null>(userResponse?.worstOptionId || null);
  const [error, setError] = useState<string | null>(null);

  // Update local state when userResponse changes
  useEffect(() => {
    setBestOption(userResponse?.bestOptionId || null);
    setWorstOption(userResponse?.worstOptionId || null);
  }, [userResponse]);

  const handleBestOptionChange = (value: string) => {
    // If the selected best option is the same as the worst option, clear the worst option
    if (value === worstOption) {
      setWorstOption(null);
    }
    setBestOption(value);
    setError(null);
  };

  const handleWorstOptionChange = (value: string) => {
    // If the selected worst option is the same as the best option, clear the best option
    if (value === bestOption) {
      setBestOption(null);
    }
    setWorstOption(value);
    setError(null);
  };

  const handleNext = () => {
    // Validate that both best and worst options are selected
    if (!bestOption || !worstOption) {
      setError('Please select both the BEST and WORST options before continuing.');
      return;
    }

    // Save the response
    onResponseChange({
      questionId: question.id,
      bestOptionId: bestOption,
      worstOptionId: worstOption,
    });

    // Move to the next question
    onNext();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Question {question.id}</CardTitle>
        <CardDescription className="text-base mt-2">{question.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Select the BEST option:</h3>
            <RadioGroup value={bestOption || ''} onValueChange={handleBestOptionChange}>
              {question.options.map((option) => (
                <div key={`best-${option.id}`} className="flex items-start space-x-2 mb-4">
                  <RadioGroupItem value={option.id} id={`best-${option.id}`} />
                  <Label htmlFor={`best-${option.id}`} className="text-base">
                    {option.id}. {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Select the WORST option:</h3>
            <RadioGroup value={worstOption || ''} onValueChange={handleWorstOptionChange}>
              {question.options.map((option) => (
                <div key={`worst-${option.id}`} className="flex items-start space-x-2 mb-4">
                  <RadioGroupItem value={option.id} id={`worst-${option.id}`} />
                  <Label htmlFor={`worst-${option.id}`} className="text-base">
                    {option.id}. {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={isFirst}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
        >
          {isLast ? 'Submit' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard; 