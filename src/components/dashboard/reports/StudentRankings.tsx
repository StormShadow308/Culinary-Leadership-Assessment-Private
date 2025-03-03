
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentRankingsProps {
  cohort: string;
  timeRange: string;
}

const StudentRankings: React.FC<StudentRankingsProps> = ({ cohort, timeRange }) => {
  // Dummy data for rankings
  const topStudents = [
    { rank: 1, name: "Jane Smith", score: 95.8, assessments: 5 },
    { rank: 2, name: "John Doe", score: 94.2, assessments: 5 },
    { rank: 3, name: "Emily Johnson", score: 93.7, assessments: 5 },
    { rank: 4, name: "Michael Brown", score: 92.5, assessments: 5 },
    { rank: 5, name: "Sarah Wilson", score: 91.9, assessments: 5 },
    { rank: 6, name: "David Martinez", score: 91.3, assessments: 5 },
    { rank: 7, name: "Lisa Anderson", score: 90.8, assessments: 5 },
    { rank: 8, name: "Robert Taylor", score: 90.2, assessments: 5 },
    { rank: 9, name: "Jennifer Lee", score: 89.7, assessments: 5 },
    { rank: 10, name: "James White", score: 89.1, assessments: 5 },
  ];
  
  const bottomStudents = [
    { rank: 265, name: "Kevin Jones", score: 65.5, assessments: 5 },
    { rank: 266, name: "Patricia Harris", score: 64.8, assessments: 5 },
    { rank: 267, name: "Thomas Moore", score: 64.2, assessments: 5 },
    { rank: 268, name: "Deborah Clark", score: 63.7, assessments: 5 },
    { rank: 269, name: "Jason Lewis", score: 62.9, assessments: 5 },
    { rank: 270, name: "Elizabeth Walker", score: 62.1, assessments: 5 },
    { rank: 271, name: "Paul Hall", score: 61.5, assessments: 5 },
    { rank: 272, name: "Nancy Allen", score: 60.8, assessments: 5 },
    { rank: 273, name: "Mark Young", score: 59.6, assessments: 5 },
    { rank: 274, name: "Karen Scott", score: 58.3, assessments: 5 },
  ];
  
  // Category-specific rankings
  const resilienceTop = [
    { rank: 1, name: "Emily Johnson", score: 97.2, assessments: 5 },
    { rank: 2, name: "John Doe", score: 96.5, assessments: 5 },
    { rank: 3, name: "Lisa Anderson", score: 95.8, assessments: 5 },
    { rank: 4, name: "Michael Brown", score: 95.1, assessments: 5 },
    { rank: 5, name: "Sarah Wilson", score: 94.6, assessments: 5 },
    { rank: 6, name: "David Martinez", score: 94.0, assessments: 5 },
    { rank: 7, name: "Robert Taylor", score: 93.5, assessments: 5 },
    { rank: 8, name: "Jane Smith", score: 93.1, assessments: 5 },
    { rank: 9, name: "Jennifer Lee", score: 92.7, assessments: 5 },
    { rank: 10, name: "James White", score: 92.2, assessments: 5 },
  ];
  
  const resilienceBottom = [
    { rank: 265, name: "Kevin Jones", score: 67.8, assessments: 5 },
    { rank: 266, name: "Patricia Harris", score: 67.1, assessments: 5 },
    { rank: 267, name: "Thomas Moore", score: 66.5, assessments: 5 },
    { rank: 268, name: "Deborah Clark", score: 65.9, assessments: 5 },
    { rank: 269, name: "Jason Lewis", score: 65.2, assessments: 5 },
    { rank: 270, name: "Elizabeth Walker", score: 64.6, assessments: 5 },
    { rank: 271, name: "Paul Hall", score: 63.8, assessments: 5 },
    { rank: 272, name: "Nancy Allen", score: 63.0, assessments: 5 },
    { rank: 273, name: "Mark Young", score: 62.2, assessments: 5 },
    { rank: 274, name: "Karen Scott", score: 61.4, assessments: 5 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Score Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Top 10 Scores</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Assessments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student) => (
                      <TableRow key={student.rank}>
                        <TableCell>#{student.rank}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.score}%</TableCell>
                        <TableCell>{student.assessments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Bottom 10 Scores</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Assessments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bottomStudents.map((student) => (
                      <TableRow key={student.rank}>
                        <TableCell>#{student.rank}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.score}%</TableCell>
                        <TableCell>{student.assessments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="resilience" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
          <TabsTrigger value="team">Team Dynamics</TabsTrigger>
          <TabsTrigger value="problem">Problem Solving</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resilience">
          <Card>
            <CardHeader>
              <CardTitle>Resilience & Adaptability Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Top 10 Scores</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Assessments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resilienceTop.map((student) => (
                          <TableRow key={student.rank}>
                            <TableCell>#{student.rank}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.score}%</TableCell>
                            <TableCell>{student.assessments}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Bottom 10 Scores</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Assessments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resilienceBottom.map((student) => (
                          <TableRow key={student.rank}>
                            <TableCell>#{student.rank}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.score}%</TableCell>
                            <TableCell>{student.assessments}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Dynamics & Collaboration Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Similar structure as resilience tab - would be populated with team dynamics data */}
                <div className="text-center py-8">Data for Team Dynamics Rankings</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="problem">
          <Card>
            <CardHeader>
              <CardTitle>Problem Solving Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Similar structure as resilience tab - would be populated with problem solving data */}
                <div className="text-center py-8">Data for Problem Solving Rankings</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Similar structure as resilience tab - would be populated with communication data */}
                <div className="text-center py-8">Data for Communication Rankings</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leadership">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Similar structure as resilience tab - would be populated with leadership data */}
                <div className="text-center py-8">Data for Leadership Rankings</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentRankings;
