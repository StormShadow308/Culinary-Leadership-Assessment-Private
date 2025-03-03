
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StudentRankings = () => {
  // Sample data for demonstration
  const topPerformers = [
    { id: 1, name: "John Smith", score: 98 },
    { id: 2, name: "Maria Garcia", score: 96 },
    { id: 3, name: "David Lee", score: 95 },
    { id: 4, name: "Sarah Johnson", score: 94 },
    { id: 5, name: "Michael Brown", score: 93 },
    { id: 6, name: "Jennifer Davis", score: 92 },
    { id: 7, name: "Robert Wilson", score: 91 },
    { id: 8, name: "Lisa Martinez", score: 90 },
    { id: 9, name: "James Taylor", score: 89 },
    { id: 10, name: "Michelle Anderson", score: 88 },
  ];

  const bottomPerformers = [
    { id: 91, name: "Daniel White", score: 65 },
    { id: 92, name: "Amanda Thomas", score: 63 },
    { id: 93, name: "Kevin Harris", score: 61 },
    { id: 94, name: "Ashley Clark", score: 59 },
    { id: 95, name: "Brian Lewis", score: 57 },
    { id: 96, name: "Jessica Wright", score: 55 },
    { id: 97, name: "Mark Allen", score: 53 },
    { id: 98, name: "Emily King", score: 50 },
    { id: 99, name: "Christopher Scott", score: 48 },
    { id: 100, name: "Karen Green", score: 45 },
  ];

  const categoryData = [
    {
      title: "Resilience and Adaptability",
      top: topPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
      bottom: bottomPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
    },
    {
      title: "Team Dynamics & Collaboration",
      top: topPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
      bottom: bottomPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
    },
    {
      title: "Organization & Time Management",
      top: topPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
      bottom: bottomPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
    },
    {
      title: "Critical Thinking & Problem Solving",
      top: topPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
      bottom: bottomPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
    },
    {
      title: "Communication & Emotional Intelligence",
      top: topPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
      bottom: bottomPerformers.map((p) => ({ ...p, score: p.score - Math.floor(Math.random() * 5) })),
    },
  ];

  // Render ScoreTable component
  const ScoreTable = ({ data, title }) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell className="text-right">{student.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overall Score Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <ScoreTable data={topPerformers} title="Top 10 Overall Scores" />
        <ScoreTable data={bottomPerformers} title="Bottom 10 Overall Scores" />
      </div>

      {/* Category Score Sections */}
      {categoryData.map((category, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-lg font-medium">{category.title}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <ScoreTable data={category.top} title="Top 10 Scores" />
            <ScoreTable data={category.bottom} title="Bottom 10 Scores" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentRankings;
