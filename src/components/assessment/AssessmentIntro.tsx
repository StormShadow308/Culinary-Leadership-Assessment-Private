import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AssessmentIntroProps {
  onStart: () => void;
}

const AssessmentIntro: React.FC<AssessmentIntroProps> = ({ onStart }) => {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Culinary Leadership Assessment</CardTitle>
          <CardDescription className="text-lg mt-2">
            Evaluate your leadership skills in culinary environments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
            <p className="text-base">
              This assessment is designed to provide a snapshot of your current leadership abilities. 
              You will be presented with real-world situations you might encounter in a leadership role.
            </p>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">For each scenario:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Read the situation carefully</li>
              <li>Choose the <strong>BEST</strong> option for responding</li>
              <li>Choose the <strong>WORST</strong> option for responding</li>
              <li>You are not choosing the absolute best or worst answer in the world, just the best and worst of the five choices</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">About the Assessment:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>The assessment contains 20 questions</li>
              <li>Each question presents a scenario with 5 possible responses</li>
              <li>You must select both a best and worst option for each scenario</li>
              <li>You can navigate back to previous questions to change your answers</li>
              <li>Your responses will be used to generate a leadership profile</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-blue-800">
              <strong>Note:</strong> This assessment takes approximately 15-20 minutes to complete. 
              Please ensure you have enough time to complete it in one sitting.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={onStart}>
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentIntro; 