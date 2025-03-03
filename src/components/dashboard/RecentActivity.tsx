
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentActivity: React.FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest student achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe completed Module 3</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
            <Badge>94%</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Jane Smith completed Final Project</p>
              <p className="text-xs text-muted-foreground">3 hours ago</p>
            </div>
            <Badge>98%</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Cohort B started new curriculum</p>
              <p className="text-xs text-muted-foreground">Yesterday</p>
            </div>
            <Badge variant="outline">New</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Alex Johnson joined Cohort C</p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
            <Badge variant="outline">New</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
