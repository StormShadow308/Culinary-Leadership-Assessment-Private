
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart, Filter, Settings, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrgSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleBack: () => void;
}

const OrgSidebar: React.FC<OrgSidebarProps> = ({ activeTab, setActiveTab, handleBack }) => {
  return (
    <div className="w-56 border-r bg-background flex flex-col">
      <div className="p-4">
        <Button onClick={handleBack} variant="ghost" className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h2 className="text-lg font-bold mb-4">Learn AI Organization</h2>
        <div className="space-y-1">
          <Button
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab("students")}
            variant={activeTab === "students" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Users className="mr-2 h-4 w-4" />
            All Students
          </Button>
          <Button
            onClick={() => setActiveTab("student-report")}
            variant={activeTab === "student-report" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Filter className="mr-2 h-4 w-4" />
            Student Report
          </Button>
          <Button
            onClick={() => setActiveTab("comparison-report")}
            variant={activeTab === "comparison-report" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Comparison Report
          </Button>
          <Button
            onClick={() => setActiveTab("overall-report")}
            variant={activeTab === "overall-report" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Overall Report
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-auto p-4">
        <Button
          onClick={() => setActiveTab("settings")}
          variant={activeTab === "settings" ? "default" : "ghost"}
          className="w-full justify-start"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default OrgSidebar;
