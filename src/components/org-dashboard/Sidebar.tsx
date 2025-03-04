import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  BarChart2, 
  FileBarChart, 
  UserCog,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedStudent: (studentId: number | null) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  setSelectedStudent,
  isMobileOpen = false,
  onMobileClose
}: SidebarProps) => {
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onMobileClose) {
      onMobileClose();
    }
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "bg-white shadow-md h-[calc(100vh-64px)] fixed z-50 transition-all duration-300 ease-in-out",
        "w-64 md:w-64",
        isMobileOpen ? "left-0" : "-left-64 md:left-0"
      )}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Organization</h2>
          {isMobileOpen && (
            <button 
              onClick={onMobileClose}
              className="md:hidden text-gray-500 hover:text-gray-700"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleTabClick("dashboard")}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-left",
                    activeTab === "dashboard" 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick("students")}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-left",
                    activeTab === "students" 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  All Students
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleTabClick("student-report");
                    setSelectedStudent(null);
                  }}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-left",
                    activeTab === "student-report" 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Student Report
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick("comparison-report")}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-left",
                    activeTab === "comparison-report" 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Comparison Report
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick("overall-report")}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-left",
                    activeTab === "overall-report" 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <FileBarChart className="h-5 w-5 mr-2" />
                  Overall Report - Pre Only
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick("settings")}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-left",
                    activeTab === "settings" 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <UserCog className="h-5 w-5 mr-2" />
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 