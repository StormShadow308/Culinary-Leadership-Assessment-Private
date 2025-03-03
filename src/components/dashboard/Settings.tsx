
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Settings() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Update your organization details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Organization Name" defaultValue="Acme Learning Academy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" placeholder="Admin Email" defaultValue="admin@acmelearning.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="Website" defaultValue="https://acmelearning.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="public-profile" />
                <Label htmlFor="public-profile">Make organization profile public</Label>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cohorts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Management</CardTitle>
              <CardDescription>
                Configure cohort settings and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Active Cohorts</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cohort Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cohort 1 (Spring 2023)</TableCell>
                      <TableCell>Jan 15, 2023</TableCell>
                      <TableCell>Jun 30, 2023</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Active
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cohort 2 (Summer 2023)</TableCell>
                      <TableCell>May 1, 2023</TableCell>
                      <TableCell>Oct 31, 2023</TableCell>
                      <TableCell>28</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Active
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <Button>Add New Cohort</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
