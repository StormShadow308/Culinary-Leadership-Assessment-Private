import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, X, Mail, Send } from "lucide-react";
import { mockStudentData } from "./mockData";

interface StudentsTableProps {
  onStudentClick: (studentId: number) => void;
}

const StudentsTable = ({ onStudentClick }: StudentsTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending invitation
    setTimeout(() => {
      setInviteSent(true);
      setTimeout(() => {
        setInviteSent(false);
        setEmail("");
        setIsModalOpen(false);
      }, 2000);
    }, 500);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          All Students
        </h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Invite Student
        </Button>
      </div>

      {/* Invite Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Invite a New Student</h2>
            
            {inviteSent ? (
              <div className="bg-green-100 text-green-700 p-3 md:p-4 rounded-md flex items-center gap-2 mb-4">
                <Send className="h-5 w-5" />
                <span>Invitation sent successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Student Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="student@example.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">
                    An invitation email will be sent to this address with instructions to complete the assessment.
                  </p>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Send Invitation</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Student Assessment Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-xs md:text-sm">Client</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm">Cohort</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm">Name</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm">Stay/Out</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm">Entries Answer</TableHead>
                  
                  <TableHead className="font-semibold bg-orange-100 text-xs md:text-sm" colSpan={6}>
                    Pre-Program
                  </TableHead>
                  
                  <TableHead className="font-semibold bg-blue-100 text-xs md:text-sm" colSpan={6}>
                    Post-Program
                  </TableHead>
                </TableRow>
                
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  
                  <TableHead className="bg-orange-50 text-[10px] md:text-xs whitespace-nowrap">1.Resilience & Adaptability</TableHead>
                  <TableHead className="bg-orange-50 text-[10px] md:text-xs whitespace-nowrap">1.Team Dynamics & Collaboration</TableHead>
                  <TableHead className="bg-orange-50 text-[10px] md:text-xs whitespace-nowrap">1.Decision-Making & Problem-Solving</TableHead>
                  <TableHead className="bg-orange-50 text-[10px] md:text-xs whitespace-nowrap">1.Self-Awareness & Emotional Intelligence</TableHead>
                  <TableHead className="bg-orange-50 text-[10px] md:text-xs whitespace-nowrap">1.Communication & Active Listening</TableHead>
                  <TableHead className="bg-orange-50 text-[10px] md:text-xs whitespace-nowrap">1.Overall Score</TableHead>
                  
                  <TableHead className="bg-blue-50 text-[10px] md:text-xs whitespace-nowrap">2.Resilience & Adaptability</TableHead>
                  <TableHead className="bg-blue-50 text-[10px] md:text-xs whitespace-nowrap">2.Team Dynamics & Collaboration</TableHead>
                  <TableHead className="bg-blue-50 text-[10px] md:text-xs whitespace-nowrap">2.Decision-Making & Problem-Solving</TableHead>
                  <TableHead className="bg-blue-50 text-[10px] md:text-xs whitespace-nowrap">2.Self-Awareness & Emotional Intelligence</TableHead>
                  <TableHead className="bg-blue-50 text-[10px] md:text-xs whitespace-nowrap">2.Communication & Active Listening</TableHead>
                  <TableHead className="bg-blue-50 text-[10px] md:text-xs whitespace-nowrap">2.Overall Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudentData.map((student) => (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onStudentClick(student.id)}
                  >
                    <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4 whitespace-nowrap">{student.client}</TableCell>
                    <TableCell className="text-xs md:text-sm py-2 md:py-4 whitespace-nowrap">{student.cohort}</TableCell>
                    <TableCell className="text-xs md:text-sm py-2 md:py-4 whitespace-nowrap">{student.name}</TableCell>
                    <TableCell className="text-green-600 text-xs md:text-sm py-2 md:py-4 whitespace-nowrap">{student.status}</TableCell>
                    <TableCell className="text-green-600 bg-green-100 text-xs md:text-sm py-2 md:py-4 whitespace-nowrap">{student.entries}</TableCell>
                    
                    <TableCell className="bg-orange-50 text-xs md:text-sm py-2 md:py-4">{student.preAssessment.resilienceAdaptability}</TableCell>
                    <TableCell className="bg-orange-50 text-xs md:text-sm py-2 md:py-4">{student.preAssessment.teamDynamicsCollaboration}</TableCell>
                    <TableCell className="bg-orange-50 text-xs md:text-sm py-2 md:py-4">{student.preAssessment.decisionMakingProblemSolving}</TableCell>
                    <TableCell className="bg-orange-50 text-xs md:text-sm py-2 md:py-4">{student.preAssessment.selfAwarenessEmotionalIntelligence}</TableCell>
                    <TableCell className="bg-orange-50 text-xs md:text-sm py-2 md:py-4">{student.preAssessment.communicationActiveListening}</TableCell>
                    <TableCell className="bg-orange-50 text-xs md:text-sm py-2 md:py-4">{student.preAssessment.overallScore}</TableCell>
                    
                    <TableCell className="bg-blue-50 text-xs md:text-sm py-2 md:py-4">{student.postAssessment.resilienceAdaptability}</TableCell>
                    <TableCell className="bg-blue-50 text-xs md:text-sm py-2 md:py-4">{student.postAssessment.teamDynamicsCollaboration}</TableCell>
                    <TableCell className="bg-blue-50 text-xs md:text-sm py-2 md:py-4">{student.postAssessment.decisionMakingProblemSolving}</TableCell>
                    <TableCell className="bg-blue-50 text-xs md:text-sm py-2 md:py-4">{student.postAssessment.selfAwarenessEmotionalIntelligence}</TableCell>
                    <TableCell className="bg-blue-50 text-xs md:text-sm py-2 md:py-4">{student.postAssessment.communicationActiveListening}</TableCell>
                    <TableCell className="bg-blue-50 text-xs md:text-sm py-2 md:py-4">{student.postAssessment.overallScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsTable; 