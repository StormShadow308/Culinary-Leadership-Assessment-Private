
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import OrgSidebar from '@/components/OrgSidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import AllStudents from '@/components/students/AllStudents';
import StudentReport from '@/components/reports/StudentReport';
import ComparisonReport from '@/components/reports/ComparisonReport';
import OverallReport from '@/components/reports/OverallReport';
import Settings from '@/components/settings/Settings';

const OrgDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex">
      <OrgSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleBack={handleBack} 
      />
      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "students" && <AllStudents />}
        {activeTab === "student-report" && <StudentReport />}
        {activeTab === "comparison-report" && <ComparisonReport />}
        {activeTab === "overall-report" && <OverallReport />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default OrgDashboard;
