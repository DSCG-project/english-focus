import { NextRequest, NextResponse } from "next/server";
import {
  EnglishCourse,
  EnglishLesson,
  EnglishQuizQuestion,
} from "@/lib/englishContent";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type SyncPayload = {
  levels: string[];
  courses: EnglishCourse[];
  lessons: EnglishLesson[];
};

function lessonPosition(title: string) {
  const match = title.match(/Lesson\s+(\d+)/i);
  return match ? Number(match[1]) : 999;
}

async function upsertChunks(
  client: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
  size = 300
) {
  for (let index = 0; index < rows.length; index += size) {
    const chunk = rows.slice(index, index + size);

    if (chunk.length === 0) continue;

    const { error } = await client.from(table).upsert(chunk, {
      onConflict,
    });

    if (error) throw error;
  }
}

export async function POST(request: NextRequest) {
  const client = getSupabaseAdminClient();

  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase is not configured.",
      },
      { status: 400 }
    );
  }

  try {
    const payload = (await request.json()) as SyncPayload;

    const levels = Array.isArray(payload.levels) ? payload.levels : [];
    const courses = Array.isArray(payload.courses) ? payload.courses : [];
    const lessons = Array.isArray(payload.lessons) ? payload.lessons : [];

    if (levels.length === 0 || courses.length === 0 || lessons.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nothing to sync. Levels, courses and lessons are required.",
        },
        { status: 400 }
      );
    }

    const levelRows = levels.map((name, index) => ({
      name,
      position: index + 1,
    }));

    await upsertChunks(client, "english_levels", levelRows, "name");

    const courseRows = courses.map((course) => ({
      id: course.id,
      level_name: course.level,
      title: course.title,
      description: course.description || "",
      teacher: course.teacher || "English Focus Team",
      tag: course.tag || "General English",
      progress: course.progress || 0,
      total: lessons.filter((lesson) => lesson.courseId === course.id).length,
      status: course.status || "Active",
    }));

    await upsertChunks(client, "english_courses", courseRows, "id");

    const lessonRows = lessons.map((lesson) => ({
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

    await upsertChunks(client, "english_lessons", lessonRows, "course_id,id");

    const { error: deleteQuestionsError } = await client
      .from("english_quiz_questions")
      .delete()
      .neq("id", "__never__");

    if (deleteQuestionsError) throw deleteQuestionsError;

    const questionRows = lessons.flatMap((lesson) => {
      const quiz = (lesson.quiz || []) as EnglishQuizQuestion[];

      return quiz.map((question, index) => ({
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
      }));
    });

    if (questionRows.length > 0) {
      await upsertChunks(client, "english_quiz_questions", questionRows, "course_id,lesson_id,id");
    }

    return NextResponse.json({
      ok: true,
      message: "Content synced to Supabase successfully.",
      counts: {
        levels: levelRows.length,
        courses: courseRows.length,
        lessons: lessonRows.length,
        questions: questionRows.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Sync failed.",
      },
      { status: 500 }
    );
  }
}
