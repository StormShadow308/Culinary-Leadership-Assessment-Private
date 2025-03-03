
import React from 'react'
import { Card, CardContent } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

// Sample data for demonstration
const generateSampleData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    no: i + 1,
    student: `Student ${i + 1}`,
    score: Math.floor(Math.random() * 100),
    scorePercentage: `${Math.floor(Math.random() * 100)}%`,
  }))
}

const OverallScoreTable = () => {
  const students = generateSampleData(15)
  
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Students Rankings</h2>
      <Card>
        <CardContent className="p-0">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="border-r w-16 text-center">No.</TableHead>
                <TableHead className="border-r">Student</TableHead>
                <TableHead colSpan={2} className="bg-white text-center">
                  <div className="text-center text-black font-bold text-lg py-2">Overall Score</div>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="border-r"></TableHead>
                <TableHead className="border-r"></TableHead>
                <TableHead className="border-r text-center w-24">Score</TableHead>
                <TableHead className="text-center w-24">Score in %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.no} className="border-b">
                  <TableCell className="border-r text-center">{student.no}</TableCell>
                  <TableCell className="border-r">{student.student}</TableCell>
                  <TableCell className="border-r text-center">{student.score}</TableCell>
                  <TableCell className="text-center">{student.scorePercentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-4 flex items-center">
        <div className="w-full pr-6">
          <div className="flex h-10 items-center">
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="w-full flex justify-between px-2 -mt-4 text-xs text-gray-500">
                <span>0%</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CategoryRankingTable = ({ title }: { title: string }) => {
  const topStudents = generateSampleData(10)
  const bottomStudents = generateSampleData(10)
  
  return (
    <div className="mt-10">
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-1/2 border-r">
              <Table className="border-collapse">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead colSpan={4} className="bg-white text-center">
                      <div className="flex justify-between items-center px-4 py-2">
                        <span className="text-orange-500 font-bold">Top 10 Score</span>
                        <span className="text-black font-bold text-lg">{title}</span>
                      </div>
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="border-r w-12 text-center">No</TableHead>
                    <TableHead className="border-r">Student</TableHead>
                    <TableHead className="border-r text-center w-16">Score</TableHead>
                    <TableHead className="text-center w-24">Score in %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topStudents.map((student) => (
                    <TableRow key={student.no} className="border-b">
                      <TableCell className="border-r text-center">{student.no}</TableCell>
                      <TableCell className="border-r">{student.student}</TableCell>
                      <TableCell className="border-r text-center">{student.score}</TableCell>
                      <TableCell className="text-center bg-green-300">0%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="w-1/2">
              <Table className="border-collapse">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead colSpan={4} className="bg-white text-center">
                      <div className="flex justify-end py-2 pr-4">
                        <span className="text-orange-500 font-bold">Bottom 10 Score</span>
                      </div>
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="border-r w-12 text-center">No</TableHead>
                    <TableHead className="border-r">Student</TableHead>
                    <TableHead className="border-r text-center w-16">Score</TableHead>
                    <TableHead className="text-center w-24">Score in %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bottomStudents.map((student) => (
                    <TableRow key={student.no} className="border-b">
                      <TableCell className="border-r text-center">{student.no}</TableCell>
                      <TableCell className="border-r">{student.student}</TableCell>
                      <TableCell className="border-r text-center">{student.score}</TableCell>
                      <TableCell className="text-center bg-green-300">0%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const StudentRankings = () => {
  return (
    <div className="w-full">
      <OverallScoreTable />
      
      <CategoryRankingTable title="Resilience and Adaptability" />
      <CategoryRankingTable title="Team Dynamics & Collaboration" />
      <CategoryRankingTable title="Decision-Making & Problem-Solving" />
      <CategoryRankingTable title="Self-Awareness & Emotional Intelligence" />
      <CategoryRankingTable title="Communication & Active Listening" />
    </div>
  )
}

export default StudentRankings
