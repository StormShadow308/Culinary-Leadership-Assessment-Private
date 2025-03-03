
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Student assessment submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="font-semibold text-primary">JS</span>
            </div>
            <div>
              <p className="font-medium">John Smith completed Leadership Assessment</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <div className="ml-auto">
              <span className="font-medium">Score: 87%</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="font-semibold text-primary">AD</span>
            </div>
            <div>
              <p className="font-medium">Alice Dunn completed Team Dynamics Assessment</p>
              <p className="text-sm text-muted-foreground">5 hours ago</p>
            </div>
            <div className="ml-auto">
              <span className="font-medium">Score: 92%</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="font-semibold text-primary">RJ</span>
            </div>
            <div>
              <p className="font-medium">Robert Johnson completed Problem Solving Assessment</p>
              <p className="text-sm text-muted-foreground">Yesterday</p>
            </div>
            <div className="ml-auto">
              <span className="font-medium">Score: 78%</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="font-semibold text-primary">EW</span>
            </div>
            <div>
              <p className="font-medium">Emma White completed Communication Assessment</p>
              <p className="text-sm text-muted-foreground">Yesterday</p>
            </div>
            <div className="ml-auto">
              <span className="font-medium">Score: 85%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
