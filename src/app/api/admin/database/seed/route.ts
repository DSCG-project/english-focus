import { NextResponse } from "next/server";
import {
  defaultCourses,
  defaultLessons,
  englishLevels,
} from "@/lib/englishContent";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

function lessonPosition(title: string) {
  const match = title.match(/Lesson\s+(\d+)/i);
  return match ? Number(match[1]) : 999;
}

export async function POST() {
  const client = getSupabaseAdminClient();

  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase is not configured yet. Add .env.local keys first.",
      },
      { status: 400 }
    );
  }

  try {
    const levelRows = englishLevels.map((name, index) => ({
      name,
      position: index + 1,
    }));

    const { error: levelsError } = await client
      .from("english_levels")
      .upsert(levelRows, { onConflict: "name" });

    if (levelsError) throw levelsError;

    const courseRows = defaultCourses.map((course) => ({
      id: course.id,
      level_name: course.level,
      title: course.title,
      description: course.description || "",
      teacher: course.teacher || "English Focus Team",
      tag: course.tag || "General English",
      progress: course.progress || 0,
      total: defaultLessons.filter((lesson) => lesson.courseId === course.id).length,
      status: course.status || "Active",
    }));

    const { error: coursesError } = await client
      .from("english_courses")
      .upsert(courseRows, { onConflict: "id" });

    if (coursesError) throw coursesError;

    const lessonRows = defaultLessons.map((lesson) => ({
      id: lesson.id,
      course_id: lesson.courseId,
      level_name: lesson.level,
      course_title: lesson.course,
      title: lesson.title,
      skill: lesson.skill || "Grammar",
      duration: lesson.duration || "12 min",
      description: lesson.description || "",
      objective: lesson.objective || "",
      status: lesson.status || "Published",
      video_url: lesson.video || "",
      pdf_url: lesson.pdf || "",
      course_pdf_url: lesson.coursePdf || "",
      exercises_pdf_url: lesson.exercisesPdf || "",
      notes_pdf_url: lesson.notesPdf || "",
      quiz_questions: lesson.quiz?.length || 0,
      position: lessonPosition(lesson.title),
    }));

    const { error: lessonsError } = await client
      .from("english_lessons")
      .upsert(lessonRows, { onConflict: "course_id,id" });

    if (lessonsError) throw lessonsError;

    const questionRows = defaultLessons.flatMap((lesson) =>
      (lesson.quiz || []).map((question, index) => ({
        id: question.id,
        course_id: lesson.courseId,
        lesson_id: lesson.id,
        question: question.question,
        choice_a: question.choices[0],
        choice_b: question.choices[1],
        choice_c: question.choices[2],
        choice_d: question.choices[3],
        correct_index: question.correctIndex,
        explanation: question.explanation || "",
        position: index + 1,
      }))
    );

    if (questionRows.length > 0) {
      const { error: questionsError } = await client
        .from("english_quiz_questions")
        .upsert(questionRows, { onConflict: "course_id,lesson_id,id" });

      if (questionsError) throw questionsError;
    }

    const { error: studentError } = await client
      .from("english_students")
      .upsert(
        [
          {
            id: "student-demo",
            name: "Demo Student",
            email: "student@englishfocus.local",
            status: "Active",
            plan: "Premium",
            level_name: "B1 Intermediate",
            course_id: "b1-intermediate",
          },
        ],
        { onConflict: "id" }
      );

    if (studentError) throw studentError;

    return NextResponse.json({
      ok: true,
      message: "Supabase catalogue seeded successfully.",
      counts: {
        levels: levelRows.length,
        courses: courseRows.length,
        lessons: lessonRows.length,
        questions: questionRows.length,
        students: 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Seed failed.",
      },
      { status: 500 }
    );
  }
}
