// Mock data for the organization dashboard

export const mockPieData = [
  { name: "Leadership", value: 35 },
  { name: "Communication", value: 25 },
  { name: "Technical", value: 20 },
  { name: "Management", value: 20 },
];

export const COLORS = ["#F97316", "#0EA5E9", "#22C55E", "#EAB308"];

export const mockStudentData = [
  { 
    id: 1,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "Spring 2023",
    name: "John Smith",
    status: "Stay",
    entries: "Yes",
    preAssessment: {
      resilienceAdaptability: 4,
      teamDynamicsCollaboration: 5,
      decisionMakingProblemSolving: 3,
      selfAwarenessEmotionalIntelligence: 4,
      communicationActiveListening: 5,
      overallScore: 21
    },
    postAssessment: {
      resilienceAdaptability: 7,
      teamDynamicsCollaboration: 7,
      decisionMakingProblemSolving: 6,
      selfAwarenessEmotionalIntelligence: 6,
      communicationActiveListening: 8,
      overallScore: 34
    }
  },
  { 
    id: 2,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "Spring 2023",
    name: "Jane Doe",
    status: "Stay",
    entries: "Yes",
    preAssessment: {
      resilienceAdaptability: 3,
      teamDynamicsCollaboration: 4,
      decisionMakingProblemSolving: 2,
      selfAwarenessEmotionalIntelligence: 3,
      communicationActiveListening: 4,
      overallScore: 16
    },
    postAssessment: {
      resilienceAdaptability: 6,
      teamDynamicsCollaboration: 6,
      decisionMakingProblemSolving: 5,
      selfAwarenessEmotionalIntelligence: 5,
      communicationActiveListening: 7,
      overallScore: 29
    }
  },
  { 
    id: 3,
    client: "Edwins Leadership and Restaurant Institute",
    cohort: "Fall 2022",
    name: "Michael Johnson",
    status: "Out",
    entries: "No",
    preAssessment: {
      resilienceAdaptability: 5,
      teamDynamicsCollaboration: 6,
      decisionMakingProblemSolving: 4,
      selfAwarenessEmotionalIntelligence: 5,
      communicationActiveListening: 6,
      overallScore: 26
    },
    postAssessment: {
      resilienceAdaptability: 8,
      teamDynamicsCollaboration: 8,
      decisionMakingProblemSolving: 7,
      selfAwarenessEmotionalIntelligence: 7,
      communicationActiveListening: 8,
      overallScore: 38
    }
  }
];

export const mockCohortScoringCurveData = [
  { score: "0-10", classA: 2, classB: 1 },
  { score: "11-20", classA: 5, classB: 3 },
  { score: "21-30", classA: 10, classB: 8 },
  { score: "31-40", classA: 8, classB: 12 },
];

