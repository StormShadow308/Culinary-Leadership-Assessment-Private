import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { mockComparisonReportData } from "./mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ComparisonReportNew = () => {
  const { classInfo, cohortScoringCurve, proficiencyLevels, categoryScores, cohortScoringByCategory, topStudents } = mockComparisonReportData;

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
        Comparison Report
      </h1>

      {/* Class Information Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr>
              <th className="p-2 md:p-3 text-left text-lg md:text-xl font-bold text-blue-800 border-b-2 border-blue-800 w-1/2">Class A</th>
              <th className="p-2 md:p-3 text-left text-lg md:text-xl font-bold text-orange-500 border-b-2 border-orange-500 w-1/2">Class B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-blue-800">Client:</span> {classInfo.classA.client}
              </td>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-orange-500">Client:</span> {classInfo.classB.client}
              </td>
            </tr>
            <tr>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-blue-800">Cohort:</span> {classInfo.classA.cohort}
              </td>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-orange-500">Cohort:</span> {classInfo.classB.cohort}
              </td>
            </tr>
            <tr>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-blue-800">Type:</span> {classInfo.classA.type}
              </td>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-orange-500">Type:</span> {classInfo.classB.type}
              </td>
            </tr>
            <tr>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-blue-800">Student</span> {classInfo.classA.student}
              </td>
              <td className="p-2 md:p-3 border border-gray-300">
                <span className="font-bold text-orange-500">Student</span> {classInfo.classB.student}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cohort Scoring Curve */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-green-700 mb-2 md:mb-4">Cohort Scoring Curve</h2>
        <div className="h-[250px] md:h-[300px] bg-white p-2 md:p-4 border border-gray-200 rounded-md">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={cohortScoringCurve}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="score" 
                label={{ value: 'Score', position: 'insideBottom', offset: -5, fontSize: 12 }} 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                domain={[0, 1]} 
                label={{ value: 'Percentage', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="classA" 
                name="Class A" 
                stroke="#1e40af" 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="classB" 
                name="Class B" 
                stroke="#ea580c" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overall Proficiency Levels */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-2 md:mb-4">Overall Proficiency Levels for Cohort</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead>
              <tr>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300">Scoring</th>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300" colSpan={2}>Class A</th>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300" colSpan={2}>Class B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 md:p-3 font-bold border border-gray-300 whitespace-nowrap">(36 - 40) Exceptional Proficiency</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classA.exceptional}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classB.exceptional}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
              </tr>
              <tr>
                <td className="p-2 md:p-3 font-bold border border-gray-300 whitespace-nowrap">(30 - 35) High Proficiency</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classA.high}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classB.high}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
              </tr>
              <tr>
                <td className="p-2 md:p-3 font-bold border border-gray-300 whitespace-nowrap">(20 - 29) Moderate Proficiency</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classA.moderate}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classB.moderate}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
              </tr>
              <tr>
                <td className="p-2 md:p-3 font-bold border border-gray-300 whitespace-nowrap">(10 - 19) Developing Proficiency</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classA.developing}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classB.developing}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
              </tr>
              <tr>
                <td className="p-2 md:p-3 font-bold border border-gray-300 whitespace-nowrap">(0 - 9) Needs Development</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classA.needsDevelopment}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
                <td className="p-2 md:p-3 text-center border border-gray-300">{proficiencyLevels.classB.needsDevelopment}</td>
                <td className="p-2 md:p-3 text-center border border-gray-300 bg-green-200">0%</td>
              </tr>
              <tr>
                <td className="p-2 md:p-3 font-bold border border-gray-300">Total</td>
                <td className="p-2 md:p-3 text-center font-bold border border-gray-300">{proficiencyLevels.classA.total}</td>
                <td className="p-2 md:p-3 text-center font-bold border border-gray-300 bg-green-200">0%</td>
                <td className="p-2 md:p-3 text-center font-bold border border-gray-300">{proficiencyLevels.classB.total}</td>
                <td className="p-2 md:p-3 text-center font-bold border border-gray-300 bg-green-200">0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Average Score per Category */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-amber-600 mb-2 md:mb-4">Average Score per Category</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="h-[250px] md:h-[300px] bg-white p-2 md:p-4 border border-gray-200 rounded-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { category: "Resilience and Adaptability", classA: categoryScores.classA.resilienceAdaptability, classB: categoryScores.classB.resilienceAdaptability },
                  { category: "Team Dynamics & Collaboration", classA: categoryScores.classA.teamDynamics, classB: categoryScores.classB.teamDynamics },
                  { category: "Decision-Making & Problem-Solving", classA: categoryScores.classA.decisionMaking, classB: categoryScores.classB.decisionMaking },
                  { category: "Self-Awareness & Emotional Intelligence", classA: categoryScores.classA.selfAwareness, classB: categoryScores.classB.selfAwareness },
                  { category: "Communication & Active Listening", classA: categoryScores.classA.communication, classB: categoryScores.classB.communication },
                ]}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 8]} tick={{ fontSize: 10 }} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="classA" name="Class A" fill="#1e40af" />
                <Bar dataKey="classB" name="Class B" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="p-2 md:p-3 text-left font-bold border border-gray-300 whitespace-nowrap">Average Score</th>
                  <th className="p-2 md:p-3 text-center font-bold border border-gray-300 whitespace-nowrap">Resilience and Adaptability</th>
                  <th className="p-2 md:p-3 text-center font-bold border border-gray-300 whitespace-nowrap">Team Dynamics & Collaboration</th>
                  <th className="p-2 md:p-3 text-center font-bold border border-gray-300 whitespace-nowrap">Decision-Making & Problem-Solving</th>
                  <th className="p-2 md:p-3 text-center font-bold border border-gray-300 whitespace-nowrap">Self-Awareness & Emotional Intelligence</th>
                  <th className="p-2 md:p-3 text-center font-bold border border-gray-300 whitespace-nowrap">Communication & Active Listening</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 md:p-3 font-bold border border-gray-300">Class A</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classA.resilienceAdaptability.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classA.teamDynamics.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classA.decisionMaking.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classA.selfAwareness.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classA.communication.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2 md:p-3 font-bold border border-gray-300">Class B</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classB.resilienceAdaptability.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classB.teamDynamics.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classB.decisionMaking.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classB.selfAwareness.toFixed(2)}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{categoryScores.classB.communication.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cohort Scoring by Category */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-black mb-2 md:mb-4">Cohort Scoring by Category</h2>
        <h3 className="text-lg md:text-xl font-semibold text-amber-700 mb-1 md:mb-2">Number of Students per Scoring and Category</h3>
        
        <div className="overflow-x-auto mb-4 md:mb-6">
          <div className="h-[300px] md:h-[400px] bg-white p-2 md:p-4 border border-gray-200 rounded-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { category: "Resilience & Adaptability", A: "A", B: "B" },
                  { category: "Team Dynamics & Collaboration", A: "A", B: "B" },
                  { category: "Decision-Making & Problem-Solving", A: "A", B: "B" },
                  { category: "Self-Awareness & Emotional Intelligence", A: "A", B: "B" },
                  { category: "Communication & Active Listening", A: "A", B: "B" },
                ]}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 8]} tick={{ fontSize: 10 }} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="A" name="Class A" fill="#1e40af" />
                <Bar dataKey="B" name="Class B" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Rankings */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-2 md:mb-4">Student Rankings</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead>
              <tr>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300">Rank</th>
                <th className="p-2 md:p-3 text-left font-bold border border-gray-300">Name</th>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300">Class</th>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300">Score</th>
                <th className="p-2 md:p-3 text-center font-bold border border-gray-300">Proficiency Level</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student, index) => (
                <tr key={index}>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{index + 1}</td>
                  <td className="p-2 md:p-3 border border-gray-300">{student.name}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{student.class}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{student.score}</td>
                  <td className="p-2 md:p-3 text-center border border-gray-300">{student.proficiencyLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonReportNew; 