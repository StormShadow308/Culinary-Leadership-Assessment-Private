import { useState } from "react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/org-dashboard/Sidebar";
import Dashboard from "@/components/org-dashboard/Dashboard";
import StudentsTable from "@/components/org-dashboard/StudentsTable";
import StudentReport from "@/components/org-dashboard/StudentReport";
import ComparisonReportNew from "@/components/org-dashboard/ComparisonReportNew";
import OverallReport from "@/components/org-dashboard/OverallReport";
import Settings from "@/components/org-dashboard/Settings";
import { Menu } from "lucide-react";

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleStudentClick = (studentId: number) => {
    setSelectedStudent(studentId);
  };

  const handleBackToStudentList = () => {
    setSelectedStudent(null);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex flex-col md:flex-row pt-16">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4 flex items-center">
          <button 
            onClick={toggleMobileSidebar}
            className="p-2 rounded-md bg-white shadow text-gray-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-3 text-xl font-semibold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "students" && "All Students"}
            {activeTab === "student-report" && "Student Report"}
            {activeTab === "comparison-report" && "Comparison Report"}
            {activeTab === "overall-report" && "Overall Report - Pre Only"}
            {activeTab === "settings" && "Settings"}
          </h1>
        </div>

        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setSelectedStudent={setSelectedStudent}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="w-full md:ml-64 p-4 pt-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && <Dashboard />}

            {activeTab === "students" && (
              <StudentsTable onStudentClick={handleStudentClick} />
            )}

            {activeTab === "student-report" && (
              <StudentReport 
                selectedStudent={selectedStudent} 
                onBackToStudentList={handleBackToStudentList} 
                onStudentSelect={handleStudentClick}
              />
            )}

            {activeTab === "comparison-report" && <ComparisonReportNew />}

            {activeTab === "overall-report" && <OverallReport />}

            {activeTab === "settings" && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;
