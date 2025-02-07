
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Award, Download, Mail } from "lucide-react";

const mockSkillData = [
  { subject: "Leadership", A: 120, fullMark: 150 },
  { subject: "Communication", A: 98, fullMark: 150 },
  { subject: "Technical Skills", A: 86, fullMark: 150 },
  { subject: "Problem Solving", A: 99, fullMark: 150 },
  { subject: "Team Management", A: 85, fullMark: 150 },
  { subject: "Innovation", A: 65, fullMark: 150 },
];

const ParticipantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">
              Your Assessment Results
            </h1>
            <div className="flex gap-4">
              <button className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Email Results
              </button>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="p-6 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
                <p className="text-4xl font-bold text-brand-orange">87/100</p>
              </div>
              <Award className="h-16 w-16 text-brand-orange" />
            </div>
          </Card>

          {/* Skills Radar Chart */}
          <Card className="p-6 h-[500px] animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-semibold mb-4">Skills Analysis</h2>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockSkillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#F97316"
                  fill="#F97316"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParticipantDashboard;
