
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, Award } from "lucide-react";

const mockData = [
  { name: "Jan", assessments: 65 },
  { name: "Feb", assessments: 80 },
  { name: "Mar", assessments: 95 },
  { name: "Apr", assessments: 120 },
  { name: "May", assessments: 150 },
  { name: "Jun", assessments: 180 },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">
            Admin Dashboard
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-brand-orange/10">
                  <Users className="h-6 w-6 text-brand-orange" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold">2,543</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-brand-blue/10">
                  <TrendingUp className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-semibold">87%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certifications</p>
                  <p className="text-2xl font-semibold">1,128</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-6 h-[400px] animate-fade-in" style={{ animationDelay: "400ms" }}>
            <h2 className="text-xl font-semibold mb-4">Assessment Completion Trend</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assessments" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
