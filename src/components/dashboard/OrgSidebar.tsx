
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, BarChart, BookOpen, Home, Settings, Users } from "lucide-react";

interface OrgSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const OrgSidebar: React.FC<OrgSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  return (
    <div
      className={cn(
        "h-full bg-secondary/30 border-r transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ArrowLeft
            className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>
      <div className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Button>
          <Button
            variant={activeTab === "all-students" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveTab("all-students")}
          >
            <Users className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && <span>All Students</span>}
          </Button>
          <Button
            variant={activeTab === "student-report" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveTab("student-report")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && <span>Student Report</span>}
          </Button>
          <Button
            variant={activeTab === "comparison-report" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveTab("comparison-report")}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && <span>Comparison Report</span>}
          </Button>
          <Button
            variant={activeTab === "overall-report" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveTab("overall-report")}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && <span>Overall Report</span>}
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              sidebarCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default OrgSidebar;
