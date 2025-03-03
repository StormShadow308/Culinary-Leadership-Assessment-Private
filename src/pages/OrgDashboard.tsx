
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { 
  Users, 
  Target, 
  ChefHat, 
  LayoutDashboard, 
  GraduationCap,
  UserCog,
  FileText,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  FileBarChart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, SubTabsList, SubTabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockPieData = [
  { name: "Leadership", value: 35 },
  { name: "Communication", value: 25 },
  { name: "Technical", value: 20 },
  { name: "Management", value: 20 },
];

const COLORS = ["#F97316", "#0EA5E9", "#22C55E", "#EAB308"];

const mockStudentData = [
  { 
    id: 1,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Alissa Williams",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 2,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Andrew Clark",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 3,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Anthony Zasgoursky",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 4,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Asia Robinson",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 5,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Basim Muhammad",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 6,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Chase Jones",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 7,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Christa Fields",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 8,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Christopher Simmons",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    }
  },
  { 
    id: 9,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    name: "Vance Knapp",
    status: "Stay",
    entries: "Completed",
    preAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    postAssessment: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
      overallScore: 0
    },
    details: {
      overallScore: {
        score: "0 out of 40",
        rating: "Needs Development"
      },
      categories: [
        {
          name: "Resilience and Adaptability",
          score: "0 out of 8",
          rating: "Needs Development"
        },
        {
          name: "Team Dynamics & Collaboration",
          score: "0 out of 8",
          rating: "Needs Development"
        },
        {
          name: "Decision-Making & Problem-Solving",
          score: "0 out of 8",
          rating: "Needs Development"
        },
        {
          name: "Self-Awareness & Emotional Intelligence",
          score: "0 out of 8",
          rating: "Needs Development"
        },
        {
          name: "Communication & Active Listening",
          score: "0 out of 8",
          rating: "Needs Development"
        }
      ],
      summary: "Lacks foundational leadership skills; requires extensive support."
    }
  }
];

const mockCohortComparisonData = {
  classA: {
    name: "Class A",
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-110424",
    type: "Pre-Program",
    status: "Only Completed",
    scores: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
    },
    students: {
      needsDevelopment: 27,
      developingProficiency: 0,
      moderateProficiency: 0,
      highProficiency: 0,
      exceptionalProficiency: 0
    }
  },
  classB: {
    name: "Class B",
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "E-010924",
    type: "Pre-Program",
    status: "Only Completed",
    scores: {
      resilienceAdaptability: 0,
      teamDynamicsCollaboration: 0,
      decisionMakingProblemSolving: 0,
      selfAwarenessEmotionalIntelligence: 0,
      communicationActiveListening: 0,
    },
    students: {
      needsDevelopment: 35,
      developingProficiency: 0,
      moderateProficiency: 0,
      highProficiency: 0,
      exceptionalProficiency: 0
    }
  }
};

const proficiencyLevels = [
  { id: 1, name: "Needs Development", range: "(0 - 9)", color: "#EF4444" },
  { id: 2, name: "Developing Proficiency", range: "(10 - 19)", color: "#F59E0B" },
  { id: 3, name: "Moderate Proficiency", range: "(20 - 29)", color: "#10B981" },
  { id: 4, name: "High Proficiency", range: "(30 - 35)", color: "#3B82F6" },
  { id: 5, name: "Exceptional Proficiency", range: "(36 - 40)", color: "#8B5CF6" }
];

const mockCohortScoringCurveData = Array.from({ length: 40 }, (_, i) => ({
  score: i + 1,
  classA: 0,
  classB: 0
}));

const mockTopStudentsData = Array.from({ length: 20 }, (_, i) => ({
  no: i + 1,
  student: "#N/A",
  class: "#N/A",
  score: "#N/A",
  scorePercentage: "#N/A"
}));

