import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Users, Target, ChefHat, GraduationCap, BookOpen, Award } from "lucide-react";
import { mockPieData, COLORS, mockOverallReportData, mockStudentData, mockComparisonReportData } from "./mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  // Get data from mockOverallReportData
  const { cohortScoring } = mockOverallReportData;
  
  // Transform the cohort scoring curve data for the line chart
  const cohortScoringCurveData = cohortScoring.cohortScoringCurve.map((value, index) => ({
    score: index + 1,
    value
  }));

  // Get top 5 students by overall score
  const topStudents = [...mockStudentData]
    .sort((a, b) => b.preAssessment.overallScore - a.preAssessment.overallScore)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
        Organization Dashboard
      </h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-brand-orange/10">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-brand-orange" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-xl md:text-2xl font-semibold">{mockStudentData.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-brand-blue/10">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-brand-blue" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Avg. Overall Score</p>
              <p className="text-xl md:text-2xl font-semibold">{cohortScoring.averageOverallScore}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 animate-fade-in sm:col-span-2 md:col-span-1" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-green-100">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-xl md:text-2xl font-semibold">100%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Proficiency Distribution */}
        <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Proficiency Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4 h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cohortScoring.proficiencyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {cohortScoring.proficiencyDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Score per Category */}
        <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Average Score per Category</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4 h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cohortScoring.categoryScores}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 8]} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cohort Scoring Curve */}
        <Card className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Cohort Scoring Curve</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4 h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cohortScoringCurveData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="score"
                  label={{ 
                    value: 'Score', 
                    position: 'insideBottom', 
                    offset: -5,
                    fontSize: 12
                  }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Percentage', 
                    angle: -90, 
                    position: 'insideLeft',
                    fontSize: 12
                  }}
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(Number(value) * 100)}%`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Students */}
        <Card className="animate-fade-in" style={{ animationDelay: "700ms" }}>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Top Performing Students</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">Name</TableHead>
                    <TableHead className="text-xs md:text-sm">Cohort</TableHead>
                    <TableHead className="text-right text-xs md:text-sm">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{student.name}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.cohort}</TableCell>
                      <TableCell className="text-right text-xs md:text-sm py-2 md:py-4">{student.preAssessment.overallScore}/40</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Proficiency Levels */}
      <Card className="animate-fade-in" style={{ animationDelay: "800ms" }}>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Overall Proficiency Levels</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 text-xs md:text-sm">Scoring</TableHead>
                  <TableHead className="w-1/6 text-xs md:text-sm">Student</TableHead>
                  <TableHead className="w-1/6 text-xs md:text-sm">%</TableHead>
                  <TableHead className="w-1/3">
                    <div className="flex justify-between text-[10px] md:text-xs">
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
                {cohortScoring.proficiencyLevels.map((level, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs md:text-sm py-2 md:py-4">{level.level}</TableCell>
                    <TableCell className="text-xs md:text-sm py-2 md:py-4">{level.students}</TableCell>
                    <TableCell className="text-xs md:text-sm py-2 md:py-4">{level.percentage}</TableCell>
                    <TableCell className="py-2 md:py-4">
                      {level.percentage !== "0%" && (
                        <div 
                          className="h-4 md:h-6 bg-orange-500" 
                          style={{ 
                            width: level.percentage,
                            borderRadius: '4px'
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell className="text-xs md:text-sm py-2 md:py-4">Total</TableCell>
                  <TableCell className="text-xs md:text-sm py-2 md:py-4">{cohortScoring.totalStudents}</TableCell>
                  <TableCell className="text-xs md:text-sm py-2 md:py-4">100%</TableCell>
                  <TableCell className="py-2 md:py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 