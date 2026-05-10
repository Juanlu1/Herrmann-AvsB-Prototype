-- ============================================================
-- SCHEMA: Test de Estilos de Aprendizaje (Herrmann)
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- TABLA: participants
-- Almacena los datos personales de cada participante que
-- completa el test.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL CHECK (char_length(nombre) > 0),
  apellido    TEXT NOT NULL CHECK (char_length(apellido) > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: questions
-- Catálogo estático de preguntas del test.
-- Se precarga una sola vez; no cambia entre sesiones.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id              INTEGER PRIMARY KEY,                -- coincide con Question.id del código
  context         TEXT NOT NULL,
  option_a_text   TEXT NOT NULL,
  option_a_quad   CHAR(1) NOT NULL CHECK (option_a_quad IN ('A','B','C','D')),
  option_b_text   TEXT NOT NULL,
  option_b_quad   CHAR(1) NOT NULL CHECK (option_b_quad IN ('A','B','C','D')),
  has_activity    BOOLEAN NOT NULL DEFAULT FALSE,
  activity_type   TEXT CHECK (
    activity_type IN (
      'music-mixer','drawing-canvas','puzzle','cooking',
      'room-arranger','packing','morning-routine','task-assigner'
    )
  ),
  activity_option CHAR(1) CHECK (activity_option IN ('A','B'))
);

-- ------------------------------------------------------------
-- TABLA: test_sessions
-- Representa una instancia completa del test para un
-- participante. Un mismo participante puede repetir el test.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id  UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,                        -- NULL si aún no terminó
  total_questions INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- TABLA: answers
-- Registra la respuesta de cada sesión a cada pregunta.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS answers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id   INTEGER NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  choice        CHAR(1) NOT NULL CHECK (choice IN ('A','B')),
  quadrant      CHAR(1) NOT NULL CHECK (quadrant IN ('A','B','C','D')),
  answered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (session_id, question_id)   -- una respuesta por pregunta por sesión
);

-- ------------------------------------------------------------
-- TABLA: quadrant_results
-- Resumen precalculado de puntajes por cuadrante Herrmann
-- para cada sesión (evita recalcular siempre desde answers).
-- Se upsertea al completar la sesión.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quadrant_results (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL UNIQUE REFERENCES test_sessions(id) ON DELETE CASCADE,
  quad_a_selected  INTEGER NOT NULL DEFAULT 0,
  quad_a_total     INTEGER NOT NULL DEFAULT 0,
  quad_b_selected  INTEGER NOT NULL DEFAULT 0,
  quad_b_total     INTEGER NOT NULL DEFAULT 0,
  quad_c_selected  INTEGER NOT NULL DEFAULT 0,
  quad_c_total     INTEGER NOT NULL DEFAULT 0,
  quad_d_selected  INTEGER NOT NULL DEFAULT 0,
  quad_d_total     INTEGER NOT NULL DEFAULT 0,
  calculated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: activity_completions
-- Registra si el participante completó o saltó cada actividad
-- interactiva asociada a una pregunta.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_completions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id   INTEGER NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  activity_type TEXT NOT NULL,
  skipped       BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (session_id, question_id)
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_test_sessions_participant ON test_sessions(participant_id);
CREATE INDEX IF NOT EXISTS idx_answers_session           ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question          ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_quadrant          ON answers(quadrant);
CREATE INDEX IF NOT EXISTS idx_activity_session          ON activity_completions(session_id);

-- ============================================================
-- DIAGRAMA DE RELACIONES (comentario)
-- ============================================================
--
--  participants ──< test_sessions ──< answers
--                       │                └── questions
--                       │
--                       ├──< quadrant_results
--                       │
--                       └──< activity_completions ──── questions
--
-- ============================================================