const mockOverallReportData = {
  cohortScoring: {
    totalStudents: 38,
    proficiencyLevels: [
      { level: "Exceptional Proficiency", range: "(36 - 40)", students: 0, percentage: "0%" },
      { level: "High Proficiency", range: "(30 - 35)", students: 0, percentage: "0%" },
      { level: "Moderate Proficiency", range: "(20 - 29)", students: 0, percentage: "0%" },
      { level: "Developing Proficiency", range: "(10 - 19)", students: 0, percentage: "0%" },
      { level: "Needs Development", range: "(0 - 9)", students: 38, percentage: "100%" }
    ],
    categoryScores: [
      { category: "Resilience and Adaptability", score: 0.00 },
      { category: "Team Dynamics & Collaboration", score: 0.00 },
      { category: "Decision-Making & Problem-Solving", score: 0.00 },
      { category: "Self-Awareness & Emotional Intelligence", score: 0.00 },
      { category: "Communication & Active Listening", score: 0.00 }
    ],
    studentsPerCategory: [
      {
        category: "Resilience and Adaptability",
        needsDevelopment: 38,
        developingProficiency: 0,
        moderateProficiency: 0,
        highProficiency: 0,
        exceptionalProficiency: 0
      },
      {
        category: "Team Dynamics & Collaboration",
        needsDevelopment: 38,
        developingProficiency: 0,
        moderateProficiency: 0,
        highProficiency: 0,
        exceptionalProficiency: 0
      },
      {
        category: "Decision-Making & Problem-Solving",
        needsDevelopment: 38,
        developingProficiency: 0,
        moderateProficiency: 0,
        highProficiency: 0,
        exceptionalProficiency: 0
      },
      {
        category: "Self-Awareness & Emotional Intelligence",
        needsDevelopment: 38,
        developingProficiency: 0,
        moderateProficiency: 0,
        highProficiency: 0,
        exceptionalProficiency: 0
      },
      {
        category: "Communication & Active Listening",
        needsDevelopment: 38,
        developingProficiency: 0,
        moderateProficiency: 0,
        highProficiency: 0,
        exceptionalProficiency: 0
      }
    ],
    scoringCurveData: Array.from({ length: 41 }, (_, i) => ({
      score: i,
      students: 0
    }))
  }
};

