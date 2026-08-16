CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, school_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
 role TEXT NOT NULL CHECK (role IN ('admin','teacher','student','parent','safeguarding')),
 pin_hash TEXT NOT NULL, linked_student_id TEXT, phone TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS students (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, class_name TEXT NOT NULL,
 parent_user_id TEXT, route TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS signals (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, category TEXT NOT NULL,
 note TEXT DEFAULT '', urgent BOOLEAN DEFAULT FALSE, status TEXT DEFAULT 'new',
 visibility TEXT DEFAULT 'support', created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS attendance (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, class_name TEXT NOT NULL,
 state TEXT NOT NULL, lesson_date DATE DEFAULT CURRENT_DATE, marked_by TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS interventions (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, signal_id TEXT, title TEXT NOT NULL,
 owner_id TEXT, status TEXT DEFAULT 'assigned', actions JSONB DEFAULT '[]',
 follow_up_at TIMESTAMPTZ, created_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS recoveries (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, subject TEXT NOT NULL, topic TEXT NOT NULL,
 content JSONB NOT NULL, status TEXT DEFAULT 'assigned', mastery_score INTEGER,
 created_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), completed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS family_responses (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, response TEXT NOT NULL,
 channel TEXT DEFAULT 'web', created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS outcomes (
 id TEXT PRIMARY KEY, intervention_id TEXT NOT NULL, attendance_improved BOOLEAN,
 learning_recovered BOOLEAN, student_confirmed BOOLEAN, note TEXT,
 recorded_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY, actor_id TEXT, action TEXT NOT NULL, entity_type TEXT,
 entity_id TEXT, metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_signals_student ON signals(student_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id,lesson_date DESC);
CREATE INDEX IF NOT EXISTS idx_interventions_student ON interventions(student_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at DESC);
