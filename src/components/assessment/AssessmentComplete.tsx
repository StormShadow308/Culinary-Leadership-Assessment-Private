import React from 'react';
import { UserResponse } from './assessmentData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentCompleteProps {
  responses: UserResponse[];
}

const AssessmentComplete: React.FC<AssessmentCompleteProps> = ({ responses }) => {
  const navigate = useNavigate();

  const handleViewDashboard = () => {
    // Navigate to the participant dashboard
    navigate('/participant-dashboard');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Assessment Complete!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Thank you for completing the Culinary Leadership Assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-base">
              Your responses have been recorded. Our system will analyze your answers and generate a comprehensive leadership profile.
            </p>
          </div>
          
          <div className="bg-muted p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4 text-center">What happens next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-2">Analysis</h4>
                <p className="text-sm">Your responses will be analyzed to identify your leadership strengths and areas for growth.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold mb-2">Report Generation</h4>
                <p className="text-sm">A detailed report will be generated highlighting your leadership profile and recommendations.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold mb-2">Dashboard Access</h4>
                <p className="text-sm">Your results will be available on your dashboard, where you can track your progress over time.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-blue-800 text-center">
              <strong>Note:</strong> Your results will be available in your dashboard within 24 hours. 
              You will receive an email notification when your report is ready.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={handleViewDashboard}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentComplete; 