export const mockOverallReportData = {
  cohortScoring: {
    categoryScores: [
      { category: "Resilience & Adaptability", score: 0.0 },
      { category: "Team Dynamics & Collaboration", score: 0.0 },
      { category: "Decision-Making & Problem-Solving", score: 0.0 },
      { category: "Self-Awareness & Emotional Intelligence", score: 0.0 },
      { category: "Communication & Active Listening", score: 0.0 },
    ],
    proficiencyDistribution: [
      { name: "Needs Development", value: 38, color: "#EF4444" },
      { name: "Developing Proficiency", value: 0, color: "#F59E0B" },
      { name: "Moderate Proficiency", value: 0, color: "#10B981" },
      { name: "High Proficiency", value: 0, color: "#3B82F6" },
      { name: "Exceptional Proficiency", value: 0, color: "#8B5CF6" },
    ],
    cohortScoringCurve: Array.from({ length: 40 }, () => 0),
    proficiencyLevels: [
      { level: "(36 - 40) Exceptional Proficiency", students: 0, percentage: "0%" },
      { level: "(30 - 35) High Proficiency", students: 0, percentage: "0%" },
      { level: "(20 - 29) Moderate Proficiency", students: 0, percentage: "0%" },
      { level: "(10 - 19) Developing Proficiency", students: 0, percentage: "0%" },
      { level: "(0 - 9) Needs Development", students: 38, percentage: "100%" }
    ],
    totalStudents: 38,
    averageOverallScore: "0.0 / 8",
    highestCategory: "N/A",
    lowestCategory: "N/A",
    categoryBreakdown: {
      resilienceAdaptability: [
        { level: "Exceptional Proficiency", students: 0, percentage: "0%" },
        { level: "High Proficiency", students: 0, percentage: "0%" },
        { level: "Moderate Proficiency", students: 0, percentage: "0%" },
        { level: "Developing Proficiency", students: 0, percentage: "0%" },
        { level: "Needs Development", students: 38, percentage: "100%" }
      ],
      teamDynamics: [
        { level: "Exceptional Proficiency", students: 0, percentage: "0%" },
        { level: "High Proficiency", students: 0, percentage: "0%" },
        { level: "Moderate Proficiency", students: 0, percentage: "0%" },
        { level: "Developing Proficiency", students: 0, percentage: "0%" },
        { level: "Needs Development", students: 38, percentage: "100%" }
      ],
      decisionMaking: [
        { level: "Exceptional Proficiency", students: 0, percentage: "0%" },
        { level: "High Proficiency", students: 0, percentage: "0%" },
        { level: "Moderate Proficiency", students: 0, percentage: "0%" },
        { level: "Developing Proficiency", students: 0, percentage: "0%" },
        { level: "Needs Development", students: 38, percentage: "100%" }
      ],
      selfAwareness: [
        { level: "Exceptional Proficiency", students: 0, percentage: "0%" },
        { level: "High Proficiency", students: 0, percentage: "0%" },
        { level: "Moderate Proficiency", students: 0, percentage: "0%" },
        { level: "Developing Proficiency", students: 0, percentage: "0%" },
        { level: "Needs Development", students: 38, percentage: "100%" }
      ],
      communication: [
        { level: "Exceptional Proficiency", students: 0, percentage: "0%" },
        { level: "High Proficiency", students: 0, percentage: "0%" },
        { level: "Moderate Proficiency", students: 0, percentage: "0%" },
        { level: "Developing Proficiency", students: 0, percentage: "0%" },
        { level: "Needs Development", students: 38, percentage: "100%" }
      ]
    }
  },
  studentRankings: {
    overall: Array.from({ length: 20 }, (_, i) => ({
      no: i + 1,
      student: `Student ${i + 1}`,
      score: 0,
      scorePercentage: "0%"
    })),
    categories: {
      resilienceAdaptability: {
        top10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 1}`,
          score: 0,
          scorePercentage: "0%"
        })),
        bottom10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 28 + 1}`, // Starting from the end
          score: 0,
          scorePercentage: "0%"
        }))
      },
      teamDynamics: {
        top10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 1}`,
          score: 0,
          scorePercentage: "0%"
        })),
        bottom10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 28 + 1}`,
          score: 0,
          scorePercentage: "0%"
        }))
      },
      decisionMaking: {
        top10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 1}`,
          score: 0,
          scorePercentage: "0%"
        })),
        bottom10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 28 + 1}`,
          score: 0,
          scorePercentage: "0%"
        }))
      },
      selfAwareness: {
        top10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 1}`,
          score: 0,
          scorePercentage: "0%"
        })),
        bottom10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 28 + 1}`,
          score: 0,
          scorePercentage: "0%"
        }))
      },
      communication: {
        top10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 1}`,
          score: 0,
          scorePercentage: "0%"
        })),
        bottom10: Array.from({ length: 10 }, (_, i) => ({
          no: i + 1,
          student: `Student ${i + 28 + 1}`,
          score: 0,
          scorePercentage: "0%"
        }))
      }
    }
  },
  assessmentAnalysis: {
    categories: {
      resilienceAdaptability: {
        questions: [
          {
            id: "Q1",
            bothRight: { students: 8, percentage: "21%" },
            onlyBestRight: { students: 6, percentage: "16%" },
            onlyWorstRight: { students: 15, percentage: "39%" },
            bothWrong: { students: 9, percentage: "24%" }
          },
          {
            id: "Q6",
            bothRight: { students: 4, percentage: "11%" },
            onlyBestRight: { students: 12, percentage: "32%" },
            onlyWorstRight: { students: 2, percentage: "5%" },
            bothWrong: { students: 20, percentage: "53%" }
          },
          {
            id: "Q11",
            bothRight: { students: 9, percentage: "24%" },
            onlyBestRight: { students: 1, percentage: "3%" },
            onlyWorstRight: { students: 18, percentage: "47%" },
            bothWrong: { students: 10, percentage: "26%" }
          },
          {
            id: "Q16",
            bothRight: { students: 13, percentage: "34%" },
            onlyBestRight: { students: 15, percentage: "39%" },
            onlyWorstRight: { students: 4, percentage: "11%" },
            bothWrong: { students: 6, percentage: "16%" }
          }
        ],
        total: {
          bothRight: { students: 34, percentage: "22%" },
          onlyBestRight: { students: 34, percentage: "22%" },
          onlyWorstRight: { students: 39, percentage: "26%" },
          bothWrong: { students: 45, percentage: "30%" }
        }
      },
      teamDynamics: {
        questions: [
          {
            id: "Q2",
            bothRight: { students: 24, percentage: "63%" },
            onlyBestRight: { students: 4, percentage: "11%" },
            onlyWorstRight: { students: 9, percentage: "24%" },
            bothWrong: { students: 1, percentage: "3%" }
          },
          {
            id: "Q7",
            bothRight: { students: 0, percentage: "0%" },
            onlyBestRight: { students: 25, percentage: "66%" },
            onlyWorstRight: { students: 0, percentage: "0%" },
            bothWrong: { students: 13, percentage: "34%" }
          },
          {
            id: "Q12",
            bothRight: { students: 0, percentage: "0%" },
            onlyBestRight: { students: 0, percentage: "0%" },
            onlyWorstRight: { students: 0, percentage: "0%" },
            bothWrong: { students: 38, percentage: "100%" }
          },
          {
            id: "Q17",
            bothRight: { students: 20, percentage: "53%" },
            onlyBestRight: { students: 1, percentage: "3%" },
            onlyWorstRight: { students: 16, percentage: "42%" },
            bothWrong: { students: 1, percentage: "3%" }
          }
        ],
        total: {
          bothRight: { students: 44, percentage: "29%" },
          onlyBestRight: { students: 30, percentage: "20%" },
          onlyWorstRight: { students: 25, percentage: "16%" },
          bothWrong: { students: 53, percentage: "35%" }
        }
      },
      decisionMaking: {
        questions: [
          {
            id: "Q3",
            bothRight: { students: 15, percentage: "39%" },
            onlyBestRight: { students: 1, percentage: "3%" },
            onlyWorstRight: { students: 19, percentage: "50%" },
            bothWrong: { students: 3, percentage: "8%" }
          },
          {
            id: "Q8",
            bothRight: { students: 5, percentage: "13%" },
            onlyBestRight: { students: 10, percentage: "26%" },
            onlyWorstRight: { students: 11, percentage: "29%" },
            bothWrong: { students: 12, percentage: "32%" }
          },
          {
            id: "Q13",
            bothRight: { students: 0, percentage: "0%" },
            onlyBestRight: { students: 17, percentage: "45%" },
            onlyWorstRight: { students: 0, percentage: "0%" },
            bothWrong: { students: 21, percentage: "55%" }
          },
          {
            id: "Q18",
            bothRight: { students: 16, percentage: "42%" },
            onlyBestRight: { students: 6, percentage: "16%" },
            onlyWorstRight: { students: 13, percentage: "34%" },
            bothWrong: { students: 3, percentage: "8%" }
          }
        ],
        total: {
          bothRight: { students: 36, percentage: "24%" },
          onlyBestRight: { students: 34, percentage: "22%" },
          onlyWorstRight: { students: 43, percentage: "28%" },
          bothWrong: { students: 39, percentage: "26%" }
        }
      },
      selfAwareness: {
        questions: [
          {
            id: "Q4",
            bothRight: { students: 17, percentage: "45%" },
            onlyBestRight: { students: 18, percentage: "47%" },
            onlyWorstRight: { students: 1, percentage: "3%" },
            bothWrong: { students: 2, percentage: "5%" }
          },
          {
            id: "Q9",
            bothRight: { students: 1, percentage: "3%" },
            onlyBestRight: { students: 5, percentage: "13%" },
            onlyWorstRight: { students: 0, percentage: "0%" },
            bothWrong: { students: 32, percentage: "84%" }
          },
          {
            id: "Q14",
            bothRight: { students: 8, percentage: "21%" },
            onlyBestRight: { students: 4, percentage: "11%" },
            onlyWorstRight: { students: 17, percentage: "45%" },
            bothWrong: { students: 9, percentage: "24%" }
          },
          {
            id: "Q19",
            bothRight: { students: 5, percentage: "13%" },
            onlyBestRight: { students: 8, percentage: "21%" },
            onlyWorstRight: { students: 5, percentage: "13%" },
            bothWrong: { students: 20, percentage: "53%" }
          }
        ],
        total: {
          bothRight: { students: 31, percentage: "20%" },
          onlyBestRight: { students: 35, percentage: "23%" },
          onlyWorstRight: { students: 23, percentage: "15%" },
          bothWrong: { students: 63, percentage: "41%" }
        }
      },
      communication: {
        questions: [
          {
            id: "Q5",
            bothRight: { students: 2, percentage: "5%" },
            onlyBestRight: { students: 21, percentage: "55%" },
            onlyWorstRight: { students: 2, percentage: "5%" },
            bothWrong: { students: 13, percentage: "34%" }
          },
          {
            id: "Q10",
            bothRight: { students: 5, percentage: "13%" },
            onlyBestRight: { students: 14, percentage: "37%" },
            onlyWorstRight: { students: 13, percentage: "34%" },
            bothWrong: { students: 6, percentage: "16%" }
          },
          {
            id: "Q15",
            bothRight: { students: 0, percentage: "0%" },
            onlyBestRight: { students: 1, percentage: "3%" },
            onlyWorstRight: { students: 2, percentage: "5%" },
            bothWrong: { students: 35, percentage: "92%" }
          },
          {
            id: "Q20",
            bothRight: { students: 1, percentage: "3%" },
            onlyBestRight: { students: 17, percentage: "45%" },
            onlyWorstRight: { students: 0, percentage: "0%" },
            bothWrong: { students: 20, percentage: "53%" }
          }
        ],
        total: {
          bothRight: { students: 8, percentage: "5%" },
          onlyBestRight: { students: 53, percentage: "35%" },
          onlyWorstRight: { students: 17, percentage: "11%" },
          bothWrong: { students: 74, percentage: "49%" }
        }
      }
    }
  }
};

// Mock data for the comparison report based on the screenshots
export const mockComparisonReportData = {
  classInfo: {
    classA: {
      client: "Edwins Leadership and Restaurant Institute",
      cohort: "E-110424",
      type: "Pre-Program",
      student: "Only Completed"
    },
    classB: {
      client: "Edwins Leadership and Restaurant Institute",
      cohort: "E-010924",
      type: "Pre-Program",
      student: "Only Completed"
    }
  },
  cohortScoringCurve: Array.from({ length: 40 }, (_, i) => ({
    score: i + 1,
    classA: Math.random(),
    classB: Math.random()
  })),
  proficiencyLevels: {
    classA: {
      exceptional: 0,
      high: 0,
      moderate: 0,
      developing: 0,
      needsDevelopment: 27,
      total: 27
    },
    classB: {
      exceptional: 0,
      high: 0,
      moderate: 0,
      developing: 0,
      needsDevelopment: 35,
      total: 35
    }
  },
  categoryScores: {
    classA: {
      resilienceAdaptability: 0.00,
      teamDynamics: 0.00,
      decisionMaking: 0.00,
      selfAwareness: 0.00,
      communication: 0.00
    },
    classB: {
      resilienceAdaptability: 0.00,
      teamDynamics: 0.00,
      decisionMaking: 0.00,
      selfAwareness: 0.00,
      communication: 0.00
    }
  },
  cohortScoringByCategory: {
    resilienceAdaptability: {
      classA: { needsDevelopment: 27, developing: 0, moderate: 0, high: 0, exceptional: 0 },
      classB: { needsDevelopment: 35, developing: 0, moderate: 0, high: 0, exceptional: 0 }
    },
    teamDynamics: {
      classA: { needsDevelopment: 27, developing: 0, moderate: 0, high: 0, exceptional: 0 },
      classB: { needsDevelopment: 35, developing: 0, moderate: 0, high: 0, exceptional: 0 }
    },
    decisionMaking: {
      classA: { needsDevelopment: 27, developing: 0, moderate: 0, high: 0, exceptional: 0 },
      classB: { needsDevelopment: 35, developing: 0, moderate: 0, high: 0, exceptional: 0 }
    },
    selfAwareness: {
      classA: { needsDevelopment: 27, developing: 0, moderate: 0, high: 0, exceptional: 0 },
      classB: { needsDevelopment: 35, developing: 0, moderate: 0, high: 0, exceptional: 0 }
    },
    communication: {
      classA: { needsDevelopment: 27, developing: 0, moderate: 0, high: 0, exceptional: 0 },
      classB: { needsDevelopment: 35, developing: 0, moderate: 0, high: 0, exceptional: 0 }
    }
  },
  topStudents: Array.from({ length: 20 }, (_, i) => ({
    no: i + 1,
    student: "#N/A",
    class: "#N/A",
    score: "#N/A",
    scorePercentage: "#N/A"
  }))
}; 