
import React, { useState } from "react";
import OrgSidebar from "@/components/dashboard/OrgSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import AllStudents from "@/components/dashboard/AllStudents";
import StudentReport from "@/components/dashboard/StudentReport";
import ComparisonReport from "@/components/dashboard/ComparisonReport";
import OverallReport from "@/components/dashboard/OverallReport";
import Settings from "@/components/dashboard/Settings";

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <OrgSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "all-students" && <AllStudents />}
        {activeTab === "student-report" && <StudentReport />}
        {activeTab === "comparison-report" && <ComparisonReport />}
        {activeTab === "overall-report" && <OverallReport />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default OrgDashboard;
