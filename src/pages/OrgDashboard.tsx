import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsHeader,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentRankings from "@/components/StudentRankings";
import AssessmentAnalysis from "@/components/AssessmentAnalysis";

const OrgDashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Organization Dashboard</h1>
      
      <Tabs defaultValue="overall-pre">
        <TabsHeader>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overall-pre">Overall Report - Pre Only</TabsTrigger>
            <TabsTrigger value="overall-compare">Overall Report - Compare</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="class">Class</TabsTrigger>
          </TabsList>
        </TabsHeader>
        
        {/* Overall Report - Pre Only Tab Content */}
        <TabsContent value="overall-pre">
          <div className="mb-6">
            <Tabs defaultValue="student-rankings">
              <SubTabsList>
                <SubTabsTrigger value="student-rankings">Student Rankings</SubTabsTrigger>
                <SubTabsTrigger value="assessment-analysis">Assessment Analysis</SubTabsTrigger>
              </SubTabsList>
              
              <TabsContent value="student-rankings">
                <div className="mt-6">
                  <StudentRankings />
                </div>
              </TabsContent>
              
              <TabsContent value="assessment-analysis">
                <div className="mt-6">
                  <AssessmentAnalysis />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="overall-compare">
          {/* Content for overall-compare tab */}
        </TabsContent>
        
        <TabsContent value="individual">
          {/* Content for individual tab */}
        </TabsContent>
        
        <TabsContent value="class">
          {/* Content for class tab */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDashboard;
