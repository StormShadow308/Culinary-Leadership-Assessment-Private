
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
} from "recharts";
import { 
  Users, 
  Target, 
  ChefHat, 
  LayoutDashboard, 
  GraduationCap,
  BarChart, 
  Calendar,
  UserCog
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockPieData = [
  { name: "Leadership", value: 35 },
  { name: "Communication", value: 25 },
  { name: "Technical", value: 20 },
  { name: "Management", value: 20 },
];

const COLORS = ["#F97316", "#0EA5E9", "#22C55E", "#EAB308"];

// Mock data for student assessment results
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
  }
];

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex pt-16">
        {/* Sidebar */}
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
                    onClick={() => setActiveTab("analytics")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "analytics" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <BarChart className="h-5 w-5 mr-2" />
                    Analytics
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("schedule")}
                    className={cn(
                      "flex items-center w-full p-2 rounded-md text-left",
                      activeTab === "schedule" 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule
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

        {/* Main Content */}
        <div className="w-full md:ml-64 p-4 pt-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Organization Dashboard
                </h1>

                {/* Stats Grid */}
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

                {/* Chart */}
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

            {/* All Students Tab */}
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
                            
                            {/* Pre-Program Headers */}
                            <TableHead className="font-semibold bg-orange-100" colSpan={6}>
                              Pre-Program
                            </TableHead>
                            
                            {/* Post-Program Headers */}
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
                            
                            {/* Pre-Program Sub-Headers */}
                            <TableHead className="bg-orange-50 text-xs">1.Resilience & Adaptability</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Team Dynamics & Collaboration</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Decision-Making & Problem-Solving</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Self-Awareness & Emotional Intelligence</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Communication & Active Listening</TableHead>
                            <TableHead className="bg-orange-50 text-xs">1.Overall Score</TableHead>
                            
                            {/* Post-Program Sub-Headers */}
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
                              
                              {/* Pre-Program Data */}
                              <TableCell className="bg-orange-50">{student.preAssessment.resilienceAdaptability}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.teamDynamicsCollaboration}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.decisionMakingProblemSolving}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.selfAwarenessEmotionalIntelligence}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.communicationActiveListening}</TableCell>
                              <TableCell className="bg-orange-50">{student.preAssessment.overallScore}</TableCell>
                              
                              {/* Post-Program Data */}
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

            {/* Analytics Tab Placeholder */}
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Analytics
                </h1>
                <Card className="p-6">
                  <CardContent>
                    <p className="text-gray-600">Analytics dashboard coming soon.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Schedule Tab Placeholder */}
            {activeTab === "schedule" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Schedule
                </h1>
                <Card className="p-6">
                  <CardContent>
                    <p className="text-gray-600">Schedule dashboard coming soon.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab Placeholder */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Settings
                </h1>
                <Card className="p-6">
                  <CardContent>
                    <p className="text-gray-600">Settings dashboard coming soon.</p>
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
