
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ComparisonCharts from './reports/ComparisonCharts';

interface ComparisonReportProps {
  data?: any;
}

const ComparisonReport: React.FC<ComparisonReportProps> = ({ data }) => {
  const [cohort1, setCohort1] = useState("2023A");
  const [cohort2, setCohort2] = useState("2023B");
  const [assessmentType, setAssessmentType] = useState("all");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={cohort1} onValueChange={setCohort1}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Cohort 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023A">Cohort 2023A</SelectItem>
              <SelectItem value="2023B">Cohort 2023B</SelectItem>
              <SelectItem value="2023C">Cohort 2023C</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={cohort2} onValueChange={setCohort2}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Cohort 2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023A">Cohort 2023A</SelectItem>
              <SelectItem value="2023B">Cohort 2023B</SelectItem>
              <SelectItem value="2023C">Cohort 2023C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Select value={assessmentType} onValueChange={setAssessmentType}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Assessment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assessments</SelectItem>
            <SelectItem value="leadership">Leadership Assessment</SelectItem>
            <SelectItem value="team">Team Dynamics Assessment</SelectItem>
            <SelectItem value="communication">Communication Assessment</SelectItem>
            <SelectItem value="problem">Problem Solving Assessment</SelectItem>
            <SelectItem value="resilience">Resilience Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ComparisonCharts 
        cohort1={cohort1} 
        cohort2={cohort2} 
        assessmentType={assessmentType} 
      />
    </div>
  );
};

export default ComparisonReport;
