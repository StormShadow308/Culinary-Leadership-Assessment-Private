
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CohortScoring from './reports/CohortScoring';
import StudentRankings from './reports/StudentRankings';
import AssessmentAnalysis from './reports/AssessmentAnalysis';

interface OverallReportProps {
  data?: any;
}

const OverallReport: React.FC<OverallReportProps> = ({ data }) => {
  const [selectedCohort, setSelectedCohort] = useState("all");
  const [timeRange, setTimeRange] = useState("all");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cohorts</SelectItem>
              <SelectItem value="2023A">Cohort 2023A</SelectItem>
              <SelectItem value="2023B">Cohort 2023B</SelectItem>
              <SelectItem value="2023C">Cohort 2023C</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="6months">Past 6 Months</SelectItem>
              <SelectItem value="3months">Past 3 Months</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="cohort" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cohort">Cohort Scoring</TabsTrigger>
          <TabsTrigger value="rankings">Student Rankings</TabsTrigger>
          <TabsTrigger value="analysis">Assessment Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cohort">
          <CohortScoring cohort={selectedCohort} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="rankings">
          <StudentRankings cohort={selectedCohort} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="analysis">
          <AssessmentAnalysis cohort={selectedCohort} timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverallReport;
