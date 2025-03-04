// Mock data for organizations
export interface Organization {
  id: number;
  name: string;
  type: string;
  location: string;
  studentsCount: number;
  completionRate: number;
  lastActive: string;
}

export const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Culinary Institute of America",
    type: "Educational Institution",
    location: "New York, NY",
    studentsCount: 450,
    completionRate: 92,
    lastActive: "2023-10-15"
  },
  {
    id: 2,
    name: "Le Cordon Bleu",
    type: "Culinary School",
    location: "Paris, France",
    studentsCount: 380,
    completionRate: 88,
    lastActive: "2023-10-12"
  },
  {
    id: 3,
    name: "Johnson & Wales University",
    type: "University",
    location: "Providence, RI",
    studentsCount: 520,
    completionRate: 85,
    lastActive: "2023-10-10"
  },
  {
    id: 4,
    name: "Institute of Culinary Education",
    type: "Culinary School",
    location: "New York, NY",
    studentsCount: 310,
    completionRate: 90,
    lastActive: "2023-10-14"
  },
  {
    id: 5,
    name: "Auguste Escoffier School of Culinary Arts",
    type: "Culinary School",
    location: "Austin, TX",
    studentsCount: 280,
    completionRate: 87,
    lastActive: "2023-10-08"
  },
  {
    id: 6,
    name: "International Culinary Center",
    type: "Culinary School",
    location: "New York, NY",
    studentsCount: 340,
    completionRate: 91,
    lastActive: "2023-10-13"
  },
  {
    id: 7,
    name: "The Culinary Institute of Barcelona",
    type: "Culinary School",
    location: "Barcelona, Spain",
    studentsCount: 290,
    completionRate: 89,
    lastActive: "2023-10-09"
  },
  {
    id: 8,
    name: "Sullivan University",
    type: "University",
    location: "Louisville, KY",
    studentsCount: 420,
    completionRate: 83,
    lastActive: "2023-10-07"
  },
  {
    id: 9,
    name: "The Culinary Institute of New York",
    type: "Culinary School",
    location: "New York, NY",
    studentsCount: 260,
    completionRate: 86,
    lastActive: "2023-10-11"
  },
  {
    id: 10,
    name: "The Art Institute of Washington",
    type: "Art School",
    location: "Arlington, VA",
    studentsCount: 230,
    completionRate: 82,
    lastActive: "2023-10-06"
  }
];

// Admin dashboard statistics
export const adminStats = {
  totalOrganizations: mockOrganizations.length,
  totalStudents: mockOrganizations.reduce((sum, org) => sum + org.studentsCount, 0),
  averageCompletionRate: Math.round(
    mockOrganizations.reduce((sum, org) => sum + org.completionRate, 0) / mockOrganizations.length
  ),
  assessmentsCompleted: 2843,
  monthlyTrend: [
    { month: "Jan", assessments: 180 },
    { month: "Feb", assessments: 220 },
    { month: "Mar", assessments: 260 },
    { month: "Apr", assessments: 310 },
    { month: "May", assessments: 350 },
    { month: "Jun", assessments: 420 },
    { month: "Jul", assessments: 380 },
    { month: "Aug", assessments: 340 },
    { month: "Sep", assessments: 390 },
    { month: "Oct", assessments: 430 },
  ]
}; 