-- English Focus - Supabase schema
-- Run this file inside Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- =========================
-- ENUMS
-- =========================

do $$ begin
  create type course_status as enum ('Active', 'Locked', 'Draft');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type lesson_status as enum ('Published', 'Draft');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type student_status as enum ('Active', 'Suspended');
exception
  when duplicate_object then null;
end $$;

-- =========================
-- LEVELS
-- =========================

create table if not exists english_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================
-- COURSES
-- =========================

create table if not exists english_courses (
  id text primary key,
  level_name text not null references english_levels(name) on update cascade on delete cascade,
  title text not null,
  description text not null default '',
  teacher text not null default 'English Focus Team',
  tag text not null default 'General English',
  progress int not null default 0,
  total int not null default 0,
  status course_status not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- LESSONS
-- =========================

create table if not exists english_lessons (
  id text not null,
  course_id text not null references english_courses(id) on update cascade on delete cascade,
  level_name text not null,
  course_title text not null,
  title text not null,
  skill text not null default 'Grammar',
  duration text not null default '12 min',
  description text not null default '',
  objective text not null default '',
  status lesson_status not null default 'Published',
  video_url text not null default '',
  pdf_url text not null default '',
  course_pdf_url text not null default '',
  exercises_pdf_url text not null default '',
  notes_pdf_url text not null default '',
  quiz_questions int not null default 0,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (course_id, id)
);

create index if not exists english_lessons_course_idx on english_lessons(course_id);
create index if not exists english_lessons_level_idx on english_lessons(level_name);

-- =========================
-- QUIZ QUESTIONS
-- =========================

create table if not exists english_quiz_questions (
  id text not null,
  course_id text not null,
  lesson_id text not null,
  question text not null,
  choice_a text not null,
  choice_b text not null,
  choice_c text not null,
  choice_d text not null,
  correct_index int not null default 0 check (correct_index between 0 and 3),
  explanation text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (course_id, lesson_id, id),
  foreign key (course_id, lesson_id) references english_lessons(course_id, id) on update cascade on delete cascade
);

create index if not exists english_quiz_questions_lesson_idx on english_quiz_questions(course_id, lesson_id);

-- =========================
-- STUDENTS
-- =========================

create table if not exists english_students (
  id text primary key,
  name text not null,
  email text not null unique,
  status student_status not null default 'Active',
  plan text not null default 'Premium',
  level_name text not null default 'B1 Intermediate',
  course_id text references english_courses(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- TEST RESULTS
-- =========================

create table if not exists english_test_results (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references english_students(id) on update cascade on delete cascade,
  course_id text not null,
  lesson_id text not null,
  score int not null default 0,
  total int not null default 0,
  finished_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (course_id, lesson_id) references english_lessons(course_id, id) on update cascade on delete cascade
);

create index if not exists english_test_results_student_idx on english_test_results(student_id);
create index if not exists english_test_results_lesson_idx on english_test_results(course_id, lesson_id);

-- =========================
-- UPDATED_AT TRIGGER
-- =========================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_courses_updated_at on english_courses;
create trigger set_courses_updated_at
before update on english_courses
for each row execute function set_updated_at();

drop trigger if exists set_lessons_updated_at on english_lessons;
create trigger set_lessons_updated_at
before update on english_lessons
for each row execute function set_updated_at();

drop trigger if exists set_questions_updated_at on english_quiz_questions;
create trigger set_questions_updated_at
before update on english_quiz_questions
for each row execute function set_updated_at();

drop trigger if exists set_students_updated_at on english_students;
create trigger set_students_updated_at
before update on english_students
for each row execute function set_updated_at();

-- =========================
-- STORAGE BUCKETS
-- =========================
-- Create these buckets manually in Supabase Storage:
-- 1. english-focus-videos
-- 2. english-focus-pdfs
--
-- Recommended:
-- videos bucket: private later
-- pdfs bucket: private later
-- For MVP testing, you can keep them public temporarily.
