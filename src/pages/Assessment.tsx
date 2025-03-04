import React from 'react';
import { AssessmentProvider } from '@/components/assessment/AssessmentContext';
import AssessmentContainer from '@/components/assessment/AssessmentContainer';
import Navigation from '@/components/Navigation';

const Assessment: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-slate-50">
        <AssessmentProvider>
          <AssessmentContainer />
        </AssessmentProvider>
      </main>
    </div>
  );
};

export default Assessment; 