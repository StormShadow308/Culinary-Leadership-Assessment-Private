
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Users, Target, ChefHat } from "lucide-react";

const mockPieData = [
  { name: "Leadership", value: 35 },
  { name: "Communication", value: 25 },
  { name: "Technical", value: 20 },
  { name: "Management", value: 20 },
];

const COLORS = ["#F97316", "#0EA5E9", "#22C55E", "#EAB308"];

const OrgDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">
            Organization Dashboard
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-brand-orange/10">
                  <Users className="h-6 w-6 text-brand-orange" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-semibold">127</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-brand-blue/10">
                  <Target className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-semibold">82%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <ChefHat className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certified Chefs</p>
                  <p className="text-2xl font-semibold">89</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-6 h-[400px] animate-fade-in" style={{ animationDelay: "400ms" }}>
            <h2 className="text-xl font-semibold mb-4">Skill Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrgDashboard;
