
import React, { useState } from "react";
import { OrgSidebar } from "@/components/dashboard/OrgSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AllStudents } from "@/components/dashboard/AllStudents";
import { StudentReport } from "@/components/dashboard/StudentReport";
import { ComparisonReport } from "@/components/dashboard/ComparisonReport";
import { OverallReport } from "@/components/dashboard/overall-report/OverallReport";
import { Settings } from "@/components/dashboard/Settings";

export default function OrgDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="grid h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <OrgSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-col overflow-auto">
        {activeSection === "dashboard" && <DashboardOverview />}
        {activeSection === "all-students" && <AllStudents />}
        {activeSection === "student-report" && <StudentReport />}
        {activeSection === "comparison-report" && <ComparisonReport />}
        {activeSection === "overall-report" && <OverallReport />}
        {activeSection === "settings" && <Settings />}
      </div>
    </div>
  );
}
