
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="org" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Manage your organization details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Learn AI Organization" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-email">Contact Email</Label>
                <Input id="org-email" defaultValue="admin@learnai.org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-website">Website</Label>
                <Input id="org-website" defaultValue="https://learnai.org" />
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preferences</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about student progress
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your organization visible to potential students
                    </p>
                  </div>
                  <Switch id="public-profile" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>
                Manage users and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Sarah Johnson</TableCell>
                        <TableCell>sarah@learnai.org</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>Today</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">David Williams</TableCell>
                        <TableCell>david@learnai.org</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Yesterday</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Lisa Chen</TableCell>
                        <TableCell>lisa@learnai.org</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>3 days ago</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Button className="mt-4">Add User</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with other platforms and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Slack</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your Slack workspace
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M17.5 19H9a7 7 0 1 1 0-14h8.5a4.5 4.5 0 1 1 0 9H9a2 2 0 1 1 0-4h8.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Google Classroom</h3>
                    <p className="text-sm text-muted-foreground">
                      Import students from Google Classroom
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Stripe</h3>
                    <p className="text-sm text-muted-foreground">
                      Process payments via Stripe
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connected</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing details and subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Educational Pro</h3>
                    <p className="text-sm text-muted-foreground">
                      $499 / month
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next billing date</span>
                    <span>April 1, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment method</span>
                    <span>Visa ending in 4242</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">Update Payment Method</Button>
                <Button variant="outline">View Invoices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Import needed for Settings component to work
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default Settings;
