
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsHeader, SubTabsList, SubTabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, ScoreBar } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Download, Filter, List, ListFilter, Trophy, Medal, BarChart } from "lucide-react";

// Student ranking data (mock data)
const overallStudentRankings = [
  { id: 1, name: "John Smith", score: 95, scorePercent: 95 },
  { id: 2, name: "Emily Johnson", score: 92, scorePercent: 92 },
  { id: 3, name: "Michael Chen", score: 90, scorePercent: 90 },
  { id: 4, name: "Sarah Williams", score: 88, scorePercent: 88 },
  { id: 5, name: "David Rodriguez", score: 87, scorePercent: 87 },
  { id: 6, name: "Jessica Brown", score: 85, scorePercent: 85 },
  { id: 7, name: "Robert Kim", score: 84, scorePercent: 84 },
  { id: 8, name: "Amanda Lee", score: 83, scorePercent: 83 },
  { id: 9, name: "Thomas Wilson", score: 82, scorePercent: 82 },
  { id: 10, name: "Jennifer Garcia", score: 81, scorePercent: 81 },
  { id: 11, name: "James Martinez", score: 80, scorePercent: 80 },
  { id: 12, name: "Emma Taylor", score: 79, scorePercent: 79 },
  { id: 13, name: "Daniel Lewis", score: 78, scorePercent: 78 },
  { id: 14, name: "Olivia Walker", score: 77, scorePercent: 77 },
  { id: 15, name: "Christopher Allen", score: 76, scorePercent: 76 },
];