const scoringCurveData = Array.from({ length: 41 }, (_, i) => ({
  score: i,
  count: i === 0 ? 38 : 0
}));

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [activeReportSubTab, setActiveReportSubTab] = useState("cohort-scoring");

  const handleStudentClick = (studentId: number) => {
    setSelectedStudent(studentId);
  };

  const handleBackToStudentList = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex pt-16">
        <div className="w-64 bg-white shadow-md hidden md:block h-[calc(100vh-64px)] fixed">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Organization</h2>
          </div>
          <div className="p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab("dashboard")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "dashboard" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("students")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "students" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <GraduationCap className="h-5 w-5 mr-2" />
                    All Students
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab("student-report");
                      setSelectedStudent(null);
                    }}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "student-report" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Student Report
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("comparison-report")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "comparison-report" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Comparison Report
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("overall-report")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "overall-report" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <FileBarChart className="h-5 w-5 mr-2" />
                    Overall Report - Pre Only
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("settings")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "settings" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <UserCog className="h-5 w-5 mr-2" />
                    Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="w-full md:ml-64 p-4 pt-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Organization Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-brand-orange/10">
                        <Users className="h-6 w-6 text-brand-orange" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Team Members</p>
                        <p className="text-2xl font-semibold">127</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-brand-blue/10">
                        <Target className="h-6 w-6 text-brand-blue" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                        <p className="text-2xl font-semibold">82%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100">
                        <ChefHat className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Certified Chefs</p>
                        <p className="text-2xl font-semibold">89</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6 h-[400px] animate-fade-in" style={{ animationDelay: "400ms" }}>
                  <h2 className="text-xl font-semibold mb-4">Skill Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {activeTab === "students" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  All Students
                </h1>

                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Student Assessment Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold">Client</TableHead>
                            <TableHead className="font-semibold">Cohort</TableHead>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Stay/Out</TableHead>
                            <TableHead className="font-semibold">Entries Answer</TableHead>
                            
                            <TableHead className="font-semibold bg-orange-100" colSpan={6}>
                              Pre-Program
                            </TableHead>
                            
                            <TableHead className="font-semibold bg-blue-100" colSpan={6}>
                              Post-Program
                            </TableHead>
                          </TableRow>
                          
                          <TableRow>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            
                            <TableHead className="bg-orange-50 text-xs">1.Resilience & Adaptability</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Team Dynamics & Collaboration</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Decision-Making & Problem-Solving</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Self-Awareness & Emotional Intelligence</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Communication & Active Listening</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Overall Score</TableHead>
                            
                            <TableHead className="bg-blue-50 text-xs">2.Resilience & Adaptability</TableHead>
                            <TableHead className="bg-blue-50 text-xs">2.Team Dynamics & Collaboration</TableHead>
                            <TableHead className="bg-blue-50 text-xs">2.Decision-Making & Problem-Solving</TableHead>
                            <TableHead className="bg-blue-50 text-xs">2.Self-Awareness & Emotional Intelligence</TableHead>
                            <TableHead className="bg-blue-50 text-xs">2.Communication & Active Listening</TableHead>
                            <TableHead className="bg-blue-50 text-xs">2.Overall Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockStudentData.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.client}</TableCell>
                              <TableCell>{student.cohort}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell className="text-green-600">{student.status}</TableCell>
                              <TableCell className="text-green-600 bg-green-100">{student.entries}</TableCell>
                              
                              <TableCell className="bg-orange-50">{student.preAssessment.resilienceAdaptability}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.teamDynamicsCollaboration}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.decisionMakingProblemSolving}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.selfAwarenessEmotionalIntelligence}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.communicationActiveListening}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.overallScore}</TableCell>
                              
                              <TableCell className="bg-blue-50">{student.postAssessment.resilienceAdaptability}</TableCell>
                              <TableCell className="bg-blue-50">{student.postAssessment.teamDynamicsCollaboration}</TableCell>
                              <TableCell className="bg-blue-50">{student.postAssessment.decisionMakingProblemSolving}</TableCell>
                              <TableCell className="bg-blue-50">{student.postAssessment.selfAwarenessEmotionalIntelligence}</TableCell>
                              <TableCell className="bg-blue-50">{student.postAssessment.communicationActiveListening}</TableCell>
                              <TableCell className="bg-blue-50">{student.postAssessment.overallScore}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "student-report" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Student Report
                </h1>
                
                {selectedStudent === null ? (
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Select a Student to View Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="font-semibold">Client</TableHead>
                              <TableHead className="font-semibold">Cohort</TableHead>
                              <TableHead className="font-semibold">Name</TableHead>
                              <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockStudentData.map((student) => (
                              <TableRow key={student.id} className="cursor-pointer hover:bg-gray-100">
                                <TableCell>{student.client}</TableCell>
                                <TableCell>{student.cohort}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>
                                  <button 
                                    onClick={() => handleStudentClick(student.id)}
                                    className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm hover:bg-brand-blue/90 transition-colors"
                                  >
                                    View Report
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <button 
                      onClick={handleBackToStudentList}
                      className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors inline-flex items-center"
                    >
                      ← Back to Student List
                    </button>
                    
                    {(() => {
                      const student = mockStudentData.find(s => s.id === selectedStudent);
                      if (!student) return <p>Student not found</p>;
                      
                      const reportStudent = student.id === 9 ? student : mockStudentData[8];
                      
                      return (
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center space-x-4">
                                <img 
                                  src="/lovable-uploads/bd6e6c59-1db5-4935-a3bf-9d2725449104.png" 
                                  alt="Report Header" 
                                  className="max-w-full h-auto"
                                  style={{ maxHeight: "150px" }}
                                />
                              </div>
                            </div>
                            
                            <div className="mb-8">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                  <p className="text-lg font-medium text-blue-800">Client:</p>
                                  <p className="text-lg">{reportStudent.client}</p>
                                </div>
                                <div>
                                  <p className="text-lg font-medium text-blue-800">Cohort:</p>
                                  <p className="text-lg">{reportStudent.cohort}</p>
                                </div>
                                <div>
                                  <p className="text-lg font-medium text-blue-800">Student:</p>
                                  <p className="text-lg">{reportStudent.name}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-8">
                              <h2 className="text-2xl font-bold text-blue-800 mb-4">Summary</h2>
                              
                              <div className="overflow-x-auto mb-6">
                                <table className="min-w-full border-collapse">
                                  <thead>
                                    <tr>
                                      <th className="bg-gray-900 text-white text-center py-2 px-4 border border-gray-800">Overall Score</th>
                                      <th className="bg-gray-900 text-white text-center py-2 px-4 border border-gray-800">0 out of 40</th>
                                      <th className="bg-gray-900 text-white text-center py-2 px-4 border border-gray-800">Needs Development</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border border-gray-300 py-2 px-4">Resilience and Adaptability</td>
                                      <td className="border border-gray-300 py-2 px-4 text-center">0 out of 8</td>
                                      <td className="border border-gray-300 py-2 px-4 bg-yellow-200"></td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-300 py-2 px-4">Team Dynamics & Collaboration</td>
                                      <td className="border border-gray-300 py-2 px-4 text-center">0 out of 8</td>
                                      <td className="border border-gray-300 py-2 px-4 bg-yellow-200"></td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-300 py-2 px-4">Decision-Making & Problem-Solving</td>
                                      <td className="border border-gray-300 py-2 px-4 text-center">0 out of 8</td>
                                      <td className="border border-gray-300 py-2 px-4 bg-yellow-200"></td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-300 py-2 px-4">Self-Awareness & Emotional Intelligence</td>
                                      <td className="border border-gray-300 py-2 px-4 text-center">0 out of 8</td>
                                      <td className="border border-gray-300 py-2 px-4 bg-yellow-200"></td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-300 py-2 px-4">Communication & Active Listening</td>
                                      <td className="border border-gray-300 py-2 px-4 text-center">0 out of 8</td>
                                      <td className="border border-gray-300 py-2 px-4 bg-yellow-200"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            <div className="mb-8">
                              <h2 className="text-2xl font-bold text-blue-800 mb-4">Details</h2>
                              <h3 className="text-xl font-bold mb-4">{reportStudent.name}: 0 out of 40 - Needs Development</h3>
                              <p className="text-lg mb-6">Lacks foundational leadership skills; requires extensive support.</p>
                              
                              <div className="space-y-8">
                                <div>
                                  <h4 className="text-lg font-bold mb-2">Resilience and Adaptability: 0 out of 8 - Needs Development</h4>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="italic text-gray-500">[Assessment details would appear here]</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-lg font-bold mb-2">Team Dynamics & Collaboration: 0 out of 8 - Needs Development</h4>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="italic text-gray-500">[Assessment details would appear here]</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-lg font-bold mb-2">Decision-Making & Problem-Solving: 0 out of 8 - Needs Development</h4>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="italic text-gray-500">[Assessment details would appear here]</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-lg font-bold mb-2">Self-Awareness & Emotional Intelligence: 0 out of 8 - Needs Development</h4>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="italic text-gray-500">[Assessment details would appear here]</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-lg font-bold mb-2">Communication & Active Listening: 0 out of 8 - Needs Development</h4>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="italic text-gray-500">[Assessment details would appear here]</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {activeTab === "comparison-report" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Comparison Report
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Class A vs Class B</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-orange-50 rounded-md">
                          <h3 className="font-semibold text-lg mb-2">{mockCohortComparisonData.classA.name}</h3>
                          <p className="text-sm mb-1"><span className="font-medium">Client:</span> {mockCohortComparisonData.classA.client}</p>
                          <p className="text-sm mb-1"><span className="font-medium">Cohort:</span> {mockCohortComparisonData.classA.cohort}</p>
                          <p className="text-sm mb-1"><span className="font-medium">Type:</span> {mockCohortComparisonData.classA.type}</p>
                          <p className="text-sm"><span className="font-medium">Status:</span> {mockCohortComparisonData.classA.status}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-md">
                          <h3 className="font-semibold text-lg mb-2">{mockCohortComparisonData.classB.name}</h3>
                          <p className="text-sm mb-1"><span className="font-medium">Client:</span> {mockCohortComparisonData.classB.client}</p>
                          <p className="text-sm mb-1"><span className="font-medium">Cohort:</span> {mockCohortComparisonData.classB.cohort}</p>
                          <p className="text-sm mb-1"><span className="font-medium">Type:</span> {mockCohortComparisonData.classB.type}</p>
                          <p className="text-sm"><span className="font-medium">Status:</span> {mockCohortComparisonData.classB.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Comparison Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-md">
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            data={[
                              { name: "RA", classA: 0, classB: 0 },
                              { name: "TD", classA: 0, classB: 0 },
                              { name: "DM", classA: 0, classB: 0 },
                              { name: "SA", classA: 0, classB: 0 },
                              { name: "CA", classA: 0, classB: 0 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="classA" name="Class A" fill="#F97316" />
                            <Bar dataKey="classB" name="Class B" fill="#0EA5E9" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Proficiency Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Scoring Breakdown</h3>
                          <div className="space-y-2">
                            {proficiencyLevels.map((level) => (
                              <div key={level.id} className="flex items-center">
                                <div 
                                  className="w-4 h-4 rounded-full mr-2" 
                                  style={{ backgroundColor: level.color }}
                                ></div>
                                <span className="text-sm font-medium">{level.name}</span>
                                <span className="text-xs text-gray-500 ml-2">{level.range}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Student Distribution</h3>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Needs Development", value: 27, color: "#EF4444" },
                                  { name: "Developing Proficiency", value: 0, color: "#F59E0B" },
                                  { name: "Moderate Proficiency", value: 0, color: "#10B981" },
                                  { name: "High Proficiency", value: 0, color: "#3B82F6" },
                                  { name: "Exceptional Proficiency", value: 0, color: "#8B5CF6" },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {
                                  [
                                    { name: "Needs Development", value: 27, color: "#EF4444" },
                                    { name: "Developing Proficiency", value: 0, color: "#F59E0B" },
                                    { name: "Moderate Proficiency", value: 0, color: "#10B981" },
                                    { name: "High Proficiency", value: 0, color: "#3B82F6" },
                                    { name: "Exceptional Proficiency", value: 0, color: "#8B5CF6" },
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))
                                }
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Cohort Scoring Curve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={mockCohortScoringCurveData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="score" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="classA" 
                              name="Class A"
                              stroke="#F97316" 
                              activeDot={{ r: 8 }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="classB" 
                              name="Class B"
                              stroke="#0EA5E9" 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Top Students Ranking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold">No.</TableHead>
                              <TableHead className="font-semibold">Student</TableHead>
                              <TableHead className="font-semibold">Class</TableHead>
                              <TableHead className="font-semibold">Score</TableHead>
                              <TableHead className="font-semibold">Score (%)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockTopStudentsData.slice(0, 10).map((student) => (
                              <TableRow key={student.no}>
                                <TableCell>{student.no}</TableCell>
                                <TableCell>{student.student}</TableCell>
                                <TableCell>{student.class}</TableCell>
                                <TableCell>{student.score}</TableCell>
                                <TableCell>{student.scorePercentage}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "overall-report" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Overall Report - Pre Only
                </h1>
                
                <div className="border-b pb-2">
                  <Tabs 
                    value={activeReportSubTab} 
                    onValueChange={setActiveReportSubTab}
                    className="w-full"
                  >
                    <SubTabsList className="w-full flex overflow-x-auto">
                      <SubTabsTrigger value="cohort-scoring">Cohort Scoring</SubTabsTrigger>
                      <SubTabsTrigger value="student-rankings">Student Rankings</SubTabsTrigger>
                      <SubTabsTrigger value="assessment-analysis">Assessment Analysis</SubTabsTrigger>
                    </SubTabsList>
                    
                    <TabsContent value="cohort-scoring" className="pt-4">
                      <div className="space-y-8">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl text-green-800">Cohort Scoring Curve</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={scoringCurveData}
                                margin={{
                                  top: 20, right: 30, left: 20, bottom: 10
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="score" 
                                  label={{ 
                                    value: 'Score', 
                                    position: 'insideBottomRight', 
                                    offset: -10 
                                  }}
                                />
                                <YAxis 
                                  label={{ 
                                    value: 'Number of Students', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' }
                                  }}
                                />
                                <Tooltip />
                                <Line 
                                  type="monotone" 
                                  dataKey="count" 
                                  name="Students" 
                                  stroke="#8884d8" 
                                  activeDot={{ r: 8 }} 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl text-green-800">Overall Proficiency Levels for Cohort</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader className="bg-gray-100">
                                  <TableRow>
                                    <TableHead className="w-[300px] font-semibold">Scoring</TableHead>
                                    <TableHead className="text-center font-semibold">Student</TableHead>
                                    <TableHead className="text-center font-semibold">%</TableHead>
                                    <TableHead className="text-center font-semibold" colSpan={5}>
                                      <div className="w-full flex items-center">
                                        <div className="w-[20%] text-center">0%</div>
                                        <div className="w-[20%] text-center">20%</div>
                                        <div className="w-[20%] text-center">40%</div>
                                        <div className="w-[20%] text-center">60%</div>
                                        <div className="w-[20%] text-center">80%</div>
                                        <div className="w-[20%] text-center">100%</div>
                                      </div>
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {mockOverallReportData.cohortScoring.proficiencyLevels.map((level, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{level.level} {level.range}</TableCell>
                                      <TableCell className="text-center">{level.students}</TableCell>
                                      <TableCell 
                                        className={cn(
                                          "text-center",
                                          index === 4 && "bg-green-100"
                                        )}
                                      >{level.percentage}</TableCell>
                                      <TableCell colSpan={5} className="p-0">
                                        <div className="h-full w-full bg-gray-100 flex">
                                          {index === 4 ? (
                                            <div className="h-full bg-orange-400" style={{ width: "100%" }}></div>
                                          ) : (
                                            <div className="h-full bg-transparent" style={{ width: "0%" }}></div>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow className="bg-gray-50">
                                    <TableCell className="font-bold text-center">Total</TableCell>
                                    <TableCell className="font-bold text-center">38</TableCell>
                                    <TableCell className="font-bold text-center">100%</TableCell>
                                    <TableCell colSpan={5}></TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl text-orange-800">Average Score per Category</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <div className="h-[300px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={mockOverallReportData.cohortScoring.categoryScores}
                                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                      layout="vertical"
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis 
                                        type="number"
                                        domain={[0, 8]}
                                        label={{ 
                                          value: 'Score', 
                                          position: 'insideBottom', 
                                          offset: -10 
                                        }}
                                      />
                                      <YAxis 
                                        dataKey="category" 
                                        type="category" 
                                        width={150} 
                                        tick={{ fontSize: 12 }}
                                      />
                                      <Tooltip />
                                      <Legend />
                                      <Bar 
                                        dataKey="score" 
                                        name="Pre-Program" 
                                        fill="#8884d8" 
                                        background={{ fill: '#eee' }}
                                      />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div>
                                <Table>
                                  <TableHeader className="bg-gray-100">
                                    <TableRow>
                                      <TableHead className="font-semibold">Average Score</TableHead>
                                      <TableHead className="text-center font-semibold" colSpan={5}>Categories</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="font-medium">Pre-Program</TableCell>
                                      {mockOverallReportData.cohortScoring.categoryScores.map((cat, idx) => (
                                        <TableCell key={idx} className="text-center">0.00</TableCell>
                                      ))}
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl text-orange-800">Number of Students per Scoring and Category</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-8">
                              <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={mockOverallReportData.cohortScoring.categoryScores}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                    layout="vertical"
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      type="number" 
                                      domain={[0, 100]} 
                                      tickFormatter={(value) => `${value}%`}
                                      label={{ 
                                        value: 'Percentage of Students', 
                                        position: 'insideBottom', 
                                        offset: -10 
                                      }}
                                    />
                                    <YAxis 
                                      dataKey="category" 
                                      type="category" 
                                      width={150} 
                                      tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip />
                                    <Bar 
                                      dataKey="dummy" 
                                      name="Needs Development" 
                                      stackId="a" 
                                      fill="#EF4444" 
                                      radius={0}
                                      background={{ fill: '#eee' }}
                                    >
                                      {mockOverallReportData.cohortScoring.categoryScores.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#EF4444" />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                              
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead rowSpan={2} className="font-semibold align-middle">Number of Student</TableHead>
                                      <TableHead className="text-center font-semibold bg-red-500 text-white">Needs Development</TableHead>
                                      <TableHead className="text-center font-semibold bg-yellow-300">Developing Proficiency</TableHead>
                                      <TableHead className="text-center font-semibold bg-green-400">Moderate Proficiency</TableHead>
                                      <TableHead className="text-center font-semibold bg-blue-400">High Proficiency</TableHead>
                                      <TableHead className="text-center font-semibold bg-purple-500 text-white">Exceptional Proficiency</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {mockOverallReportData.cohortScoring.studentsPerCategory.map((category, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="font-medium">{category.category}</TableCell>
                                        <TableCell className="text-center">{category.needsDevelopment}</TableCell>
                                        <TableCell className="text-center">{category.developingProficiency}</TableCell>
                                        <TableCell className="text-center">{category.moderateProficiency}</TableCell>
                                        <TableCell className="text-center">{category.highProficiency}</TableCell>
                                        <TableCell className="text-center">{category.exceptionalProficiency}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl text-orange-800">Percent of Students in Each Proficiency Level, by Skill Category</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-8">
                              {mockOverallReportData.cohortScoring.studentsPerCategory.map((category, idx) => (
                                <div key={idx} className="space-y-2">
                                  <h3 className="text-lg font-semibold flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-black mr-2"></span>
                                    {category.category}
                                  </h3>
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader className="bg-gray-100">
                                        <TableRow>
                                          <TableHead className="w-[300px] font-semibold">Scoring</TableHead>
                                          <TableHead className="text-center font-semibold">Student</TableHead>
                                          <TableHead className="text-center font-semibold">%</TableHead>
                                          <TableHead className="text-center font-semibold" colSpan={5}>
                                            <div className="w-full flex items-center">
                                              <div className="w-[20%] text-center">0%</div>
                                              <div className="w-[20%] text-center">20%</div>
                                              <div className="w-[20%] text-center">40%</div>
                                              <div className="w-[20%] text-center">60%</div>
                                              <div className="w-[20%] text-center">80%</div>
                                              <div className="w-[20%] text-center">100%</div>
                                            </div>
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Exceptional Proficiency</TableCell>
                                          <TableCell className="text-center">0</TableCell>
                                          <TableCell className="text-center bg-green-100">0%</TableCell>
                                          <TableCell colSpan={5} className="p-0"></TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>High Proficiency</TableCell>
                                          <TableCell className="text-center">0</TableCell>
                                          <TableCell className="text-center bg-green-100">0%</TableCell>
                                          <TableCell colSpan={5} className="p-0"></TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Moderate Proficiency</TableCell>
                                          <TableCell className="text-center">0</TableCell>
                                          <TableCell className="text-center bg-green-100">0%</TableCell>
                                          <TableCell colSpan={5} className="p-0"></TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Developing Proficiency</TableCell>
                                          <TableCell className="text-center">0</TableCell>
                                          <TableCell className="text-center bg-green-100">0%</TableCell>
                                          <TableCell colSpan={5} className="p-0"></TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Needs Development</TableCell>
                                          <TableCell className="text-center">38</TableCell>
                                          <TableCell className="text-center bg-green-100">100%</TableCell>
                                          <TableCell colSpan={5} className="p-0">
                                            <div className="h-full w-full bg-gray-100 flex">
                                              <div className="h-full bg-orange-400" style={{ width: "100%" }}></div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow className="bg-gray-50">
                                          <TableCell className="font-bold">Total Student</TableCell>
                                          <TableCell className="font-bold text-center">38</TableCell>
                                          <TableCell className="font-bold text-center">100%</TableCell>
                                          <TableCell colSpan={5}></TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="student-rankings" className="pt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Student Rankings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="font-semibold">Rank</TableHead>
                                  <TableHead className="font-semibold">Student</TableHead>
                                  <TableHead className="font-semibold">Class</TableHead>
                                  <TableHead className="font-semibold">Score</TableHead>
                                  <TableHead className="font-semibold">Score (%)</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {mockTopStudentsData.slice(0, 20).map((student) => (
                                  <TableRow key={student.no}>
                                    <TableCell>{student.no}</TableCell>
                                    <TableCell>{student.student}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>{student.score}</TableCell>
                                    <TableCell>{student.scorePercentage}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="assessment-analysis" className="pt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Assessment Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Question Performance Analysis</h3>
                            <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { question: "Q1", avgScore: 0.2, maxPossible: 1 },
                                    { question: "Q2", avgScore: 0.3, maxPossible: 1 },
                                    { question: "Q3", avgScore: 0.1, maxPossible: 1 },
                                    { question: "Q4", avgScore: 0.4, maxPossible: 1 },
                                    { question: "Q5", avgScore: 0.3, maxPossible: 1 },
                                    { question: "Q6", avgScore: 0.2, maxPossible: 1 },
                                    { question: "Q7", avgScore: 0.1, maxPossible: 1 },
                                    { question: "Q8", avgScore: 0.3, maxPossible: 1 },
                                  ]}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="question" />
                                  <YAxis domain={[0, 1]} />
                                  <Tooltip />
                                  <Legend />
                                  <Bar 
                                    dataKey="avgScore" 
                                    name="Average Score" 
                                    fill="#F97316" 
                                  />
                                  <Bar 
                                    dataKey="maxPossible" 
                                    name="Max Possible" 
                                    fill="#0EA5E9" 
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>

                            <h3 className="text-lg font-semibold mt-8">Response Distribution</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-md font-medium mb-2">Question 1: Leadership Style</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { answer: "Option A", count: 22 },
                                        { answer: "Option B", count: 8 },
                                        { answer: "Option C", count: 6 },
                                        { answer: "Option D", count: 2 },
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="count"
                                    >
                                      {[
                                        { answer: "Option A", count: 22, color: "#F97316" },
                                        { answer: "Option B", count: 8, color: "#0EA5E9" },
                                        { answer: "Option C", count: 6, color: "#22C55E" },
                                        { answer: "Option D", count: 2, color: "#EAB308" },
                                      ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div>
                                <h4 className="text-md font-medium mb-2">Question 2: Team Communication</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { answer: "Option A", count: 15 },
                                        { answer: "Option B", count: 12 },
                                        { answer: "Option C", count: 8 },
                                        { answer: "Option D", count: 3 },
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="count"
                                    >
                                      {[
                                        { answer: "Option A", count: 15, color: "#F97316" },
                                        { answer: "Option B", count: 12, color: "#0EA5E9" },
                                        { answer: "Option C", count: 8, color: "#22C55E" },
                                        { answer: "Option D", count: 3, color: "#EAB308" },
                                      ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Settings
                </h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Settings content will go here.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrgDashboard;
