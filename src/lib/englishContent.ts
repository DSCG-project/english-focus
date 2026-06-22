export type EnglishLevel = string;
export type EnglishSkill = string;

export type EnglishQuizQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  explanation: string;
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
  coursePdf?: string;
  exercisesPdf?: string;
  notesPdf?: string;
  quizQuestions: number;
  quiz?: EnglishQuizQuestion[];
};

export const englishLevels: EnglishLevel[] = [
  "A1 Beginner",
  "A2 Elementary",
  "B1 Intermediate",
  "B2 Upper Intermediate",
  "C1 Advanced",
  "C2 Proficiency",
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
  "Business Communication",
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type CourseSeed = {
  id: string;
  code: string;
  level: EnglishLevel;
  title: string;
  description: string;
  teacher: string;
  tag: string;
  progress: number;
  topics: string[];
};

function withReviews(topics: string[]) {
  const result: string[] = [];
  let review = 1;

  topics.forEach((topic, index) => {
    result.push(topic);

    if ((index + 1) % 4 === 0) {
      result.push(`Review ${review} - Extra Practice`);
      review += 1;
    }
  });

  return result.slice(0, 60);
}

const a1Topics = withReviews([
  "Greetings and Introductions",
  "Alphabet, Spelling and Classroom Language",
  "Countries, Nationalities and Jobs",
  "Numbers, Prices and Telling the Time",
  "Singular and Plural Nouns",
  "A, An and Basic Requests",
  "Family, Possessions and Have Got",
  "Daily Routines and Present Simple",
  "Present Simple Questions",
  "Present Simple Negatives",
  "Can for Ability and Permission",
  "Sports, Hobbies and Interests",
  "Rooms, Furniture and There Is / There Are",
  "Directions and Places in Town",
  "Food, Drinks and Would Like",
  "Shopping for Everyday Items",
  "Present Continuous for Now",
  "Present Continuous Questions",
  "Imperatives and Classroom Instructions",
  "Present Simple vs Present Continuous",
  "At the Doctor and Basic Advice",
  "Everyday Problems and Solutions",
  "Object Pronouns",
  "Possessive Adjectives and Everyday Objects",
  "Transport and Travel Words",
  "Do as a Main Verb",
  "Past Simple Regular Verbs",
  "Past Simple Irregular Verbs",
  "Holidays and Travel Stories",
  "Pronunciation of -ed Endings",
  "Days, Months and Seasons",
  "Making Appointments",
  "Prepositions of Time",
  "Adjectives for Personality",
  "Basic Phrasal Verbs",
  "Office Vocabulary",
  "Comparatives and Superlatives",
  "Animals and Nature",
  "Welcoming Guests",
  "Talking About Your Hometown",
  "Countable and Uncountable Nouns",
  "How Much and How Many",
  "Household Jobs",
  "Common Irregular Verbs",
  "Technology Vocabulary",
  "Films, Books and TV",
  "Past Continuous",
  "Basic Conjunctions",
]);

const a2Topics = withReviews([
  "Personal Information and Profiles",
  "Large Numbers, Dates and Times",
  "Abilities, Habits and Routines",
  "Sports and Entertainment",
  "Frequency Adverbs",
  "Studies, Work and Employment",
  "Past Events and Anecdotes 1",
  "Past Events and Anecdotes 2",
  "Family and Relationships",
  "Weather and Seasons",
  "Future Plans 1",
  "Computers and Digital Life",
  "Making Suggestions",
  "Holidays and Travel Plans",
  "TV Series and Opinions",
  "Clothes, Style and Culture",
  "Future Plans 2",
  "Appearance and Character",
  "Short Anecdotes",
  "Superlative Adjectives",
  "Describing Processes",
  "Passive Voice Basics",
  "Formal and Informal English",
  "Talking About Statistics",
  "Illness and Giving Advice",
  "Present Perfect 1",
  "Present Perfect 2",
  "Present Perfect vs Past Simple",
  "Willpower and Intentions",
  "Past and Present Habits",
  "When I Was a Child",
  "Telephone Language",
  "Question Forms Review",
  "Personality and Relationships",
  "Past Continuous",
  "Storytelling Practice",
  "Talking About Sport",
  "Everyday Problems",
  "Advice and Recommendations",
  "Money and Personal Budgeting",
  "Past Perfect",
  "Narrative Tenses",
  "Containers and Quantities",
  "Make or Do",
  "Greetings and Farewells",
  "Big Review and Speaking Practice",
  "Email Basics",
  "Simple Presentations",
]);

const b1Topics = withReviews([
  "The People in Your Life",
  "Present Simple and Continuous",
  "Holidays and Travel Experiences",
  "Food and Eating Out",
  "Recent Life Events",
  "Present Perfect and Past Simple",
  "Numbers and Measurements",
  "Mobile Phones and Communication",
  "Modals for Permission and Obligation",
  "Modals for Probability",
  "Describing People",
  "Giving Advice",
  "Friendship and Social Life",
  "First Conditional",
  "Education and Learning",
  "Second Conditional",
  "Appearance and Style",
  "Be Like vs Look Like",
  "Clothes and Shopping",
  "Past Habits",
  "Make or Do",
  "Gadgets at Home and Work",
  "Defining Relative Clauses",
  "Quantifiers and Amounts",
  "Films, Books and TV Programmes",
  "Preferences and Opinions",
  "Strong Adjectives",
  "Passive Voice",
  "Have You Ever",
  "Personal Stories",
  "Past Simple and Past Perfect",
  "Reported Speech",
  "Future Plans",
  "Planning a Day Out",
  "Life Changes with Get",
  "Be Used To and Get Used To",
  "Arts and Music",
  "Predictions with Will, Going To and Might",
  "Phrasal Verbs",
  "Apologising Politely",
  "Comparing People and Places",
  "Shopping Problems",
  "Dependent Prepositions",
  "Conditionals Review",
  "Third Conditional",
  "Verb Patterns",
  "Adverbials",
  "Telephone Politeness",
]);

const b2Topics = withReviews([
  "Question Forms 1",
  "Illness and Symptoms",
  "Question Forms 2",
  "Healthcare and Treatment",
  "Present Perfect 1",
  "Describing Personality",
  "Present Perfect 2",
  "Life Experiences",
  "Narrative Tenses 1",
  "Travel and Tourism",
  "Narrative Tenses 2",
  "Descriptive Adjectives",
  "Passive Voice 1",
  "Crime and Punishment",
  "Passive Voice 2",
  "Weather and Climate",
  "Future Perfect 1",
  "Expressions with Take",
  "Future Perfect 2",
  "Expressions with Bring",
  "Past Modals 1",
  "Verbs of the Senses",
  "Past Modals 2",
  "The Body",
  "Gerunds and Infinitives 1",
  "Music and Performance",
  "Gerunds and Infinitives 2",
  "Sleep and Wellbeing",
  "Reporting Verbs 1",
  "Media and Communication",
  "Reporting Verbs 2",
  "The News",
  "Articles 1",
  "Environment",
  "Articles 2",
  "Technology",
  "Countable and Uncountable Nouns 1",
  "Food and Ingredients",
  "Countable and Uncountable Nouns 2",
  "Collective Nouns",
  "Wish 1",
  "Collocations 1",
  "Wish 2",
  "Collocations 2",
  "Relative Clauses 1",
  "Business Communication",
  "Relative Clauses 2",
  "Advertising",
]);

const c1Topics = withReviews([
  "Discourse Markers 1",
  "Money and Economic Issues",
  "Discourse Markers 2",
  "Expressions with Get",
  "Adding Emphasis 1",
  "Sport and Performance",
  "Adding Emphasis 2",
  "Abstract Nouns",
  "Speculation and Deduction 1",
  "Expressions with Time",
  "Speculation and Deduction 2",
  "The Arts",
  "Hypothetical Meaning 1",
  "Dependent Prepositions",
  "Hypothetical Meaning 2",
  "Commonly Confused Words",
  "Relative Clauses 1",
  "Word Formation",
  "Relative Clauses 2",
  "The Brain and Mind",
  "Articles 1",
  "Verb Collocations",
  "Articles 2",
  "Adjective-Noun Collocations",
  "Verb Patterns 1",
  "The World of Work",
  "Verb Patterns 2",
  "War and Conflict",
  "Conditionals 1",
  "Technology and Devices",
  "Conditionals 2",
  "Animals and Nature",
  "Future Forms 1",
  "Phrasal Verbs with Up and Down",
  "Future Forms 2",
  "Borrowed Words and Expressions",
  "Passives 1",
  "Travel and Mobility",
  "Passives 2",
  "Food Preparation",
  "Distancing 1",
  "Age and Generations",
  "Distancing 2",
  "Games and Play",
  "Verbs of Seeing and Sensing 1",
  "Extreme Nature",
  "Verbs of Seeing and Sensing 2",
  "Fears and Phobias",
]);

const c2Topics = withReviews([
  "Personal Stories and Narrative Voice",
  "Humour and Irony",
  "Film English",
  "Advanced Articles",
  "Law and Order",
  "Being Vague with Precision",
  "The Arts and Criticism",
  "Idiomatic English 1",
  "News and Editorial Language",
  "Easily Confused Words",
  "Finance and the Economy",
  "Phrasal Verbs 1",
  "Cycle of Life",
  "Word Play",
  "Nostalgia and Memory",
  "Expressing Attitude",
  "Clothes and Fashion",
  "Connotations",
  "Academic English",
  "Negative Inversion",
  "Weather and Atmosphere",
  "Subtle Meaning",
  "Landscapes and Environment",
  "Idiomatic English 2",
  "Driving and Transport",
  "Abbreviations and Acronyms",
  "Tourism and Culture",
  "Phrasal Verbs 2",
  "Animals and Behaviour",
  "Advanced Punctuation",
  "Health and Fitness",
  "Word Stress",
  "Food and Taste",
  "Prefixes and Suffixes",
  "Sport and Competition",
  "Future in the Past",
  "World of Work",
  "Register and Tone",
  "History and Politics",
  "Processes and Methods",
  "Fables and Legends",
  "Slang and Informal Speech",
  "Relationships",
  "Phrasal Verbs 3",
  "New Words",
  "Multiple Meanings",
  "British and American English",
  "Features of Fluent Speech",
]);

const cefrSeeds: CourseSeed[] = [
  {
    id: "a1-beginner",
    code: "A1",
    level: "A1 Beginner",
    title: "A1 - Beginner English Course",
    description: "Build essential English for everyday communication, basic grammar and simple conversations.",
    teacher: "English Focus Team",
    tag: "General English",
    progress: 0,
    topics: a1Topics,
  },
  {
    id: "a2-elementary",
    code: "A2",
    level: "A2 Elementary",
    title: "A2 - Elementary English Course",
    description: "Develop everyday English, stronger sentence structure and practical communication.",
    teacher: "English Focus Team",
    tag: "General English",
    progress: 0,
    topics: a2Topics,
  },
  {
    id: "b1-intermediate",
    code: "B1",
    level: "B1 Intermediate",
    title: "B1 - Intermediate English Course",
    description: "Improve confidence, grammar range, vocabulary and speaking for real-life situations.",
    teacher: "English Focus Team",
    tag: "General English",
    progress: 0,
    topics: b1Topics,
  },
  {
    id: "b2-upper-intermediate",
    code: "B2",
    level: "B2 Upper Intermediate",
    title: "B2 - Upper Intermediate English Course",
    description: "Build fluency, accuracy and advanced vocabulary for work, study and international exams.",
    teacher: "English Focus Team",
    tag: "General English",
    progress: 0,
    topics: b2Topics,
  },
  {
    id: "c1-advanced",
    code: "C1",
    level: "C1 Advanced",
    title: "C1 - Advanced English Course",
    description: "Develop flexible, fluent and precise English for academic and professional communication.",
    teacher: "English Focus Team",
    tag: "General English",
    progress: 0,
    topics: c1Topics,
  },
  {
    id: "c2-proficiency",
    code: "C2",
    level: "C2 Proficiency",
    title: "C2 - English Proficiency Course",
    description: "Refine sophisticated English, nuance, style and high-level communication.",
    teacher: "English Focus Team",
    tag: "General English",
    progress: 0,
    topics: c2Topics,
  },
];

const businessSubjects = [
  "Accounting",
  "Finance",
  "Marketing",
  "Sales",
  "Law",
  "Human Resources",
  "Management",
  "Operations",
  "Logistics",
  "Customer Service",
  "Real Estate",
  "Technology and IT",
];

const businessLessonTemplates = [
  "Essential Vocabulary",
  "Key Workplace Situations",
  "Common Documents",
  "Professional Emails",
  "Meetings and Discussions",
  "Presenting Information",
  "Explaining Processes",
  "Telephone and Video Calls",
  "Negotiation Language",
  "Problem Solving",
  "Reporting Results",
  "Asking Clear Questions",
  "Giving Updates",
  "Describing Trends",
  "Handling Complaints",
  "Formal and Informal Tone",
  "Reading Business Texts",
  "Writing Short Reports",
  "Numbers and Data",
  "Risks and Controls",
  "Policies and Procedures",
  "Client Communication",
  "Internal Communication",
  "Useful Collocations",
  "Case Study Practice",
  "Role Play Practice",
  "Mini Presentation",
  "Review and Vocabulary Builder",
  "Exam-Style Practice",
  "Final Review",
];

function makeCourse(seed: CourseSeed): EnglishCourse {
  return {
    id: seed.id,
    level: seed.level,
    title: seed.title,
    description: seed.description,
    teacher: seed.teacher,
    tag: seed.tag,
    progress: seed.progress,
    total: seed.topics.length,
    status: "Active",
  };
}

function lessonIdFor(courseId: string, number: number, topic: string) {
  if (courseId === "b1-intermediate" && number === 1) {
    return "lesson-01-the-people-in-your-life";
  }

  if (courseId === "b2-upper-intermediate" && number === 1) {
    return "question-forms-1";
  }

  if (courseId === "b2-upper-intermediate" && number === 2) {
    return "illness";
  }

  if (courseId === "b2-upper-intermediate" && number === 3) {
    return "question-forms-2";
  }

  if (courseId === "b2-upper-intermediate" && number === 4) {
    return "healthcare";
  }

  if (courseId === "b2-upper-intermediate" && number === 6) {
    return "present-perfect-1";
  }

  return `lesson-${pad(number)}-${slugify(topic.replace(/^Review\s+\d+\s+-\s+/i, "review-"))}`;
}

function skillForTopic(topic: string): EnglishSkill {
  const lower = topic.toLowerCase();

  if (lower.includes("speaking") || lower.includes("conversation") || lower.includes("role play")) return "Speaking";
  if (lower.includes("listening") || lower.includes("telephone") || lower.includes("calls")) return "Listening";
  if (lower.includes("reading") || lower.includes("texts")) return "Reading";
  if (lower.includes("writing") || lower.includes("email") || lower.includes("report")) return "Writing";
  if (lower.includes("pronunciation") || lower.includes("stress")) return "Pronunciation";
  if (lower.includes("business") || lower.includes("meeting") || lower.includes("presentation")) return "Business Communication";
  if (lower.includes("vocabulary") || lower.includes("words") || lower.includes("collocations")) return "Vocabulary";

  return "Grammar";
}

function makeLesson(seed: CourseSeed, topic: string, index: number): EnglishLesson {
  const number = index + 1;
  const title = `Lesson ${pad(number)} - ${topic}`;

  return {
    id: lessonIdFor(seed.id, number, topic),
    courseId: seed.id,
    level: seed.level,
    course: seed.title,
    title,
    skill: skillForTopic(topic),
    duration: "12 min",
    description: "",
    objective: "",
    status: "Published",
    video: "",
    pdf: "",
    coursePdf: "",
    exercisesPdf: "",
    notesPdf: "",
    quizQuestions: 0,
    quiz: [],
  };
}

function businessCourse(subject: string): EnglishCourse {
  const id = `business-${slugify(subject)}`;

  return {
    id,
    level: "Business English",
    title: `Business English - ${subject}`,
    description: `Professional English for ${subject.toLowerCase()} situations, documents, meetings and communication.`,
    teacher: "English Focus Business Team",
    tag: subject,
    progress: 0,
    total: 30,
    status: "Active",
  };
}

function businessLessons(subject: string): EnglishLesson[] {
  const course = businessCourse(subject);

  return businessLessonTemplates.map((template, index) => {
    const number = index + 1;
    const title = `Lesson ${pad(number)} - ${subject}: ${template}`;

    return {
      id: `lesson-${pad(number)}-${slugify(template)}`,
      courseId: course.id,
      level: course.level,
      course: course.title,
      title,
      skill: "Business Communication",
      duration: "12 min",
      description: "",
      objective: "",
      status: "Published",
      video: "",
      pdf: "",
      coursePdf: "",
      exercisesPdf: "",
      notesPdf: "",
      quizQuestions: 0,
      quiz: [],
    };
  });
}

export const defaultCourses: EnglishCourse[] = [
  ...cefrSeeds.map(makeCourse),
  ...businessSubjects.map(businessCourse),
];

export const defaultLessons: EnglishLesson[] = [
  ...cefrSeeds.flatMap((seed) => seed.topics.map((topic, index) => makeLesson(seed, topic, index))),
  ...businessSubjects.flatMap((subject) => businessLessons(subject)),
];

export const recommended = defaultCourses.slice(0, 6);

export const events = [
  {
    id: "speaking-club",
    title: "Speaking Club",
    date: "Every week",
    description: "Live speaking practice sessions will be added later.",
  },
  {
    id: "business-workshop",
    title: "Business English Workshop",
    date: "Coming soon",
    description: "Professional English workshops will be added later.",
  },
];
