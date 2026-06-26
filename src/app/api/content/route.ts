import { NextResponse } from "next/server";
import {
  EnglishCourse,
  EnglishLesson,
  EnglishQuizQuestion,
  defaultCourses,
  defaultLessons,
  englishLevels,
} from "@/lib/englishContent";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type LevelRow = {
  name: string;
  position: number;
};

type CourseRow = {
  id: string;
  level_name: string;
  title: string;
  description: string;
  teacher: string;
  tag: string;
  progress: number;
  total: number;
  status: "Active" | "Locked" | "Draft";
};

type LessonRow = {
  id: string;
  course_id: string;
  level_name: string;
  course_title: string;
  title: string;
  skill: string;
  duration: string;
  description: string;
  objective: string;
  status: "Published" | "Draft";
  video_url: string;
  pdf_url: string;
  course_pdf_url: string;
  exercises_pdf_url: string;
  notes_pdf_url: string;
  quiz_questions: number;
  position: number;
};

type QuestionRow = {
  id: string;
  course_id: string;
  lesson_id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_index: number;
  explanation: string;
  position: number;
};

function fallbackResponse(message: string) {
  return NextResponse.json({
    ok: true,
    source: "fallback",
    message,
    levels: englishLevels,
    courses: defaultCourses,
    lessons: defaultLessons,
    counts: {
      levels: englishLevels.length,
      courses: defaultCourses.length,
      lessons: defaultLessons.length,
      questions: defaultLessons.reduce((total, lesson) => total + (lesson.quiz?.length || 0), 0),
    },
  });
}

export async function GET() {
  const client = getSupabaseAdminClient();

  if (!client) {
    return fallbackResponse("Supabase is not configured. Using local fallback.");
  }

  const [
    levelsResult,
    coursesResult,
    lessonsResult,
    questionsResult,
  ] = await Promise.all([
    client.from("english_levels").select("name, position").order("position", { ascending: true }),
    client.from("english_courses").select("*").order("level_name", { ascending: true }).order("title", { ascending: true }),
    client.from("english_lessons").select("*").order("course_id", { ascending: true }).order("position", { ascending: true }),
    client.from("english_quiz_questions").select("*").order("course_id", { ascending: true }).order("lesson_id", { ascending: true }).order("position", { ascending: true }),
  ]);

  if (levelsResult.error || coursesResult.error || lessonsResult.error || questionsResult.error) {
    return fallbackResponse(
      levelsResult.error?.message ||
      coursesResult.error?.message ||
      lessonsResult.error?.message ||
      questionsResult.error?.message ||
      "Unable to load Supabase content."
    );
  }

  const levelRows = (levelsResult.data || []) as LevelRow[];
  const courseRows = (coursesResult.data || []) as CourseRow[];
  const lessonRows = (lessonsResult.data || []) as LessonRow[];
  const questionRows = (questionsResult.data || []) as QuestionRow[];

  if (levelRows.length === 0 || courseRows.length === 0 || lessonRows.length === 0) {
    return fallbackResponse("Supabase tables are empty. Seed database first.");
  }

  const levels = levelRows.map((level) => level.name);

  const courses: EnglishCourse[] = courseRows.map((course) => ({
    id: course.id,
    level: course.level_name,
    title: course.title,
    description: course.description || "",
    teacher: course.teacher || "English Focus Team",
    tag: course.tag || "General English",
    progress: course.progress || 0,
    total: course.total || lessonRows.filter((lesson) => lesson.course_id === course.id).length,
    status: course.status || "Active",
  }));

  const questionMap = new Map<string, EnglishQuizQuestion[]>();

  questionRows.forEach((question) => {
    const key = `${question.course_id}__${question.lesson_id}`;

    const list = questionMap.get(key) || [];

    list.push({
      id: question.id,
      question: question.question,
      choices: [
        question.choice_a,
        question.choice_b,
        question.choice_c,
        question.choice_d,
      ],
      correctIndex: question.correct_index,
      explanation: question.explanation || "",
    });

    questionMap.set(key, list);
  });

  const lessons: EnglishLesson[] = lessonRows.map((lesson) => {
    const key = `${lesson.course_id}__${lesson.id}`;
    const quiz = questionMap.get(key) || [];

    return {
      id: lesson.id,
      courseId: lesson.course_id,
      level: lesson.level_name,
      course: lesson.course_title,
      title: lesson.title,
      skill: lesson.skill || "Grammar",
      duration: lesson.duration || "12 min",
      description: lesson.description || "",
      objective: lesson.objective || "",
      status: lesson.status || "Published",
      video: lesson.video_url || "",
      pdf: lesson.pdf_url || "",
      coursePdf: lesson.course_pdf_url || "",
      exercisesPdf: lesson.exercises_pdf_url || "",
      notesPdf: lesson.notes_pdf_url || "",
      quizQuestions: quiz.length || lesson.quiz_questions || 0,
      quiz,
    };
  });

  return NextResponse.json({
    ok: true,
    source: "supabase",
    message: "Content loaded from Supabase.",
    levels,
    courses,
    lessons,
    counts: {
      levels: levels.length,
      courses: courses.length,
      lessons: lessons.length,
      questions: questionRows.length,
    },
  });
}
