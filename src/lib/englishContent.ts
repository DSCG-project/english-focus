export type EnglishLevel =
  | "A1 Beginner"
  | "A2 Elementary"
  | "B1 Intermediate"
  | "B2 Upper Intermediate"
  | "C1 Advanced"
  | "Business English";

export type EnglishSkill =
  | "Grammar"
  | "Vocabulary"
  | "Speaking"
  | "Listening"
  | "Reading"
  | "Writing"
  | "Pronunciation";

export type EnglishQuizQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

export type EnglishLesson = {
  id: string;
  courseId: string;
  level: EnglishLevel;
  course: string;
  title: string;
  skill: EnglishSkill;
  duration: string;
  description: string;
  objective: string;
  status: "Draft" | "Published";
  video: string;
  pdf: string;
  quizQuestions: number;
  quiz?: EnglishQuizQuestion[];
};

export type EnglishCourse = {
  id: string;
  level: EnglishLevel;
  title: string;
  description: string;
  teacher: string;
  tag: string;
  progress: number;
  total: number;
  status: "Active" | "Locked" | "Draft";
};

export const englishLevels: EnglishLevel[] = [
  "A1 Beginner",
  "A2 Elementary",
  "B1 Intermediate",
  "B2 Upper Intermediate",
  "C1 Advanced",
  "Business English",
];

export const englishSkills: EnglishSkill[] = [
  "Grammar",
  "Vocabulary",
  "Speaking",
  "Listening",
  "Reading",
  "Writing",
  "Pronunciation",
];

export const defaultCourses: EnglishCourse[] = [
  {
    id: "b1-intermediate",
    level: "B1 Intermediate",
    title: "B1 - Intermediate English Course",
    description:
      "Build confidence in everyday communication, grammar, vocabulary and speaking.",
    teacher: "Stephanie Marston",
    tag: "General English",
    progress: 44,
    total: 60,
    status: "Active",
  },
  {
    id: "b2-upper-intermediate",
    level: "B2 Upper Intermediate",
    title: "B2 - Upper Intermediate English Course",
    description:
      "Improve fluency, advanced grammar, comprehension and professional expression.",
    teacher: "Stephanie Marston",
    tag: "General English",
    progress: 52,
    total: 60,
    status: "Active",
  },
  {
    id: "ielts-speaking-course-2",
    level: "B2 Upper Intermediate",
    title: "IELTS Speaking Course 2",
    description:
      "Prepare for IELTS speaking tasks with structured answers and fluency practice.",
    teacher: "Stephanie Marston",
    tag: "Exam Preparation",
    progress: 0,
    total: 24,
    status: "Locked",
  },
  {
    id: "meeting-skills",
    level: "Business English",
    title: "Meeting Skills",
    description:
      "Learn how to participate, present opinions and communicate clearly in meetings.",
    teacher: "Stephanie Marston",
    tag: "Business English",
    progress: 0,
    total: 18,
    status: "Locked",
  },
];

export const defaultLessons: EnglishLesson[] = [
  {
    id: "question-forms-1",
    courseId: "b2-upper-intermediate",
    level: "B2 Upper Intermediate",
    course: "B2 - Upper Intermediate English Course",
    title: "Question Forms 1",
    skill: "Grammar",
    duration: "12 min",
    description:
      "Learn how to build accurate question forms in spoken and written English.",
    objective:
      "Ask clear and grammatically correct questions in real conversations.",
    status: "Published",
    video: "/uploads/videos/question-forms-1.mp4",
    pdf: "/uploads/pdfs/question-forms-1.pdf",
    quizQuestions: 3,
    quiz: [
      {
        id: "q1",
        question: "Which question form is correct?",
        choices: [
          "Where do you live?",
          "Where you live?",
          "Where are you live?",
          "Where does you live?",
        ],
        correctIndex: 0,
        explanation:
          "Use do/does to form questions in the Present Simple with most verbs.",
      },
      {
        id: "q2",
        question: "Choose the correct indirect question.",
        choices: [
          "Can you tell me where is the station?",
          "Can you tell me where the station is?",
          "Can you tell me where does the station is?",
          "Can you tell me where the station does?",
        ],
        correctIndex: 1,
        explanation:
          "In indirect questions, the word order is subject + verb: where the station is.",
      },
      {
        id: "q3",
        question: "Which question is a subject question?",
        choices: [
          "Who called you?",
          "Who did you call?",
          "Where did you go?",
          "What do you need?",
        ],
        correctIndex: 0,
        explanation:
          "When who is the subject, we do not use do/does/did: Who called you?",
      },
    ],
  },
  {
    id: "illness",
    courseId: "b2-upper-intermediate",
    level: "B2 Upper Intermediate",
    course: "B2 - Upper Intermediate English Course",
    title: "Illness",
    skill: "Vocabulary",
    duration: "14 min",
    description:
      "Learn useful vocabulary and expressions to talk about health and illness.",
    objective:
      "Describe symptoms, ask for help and understand health-related conversations.",
    status: "Published",
    video: "/uploads/videos/illness.mp4",
    pdf: "/uploads/pdfs/illness.pdf",
    quizQuestions: 1,
    quiz: [
      {
        id: "q1",
        question: "Which sentence is correct?",
        choices: [
          "I have a headache.",
          "I am headache.",
          "I make headache.",
          "I do headache.",
        ],
        correctIndex: 0,
        explanation:
          "Use have with many common health problems: have a headache, have a cold.",
      },
    ],
  },
  {
    id: "question-forms-2",
    courseId: "b2-upper-intermediate",
    level: "B2 Upper Intermediate",
    course: "B2 - Upper Intermediate English Course",
    title: "Question Forms 2",
    skill: "Grammar",
    duration: "13 min",
    description:
      "Continue improving question structures with more advanced examples.",
    objective:
      "Use subject questions, object questions and indirect questions correctly.",
    status: "Published",
    video: "/uploads/videos/question-forms-2.mp4",
    pdf: "/uploads/pdfs/question-forms-2.pdf",
    quizQuestions: 0,
    quiz: [],
  },
  {
    id: "healthcare",
    courseId: "b2-upper-intermediate",
    level: "B2 Upper Intermediate",
    course: "B2 - Upper Intermediate English Course",
    title: "Healthcare",
    skill: "Vocabulary",
    duration: "15 min",
    description:
      "Understand healthcare vocabulary and improve practical communication.",
    objective:
      "Use healthcare vocabulary in real-life and professional contexts.",
    status: "Published",
    video: "/uploads/videos/healthcare.mp4",
    pdf: "/uploads/pdfs/healthcare.pdf",
    quizQuestions: 0,
    quiz: [],
  },
  {
    id: "present-perfect-1",
    courseId: "b2-upper-intermediate",
    level: "B2 Upper Intermediate",
    course: "B2 - Upper Intermediate English Course",
    title: "Present Perfect 1",
    skill: "Grammar",
    duration: "16 min",
    description:
      "Understand the Present Perfect and how it differs from the Past Simple.",
    objective:
      "Use the Present Perfect to talk about experience, results and recent actions.",
    status: "Draft",
    video: "",
    pdf: "",
    quizQuestions: 0,
    quiz: [],
  },
  {
    id: "professional-email-structure",
    courseId: "business-email-basics",
    level: "Business English",
    course: "Business Email Basics",
    title: "Professional Email Structure",
    skill: "Writing",
    duration: "14 min",
    description:
      "Learn how to structure professional emails clearly and politely.",
    objective:
      "Write clear professional emails with a strong subject, opening and closing.",
    status: "Draft",
    video: "",
    pdf: "",
    quizQuestions: 0,
    quiz: [],
  },
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
