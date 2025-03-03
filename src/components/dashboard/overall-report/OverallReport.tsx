
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CohortScoring } from "./CohortScoring";
import { StudentRankings } from "./StudentRankings";
import { AssessmentAnalysis } from "./AssessmentAnalysis";

export function OverallReport() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Overall Report</h2>
      </div>

      <Tabs defaultValue="cohort-scoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cohort-scoring">Cohort Scoring</TabsTrigger>
          <TabsTrigger value="student-rankings">Student Rankings</TabsTrigger>
          <TabsTrigger value="assessment-analysis">Assessment Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="cohort-scoring">
          <CohortScoring />
        </TabsContent>
        <TabsContent value="student-rankings">
          <StudentRankings />
        </TabsContent>
        <TabsContent value="assessment-analysis">
          <AssessmentAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
