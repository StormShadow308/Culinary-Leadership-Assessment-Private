import { useState } from "react";
import Navigation from "@/components/Navigation";
import OrganizationSelector from "@/components/admin-dashboard/OrganizationSelector";
import AdminDashboardOverview from "@/components/admin-dashboard/AdminDashboardOverview";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import Dashboard from "@/components/org-dashboard/Dashboard";
import StudentsTable from "@/components/org-dashboard/StudentsTable";
import StudentReport from "@/components/org-dashboard/StudentReport";
import ComparisonReportNew from "@/components/org-dashboard/ComparisonReportNew";
import OverallReport from "@/components/org-dashboard/OverallReport";
import Settings from "@/components/org-dashboard/Settings";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  // State for organization selection
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  
  // State for dashboard navigation
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle organization selection
  const handleSelectOrganization = (orgId: number) => {
    setSelectedOrgId(orgId);
    setActiveTab("dashboard");
    setSelectedStudent(null);
  };

  // Handle back to organization list
  const handleBackToOrgList = () => {
    setSelectedOrgId(null);
    setActiveTab("dashboard");
    setSelectedStudent(null);
  };

  // Handle student selection
  const handleStudentClick = (studentId: number) => {
    setSelectedStudent(studentId);
  };

  // Handle back to student list
  const handleBackToStudentList = () => {
    setSelectedStudent(null);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {selectedOrgId === null ? (
        // Admin Dashboard Overview with Organization Selection
        <main className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto space-y-8">
            <AdminDashboardOverview />
            <OrganizationSelector onSelectOrganization={handleSelectOrganization} />
          </div>
        </main>
      ) : (
        // Organization-specific Dashboard (similar to OrgDashboard)
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

          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setSelectedStudent={setSelectedStudent}
            selectedOrgId={selectedOrgId}
            onBackToOrgList={handleBackToOrgList}
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
      )}
    </div>
  );
};

export default AdminDashboard;
