
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrgSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function OrgSidebar({ activeSection, setActiveSection }: OrgSidebarProps) {
  return (
    <div className="h-full border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="ml-2 text-lg font-semibold">Organization Dashboard</span>
        </div>
      </div>
      <div className="px-3 py-2">
        <Tabs value="nav" className="border-none">
          <TabsList className="flex h-auto flex-col items-start justify-start bg-transparent p-0">
            <TabsTrigger
              value="dashboard"
              className={cn(
                "w-full justify-start px-2",
                activeSection === "dashboard" ? "bg-muted font-medium" : "bg-transparent font-normal"
              )}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="all-students"
              className={cn(
                "w-full justify-start px-2",
                activeSection === "all-students" ? "bg-muted font-medium" : "bg-transparent font-normal"
              )}
              onClick={() => setActiveSection("all-students")}
            >
              All Students
            </TabsTrigger>
            <TabsTrigger
              value="student-report"
              className={cn(
                "w-full justify-start px-2",
                activeSection === "student-report" ? "bg-muted font-medium" : "bg-transparent font-normal"
              )}
              onClick={() => setActiveSection("student-report")}
            >
              Student Report
            </TabsTrigger>
            <TabsTrigger
              value="comparison-report"
              className={cn(
                "w-full justify-start px-2",
                activeSection === "comparison-report" ? "bg-muted font-medium" : "bg-transparent font-normal"
              )}
              onClick={() => setActiveSection("comparison-report")}
            >
              Comparison Report
            </TabsTrigger>
            <TabsTrigger
              value="overall-report"
              className={cn(
                "w-full justify-start px-2",
                activeSection === "overall-report" ? "bg-muted font-medium" : "bg-transparent font-normal"
              )}
              onClick={() => setActiveSection("overall-report")}
            >
              Overall Report
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={cn(
                "w-full justify-start px-2",
                activeSection === "settings" ? "bg-muted font-medium" : "bg-transparent font-normal"
              )}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
