
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function StudentRankings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">Student Rankings</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="top">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="top">Top 10</TabsTrigger>
              <TabsTrigger value="bottom">Bottom 10</TabsTrigger>
            </TabsList>
            <TabsContent value="top">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>Student {i + 1}</TableCell>
                      <TableCell>Cohort {Math.floor(Math.random() * 3) + 1}</TableCell>
                      <TableCell>{98 - i}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="bottom">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>{90 - i}</TableCell>
                      <TableCell>Student {90 - i}</TableCell>
                      <TableCell>Cohort {Math.floor(Math.random() * 3) + 1}</TableCell>
                      <TableCell>{65 + i}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resilience and Adaptability</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="top">Top 10</TabsTrigger>
                <TabsTrigger value="bottom">Bottom 10</TabsTrigger>
              </TabsList>
              <TabsContent value="top">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>Student {i + 1}</TableCell>
                        <TableCell>{98 - i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="bottom">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{90 - i}</TableCell>
                        <TableCell>Student {90 - i}</TableCell>
                        <TableCell>{65 + i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Dynamics & Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="top">Top 10</TabsTrigger>
                <TabsTrigger value="bottom">Bottom 10</TabsTrigger>
              </TabsList>
              <TabsContent value="top">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>Student {i + 1}</TableCell>
                        <TableCell>{98 - i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="bottom">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{90 - i}</TableCell>
                        <TableCell>Student {90 - i}</TableCell>
                        <TableCell>{65 + i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Proficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="top">Top 10</TabsTrigger>
                <TabsTrigger value="bottom">Bottom 10</TabsTrigger>
              </TabsList>
              <TabsContent value="top">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>Student {i + 1}</TableCell>
                        <TableCell>{98 - i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="bottom">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{90 - i}</TableCell>
                        <TableCell>Student {90 - i}</TableCell>
                        <TableCell>{65 + i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem-Solving & Critical Thinking</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="top">Top 10</TabsTrigger>
                <TabsTrigger value="bottom">Bottom 10</TabsTrigger>
              </TabsList>
              <TabsContent value="top">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>Student {i + 1}</TableCell>
                        <TableCell>{98 - i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="bottom">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{90 - i}</TableCell>
                        <TableCell>Student {90 - i}</TableCell>
                        <TableCell>{65 + i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="top">Top 10</TabsTrigger>
                <TabsTrigger value="bottom">Bottom 10</TabsTrigger>
              </TabsList>
              <TabsContent value="top">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>Student {i + 1}</TableCell>
                        <TableCell>{98 - i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="bottom">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{90 - i}</TableCell>
                        <TableCell>Student {90 - i}</TableCell>
                        <TableCell>{65 + i}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