const categoryData = {
  resilience: {
    top: [
      { id: 1, name: "John Smith", score: 98, scorePercent: 98 },
      { id: 2, name: "Emily Johnson", score: 96, scorePercent: 96 },
      { id: 3, name: "Michael Chen", score: 94, scorePercent: 94 },
      { id: 4, name: "Sarah Williams", score: 93, scorePercent: 93 },
      { id: 5, name: "David Rodriguez", score: 92, scorePercent: 92 },
      { id: 6, name: "Jessica Brown", score: 91, scorePercent: 91 },
      { id: 7, name: "Robert Kim", score: 90, scorePercent: 90 },
      { id: 8, name: "Amanda Lee", score: 89, scorePercent: 89 },
      { id: 9, name: "Thomas Wilson", score: 88, scorePercent: 88 },
      { id: 10, name: "Jennifer Garcia", score: 87, scorePercent: 87 },
    ],
    bottom: [
      { id: 1, name: "Alex Johnson", score: 50, scorePercent: 50 },
      { id: 2, name: "Madison Brown", score: 52, scorePercent: 52 },
      { id: 3, name: "Tyler Smith", score: 54, scorePercent: 54 },
      { id: 4, name: "Sophia Rodriguez", score: 56, scorePercent: 56 },
      { id: 5, name: "Jacob Wilson", score: 58, scorePercent: 58 },
      { id: 6, name: "Olivia Martinez", score: 60, scorePercent: 60 },
      { id: 7, name: "Ethan Taylor", score: 62, scorePercent: 62 },
      { id: 8, name: "Isabella Thomas", score: 64, scorePercent: 64 },
      { id: 9, name: "Lucas Garcia", score: 66, scorePercent: 66 },
      { id: 10, name: "Mia Anderson", score: 68, scorePercent: 68 },
    ]
  },
  teamDynamics: {
    top: [
      { id: 1, name: "Emily Johnson", score: 97, scorePercent: 97 },
      { id: 2, name: "Michael Chen", score: 95, scorePercent: 95 },
      { id: 3, name: "Sarah Williams", score: 94, scorePercent: 94 },
      { id: 4, name: "David Rodriguez", score: 93, scorePercent: 93 },
      { id: 5, name: "John Smith", score: 92, scorePercent: 92 },
      { id: 6, name: "Jessica Brown", score: 91, scorePercent: 91 },
      { id: 7, name: "Robert Kim", score: 90, scorePercent: 90 },
      { id: 8, name: "Amanda Lee", score: 89, scorePercent: 89 },
      { id: 9, name: "Thomas Wilson", score: 88, scorePercent: 88 },
      { id: 10, name: "Jennifer Garcia", score: 87, scorePercent: 87 },
    ],
    bottom: [
      { id: 1, name: "Tyler Smith", score: 52, scorePercent: 52 },
      { id: 2, name: "Madison Brown", score: 54, scorePercent: 54 },
      { id: 3, name: "Alex Johnson", score: 56, scorePercent: 56 },
      { id: 4, name: "Sophia Rodriguez", score: 58, scorePercent: 58 },
      { id: 5, name: "Jacob Wilson", score: 60, scorePercent: 60 },
      { id: 6, name: "Olivia Martinez", score: 62, scorePercent: 62 },
      { id: 7, name: "Ethan Taylor", score: 64, scorePercent: 64 },
      { id: 8, name: "Isabella Thomas", score: 66, scorePercent: 66 },
      { id: 9, name: "Lucas Garcia", score: 68, scorePercent: 68 },
      { id: 10, name: "Mia Anderson", score: 70, scorePercent: 70 },
    ]
  },
  decisionMaking: {
    top: [
      { id: 1, name: "Sarah Williams", score: 96, scorePercent: 96 },
      { id: 2, name: "John Smith", score: 95, scorePercent: 95 },
      { id: 3, name: "Emily Johnson", score: 93, scorePercent: 93 },
      { id: 4, name: "Michael Chen", score: 91, scorePercent: 91 },
      { id: 5, name: "David Rodriguez", score: 90, scorePercent: 90 },
      { id: 6, name: "Jessica Brown", score: 89, scorePercent: 89 },
      { id: 7, name: "Robert Kim", score: 88, scorePercent: 88 },
      { id: 8, name: "Amanda Lee", score: 87, scorePercent: 87 },
      { id: 9, name: "Thomas Wilson", score: 86, scorePercent: 86 },
      { id: 10, name: "Jennifer Garcia", score: 85, scorePercent: 85 },
    ],
    bottom: [
      { id: 1, name: "Madison Brown", score: 48, scorePercent: 48 },
      { id: 2, name: "Tyler Smith", score: 50, scorePercent: 50 },
      { id: 3, name: "Alex Johnson", score: 52, scorePercent: 52 },
      { id: 4, name: "Sophia Rodriguez", score: 54, scorePercent: 54 },
      { id: 5, name: "Jacob Wilson", score: 56, scorePercent: 56 },
      { id: 6, name: "Olivia Martinez", score: 58, scorePercent: 58 },
      { id: 7, name: "Ethan Taylor", score: 60, scorePercent: 60 },
      { id: 8, name: "Isabella Thomas", score: 62, scorePercent: 62 },
      { id: 9, name: "Lucas Garcia", score: 64, scorePercent: 64 },
      { id: 10, name: "Mia Anderson", score: 66, scorePercent: 66 },
    ]
  },
  selfAwareness: {
    top: [
      { id: 1, name: "Michael Chen", score: 99, scorePercent: 99 },
      { id: 2, name: "Sarah Williams", score: 97, scorePercent: 97 },
      { id: 3, name: "John Smith", score: 96, scorePercent: 96 },
      { id: 4, name: "Emily Johnson", score: 94, scorePercent: 94 },
      { id: 5, name: "David Rodriguez", score: 93, scorePercent: 93 },
      { id: 6, name: "Jessica Brown", score: 92, scorePercent: 92 },
      { id: 7, name: "Robert Kim", score: 91, scorePercent: 91 },
      { id: 8, name: "Amanda Lee", score: 90, scorePercent: 90 },
      { id: 9, name: "Thomas Wilson", score: 89, scorePercent: 89 },
      { id: 10, name: "Jennifer Garcia", score: 88, scorePercent: 88 },
    ],
    bottom: [
      { id: 1, name: "Alex Johnson", score: 45, scorePercent: 45 },
      { id: 2, name: "Madison Brown", score: 48, scorePercent: 48 },
      { id: 3, name: "Tyler Smith", score: 51, scorePercent: 51 },
      { id: 4, name: "Sophia Rodriguez", score: 53, scorePercent: 53 },
      { id: 5, name: "Jacob Wilson", score: 55, scorePercent: 55 },
      { id: 6, name: "Olivia Martinez", score: 57, scorePercent: 57 },
      { id: 7, name: "Ethan Taylor", score: 59, scorePercent: 59 },
      { id: 8, name: "Isabella Thomas", score: 61, scorePercent: 61 },
      { id: 9, name: "Lucas Garcia", score: 63, scorePercent: 63 },
      { id: 10, name: "Mia Anderson", score: 65, scorePercent: 65 },
    ]
  },
  communication: {
    top: [
      { id: 1, name: "Emily Johnson", score: 98, scorePercent: 98 },
      { id: 2, name: "John Smith", score: 97, scorePercent: 97 },
      { id: 3, name: "Michael Chen", score: 95, scorePercent: 95 },
      { id: 4, name: "Sarah Williams", score: 94, scorePercent: 94 },
      { id: 5, name: "David Rodriguez", score: 92, scorePercent: 92 },
      { id: 6, name: "Jessica Brown", score: 91, scorePercent: 91 },
      { id: 7, name: "Robert Kim", score: 90, scorePercent: 90 },
      { id: 8, name: "Amanda Lee", score: 89, scorePercent: 89 },
      { id: 9, name: "Thomas Wilson", score: 88, scorePercent: 88 },
      { id: 10, name: "Jennifer Garcia", score: 87, scorePercent: 87 },
    ],
    bottom: [
      { id: 1, name: "Madison Brown", score: 46, scorePercent: 46 },
      { id: 2, name: "Alex Johnson", score: 49, scorePercent: 49 },
      { id: 3, name: "Tyler Smith", score: 51, scorePercent: 51 },
      { id: 4, name: "Sophia Rodriguez", score: 53, scorePercent: 53 },
      { id: 5, name: "Jacob Wilson", score: 55, scorePercent: 55 },
      { id: 6, name: "Olivia Martinez", score: 57, scorePercent: 57 },
      { id: 7, name: "Ethan Taylor", score: 59, scorePercent: 59 },
      { id: 8, name: "Isabella Thomas", score: 61, scorePercent: 61 },
      { id: 9, name: "Lucas Garcia", score: 63, scorePercent: 63 },
      { id: 10, name: "Mia Anderson", score: 65, scorePercent: 65 },
    ]
  }
};

