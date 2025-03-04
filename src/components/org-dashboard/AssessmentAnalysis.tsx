import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOverallReportData } from "./mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const AssessmentAnalysis = () => {
  const { assessmentAnalysis } = mockOverallReportData;
  const categories = {
    "Resilience and Adaptability": "resilienceAdaptability",
    "Team Dynamics & Collaboration": "teamDynamics",
    "Decision-Making & Problem-Solving": "decisionMaking",
    "Self-Awareness & Emotional Intelligence": "selfAwareness",
    "Communication & Active Listening": "communication"
  };

  // Colors for the different answer types
  const answerColors = {
    bothRight: "#22C55E", // green
    onlyBestRight: "#3B82F6", // blue
    onlyWorstRight: "#60A5FA", // light blue
    bothWrong: "#EF4444" // red
  };

  // Prepare data for the pie chart
  const preparePieData = (categoryKey) => {
    const totals = assessmentAnalysis.categories[categoryKey].total;
    return [
      { name: "Both Right", value: parseInt(totals.bothRight.percentage), color: answerColors.bothRight },
      { name: "Only Best Right", value: parseInt(totals.onlyBestRight.percentage), color: answerColors.onlyBestRight },
      { name: "Only Worst Right", value: parseInt(totals.onlyWorstRight.percentage), color: answerColors.onlyWorstRight },
      { name: "Both Wrong", value: parseInt(totals.bothWrong.percentage), color: answerColors.bothWrong }
    ];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Assessment Analysis
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-orange-800">Analysis of answers to each question</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(categories).map(([displayName, key]) => (
            <div key={key} className="mb-12">
              <div className="overflow-x-auto mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead colSpan={2} className="text-center bg-blue-900 text-white">Correct Answer :</TableHead>
                      <TableHead className="text-center bg-blue-900 text-white">Both Right</TableHead>
                      <TableHead className="text-center bg-blue-900 text-white">Only Best Right</TableHead>
                      <TableHead className="text-center bg-blue-900 text-white">Only Worst Right</TableHead>
                      <TableHead className="text-center bg-blue-900 text-white">Both Wrong</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="bg-blue-800 text-white">Category</TableHead>
                      <TableHead className="bg-blue-800 text-white">Question</TableHead>
                      <TableHead className="bg-blue-800 text-white"></TableHead>
                      <TableHead className="bg-blue-800 text-white"></TableHead>
                      <TableHead className="bg-blue-800 text-white"></TableHead>
                      <TableHead className="bg-blue-800 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessmentAnalysis.categories[key].questions.map((question, index) => (
                      <>
                        <TableRow key={`${question.id}-student`}>
                          {index === 0 && (
                            <TableCell rowSpan={assessmentAnalysis.categories[key].questions.length * 2 + 2} className="bg-blue-100">
                              {displayName}
                            </TableCell>
                          )}
                          <TableCell rowSpan={2} className="bg-gray-100">{question.id}</TableCell>
                          <TableCell className="text-center">Student</TableCell>
                          <TableCell className="text-center">{question.bothRight.students}</TableCell>
                          <TableCell className="text-center">{question.onlyBestRight.students}</TableCell>
                          <TableCell className="text-center">{question.onlyWorstRight.students}</TableCell>
                          <TableCell className="text-center">{question.bothWrong.students}</TableCell>
                        </TableRow>
                        <TableRow key={`${question.id}-percentage`}>
                          <TableCell className="text-center">%</TableCell>
                          <TableCell className={`text-center ${parseInt(question.bothRight.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                            {question.bothRight.percentage}
                          </TableCell>
                          <TableCell className={`text-center ${parseInt(question.onlyBestRight.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                            {question.onlyBestRight.percentage}
                          </TableCell>
                          <TableCell className={`text-center ${parseInt(question.onlyWorstRight.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                            {question.onlyWorstRight.percentage}
                          </TableCell>
                          <TableCell className={`text-center ${parseInt(question.bothWrong.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                            {question.bothWrong.percentage}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow className="bg-blue-200">
                      <TableCell colSpan={2} className="font-bold">{displayName} Total</TableCell>
                      <TableCell className="text-center">{assessmentAnalysis.categories[key].total.bothRight.students}</TableCell>
                      <TableCell className="text-center">{assessmentAnalysis.categories[key].total.onlyBestRight.students}</TableCell>
                      <TableCell className="text-center">{assessmentAnalysis.categories[key].total.onlyWorstRight.students}</TableCell>
                      <TableCell className="text-center">{assessmentAnalysis.categories[key].total.bothWrong.students}</TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-200">
                      <TableCell colSpan={2} className="font-bold">{displayName} %</TableCell>
                      <TableCell className={`text-center ${parseInt(assessmentAnalysis.categories[key].total.bothRight.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                        {assessmentAnalysis.categories[key].total.bothRight.percentage}
                      </TableCell>
                      <TableCell className={`text-center ${parseInt(assessmentAnalysis.categories[key].total.onlyBestRight.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                        {assessmentAnalysis.categories[key].total.onlyBestRight.percentage}
                      </TableCell>
                      <TableCell className={`text-center ${parseInt(assessmentAnalysis.categories[key].total.onlyWorstRight.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                        {assessmentAnalysis.categories[key].total.onlyWorstRight.percentage}
                      </TableCell>
                      <TableCell className={`text-center ${parseInt(assessmentAnalysis.categories[key].total.bothWrong.percentage) > 30 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                        {assessmentAnalysis.categories[key].total.bothWrong.percentage}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Bar Chart for each question in the category */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">{displayName}</h3>
                <div className="space-y-4">
                  {assessmentAnalysis.categories[key].questions.map((question) => (
                    <div key={question.id} className="flex items-center">
                      <div className="w-16 text-right mr-4">{question.id}</div>
                      <div className="flex-1 h-8 flex">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: question.bothRight.percentage }}
                          title={`Both Right: ${question.bothRight.percentage}`}
                        ></div>
                        <div 
                          className="h-full bg-blue-600" 
                          style={{ width: question.onlyBestRight.percentage }}
                          title={`Only Best Right: ${question.onlyBestRight.percentage}`}
                        ></div>
                        <div 
                          className="h-full bg-blue-300" 
                          style={{ width: question.onlyWorstRight.percentage }}
                          title={`Only Worst Right: ${question.onlyWorstRight.percentage}`}
                        ></div>
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: question.bothWrong.percentage }}
                          title={`Both Wrong: ${question.bothWrong.percentage}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 text-sm">
                  <div className="flex items-center mx-2">
                    <div className="w-4 h-4 bg-green-500 mr-1"></div>
                    <span>Both Right</span>
                  </div>
                  <div className="flex items-center mx-2">
                    <div className="w-4 h-4 bg-blue-600 mr-1"></div>
                    <span>Only Best Right</span>
                  </div>
                  <div className="flex items-center mx-2">
                    <div className="w-4 h-4 bg-blue-300 mr-1"></div>
                    <span>Only Worst Right</span>
                  </div>
                  <div className="flex items-center mx-2">
                    <div className="w-4 h-4 bg-red-500 mr-1"></div>
                    <span>Both Wrong</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Answers Grouped by Category Pie Chart */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Answers Grouped by Category</h3>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(categories).flatMap(([displayName, key]) => {
                      const categoryData = preparePieData(key);
                      return categoryData.map(item => ({
                        ...item,
                        category: displayName
                      }));
                    })}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    innerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.entries(categories).flatMap(([displayName, key]) => {
                      const categoryData = preparePieData(key);
                      return categoryData.map((entry, index) => (
                        <Cell key={`cell-${key}-${index}`} fill={entry.color} />
                      ));
                    })}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentAnalysis; 