// Render category ranking table
const CategoryRankingTable = ({ title, topData, bottomData }: { title: string, topData: any[], bottomData: any[] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <h3 className="text-[#e67e22] font-medium mb-2">Top 10 Score</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="w-[100px]">Score</TableHead>
                <TableHead className="w-[150px]">Score in %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topData.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.score}</TableCell>
                  <TableCell className="p-0">
                    <div className="h-full bg-green-500 text-white flex items-center justify-center">
                      {student.scorePercent}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="text-[#e67e22] font-medium mb-2">Bottom 10 Score</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="w-[100px]">Score</TableHead>
                <TableHead className="w-[150px]">Score in %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bottomData.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.score}</TableCell>
                  <TableCell className="p-0">
                    <div className="h-full bg-green-500 text-white flex items-center justify-center">
                      {student.scorePercent}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// Student Rankings component
const StudentRankings = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Students Rankings</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Overall Score</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No.</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="w-[100px]">Score</TableHead>
              <TableHead className="w-[100px]">Score in %</TableHead>
              <TableHead className="w-[500px]">
                <div className="flex justify-between text-xs text-gray-500 px-2">
                  <span>0%</span>
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overallStudentRankings.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.score}</TableCell>
                <TableCell>{student.scorePercent}%</TableCell>
                <TableCell>
                  <ScoreBar percentage={student.scorePercent} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryRankingTable 
        title="Resilience and Adaptability" 
        topData={categoryData.resilience.top} 
        bottomData={categoryData.resilience.bottom} 
      />
      
      <CategoryRankingTable 
        title="Team Dynamics & Collaboration" 
        topData={categoryData.teamDynamics.top} 
        bottomData={categoryData.teamDynamics.bottom} 
      />
      
      <CategoryRankingTable 
        title="Decision-Making & Problem-Solving" 
        topData={categoryData.decisionMaking.top} 
        bottomData={categoryData.decisionMaking.bottom} 
      />
      
      <CategoryRankingTable 
        title="Self-Awareness & Emotional Intelligence" 
        topData={categoryData.selfAwareness.top} 
        bottomData={categoryData.selfAwareness.bottom} 
      />
      
      <CategoryRankingTable 
        title="Communication & Active Listening" 
        topData={categoryData.communication.top} 
        bottomData={categoryData.communication.bottom} 
      />
    </div>
  );
};

const OrgDashboard = () => {
  return (
    <div className="p-4 md:p-6 pt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Organization Dashboard</h1>
          <p className="text-muted-foreground">Overview of your organization's data and analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overall-report">
        <TabsHeader>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall-report">Overall Report</TabsTrigger>
            <TabsTrigger value="overall-report-pre-only">Overall Report - Pre Only</TabsTrigger>
            <TabsTrigger value="cohort-report">Cohort Report</TabsTrigger>
            <TabsTrigger value="user-report">User Report</TabsTrigger>
          </TabsList>
        </TabsHeader>

        <TabsContent value="overall-report" className="p-4">
          <h2 className="text-xl font-bold mb-4">Overall Report</h2>
          <p>This is the overall report content.</p>
        </TabsContent>

        <TabsContent value="overall-report-pre-only">
          <Tabs defaultValue="cohort-scoring">
            <div className="border-b mb-4">
              <SubTabsList className="ml-4 mt-4">
                <SubTabsTrigger value="cohort-scoring">Cohort Scoring</SubTabsTrigger>
                <SubTabsTrigger value="individual-scores">Individual Scores</SubTabsTrigger>
                <SubTabsTrigger value="student-rankings">Student Rankings</SubTabsTrigger>
              </SubTabsList>
            </div>
            
            <TabsContent value="cohort-scoring">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Cohort Scoring</h2>
                <p>This is the cohort scoring content.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="individual-scores">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Individual Scores</h2>
                <p>This is the individual scores content.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="student-rankings">
              <StudentRankings />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="cohort-report" className="p-4">
          <h2 className="text-xl font-bold mb-4">Cohort Report</h2>
          <p>This is the cohort report content.</p>
        </TabsContent>

        <TabsContent value="user-report" className="p-4">
          <h2 className="text-xl font-bold mb-4">User Report</h2>
          <p>This is the user report content.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDashboard;
