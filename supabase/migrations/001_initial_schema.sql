-- ====================================================================
-- TWO OF US: Production Database Schema & Row Level Security Setup
-- ====================================================================
-- Safe for first-time execution in Supabase SQL Editor.
-- Idempotent: can be executed multiple times without errors.

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile_number TEXT UNIQUE NOT NULL,
    instagram_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    terms_accepted BOOLEAN NOT NULL DEFAULT true,
    terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    marketing_opt_out BOOLEAN NOT NULL DEFAULT false,
    questionnaire_completed BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_participants_mobile ON public.participants (mobile_number);

-- 3. Questionnaire Answers Table
CREATE TABLE IF NOT EXISTS public.questionnaire_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    selected_option TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_participant ON public.questionnaire_answers (participant_id);

-- 4. Bingo Boards Table
CREATE TABLE IF NOT EXISTS public.bingo_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID UNIQUE NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    letters TEXT[] NOT NULL,
    completed_letters TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bingo_boards_participant ON public.bingo_boards (participant_id);

-- 5. Bingo Connections Table
-- NOTE: Selfies are stored locally on the user's phone, so selfie_url defaults to 'stored_on_user_device'
CREATE TABLE IF NOT EXISTS public.bingo_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    bingo_letter TEXT NOT NULL,
    person_name TEXT NOT NULL,
    selfie_url TEXT DEFAULT 'stored_on_user_device',
    random_question TEXT NOT NULL,
    question_answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_participant_letter UNIQUE(participant_id, bingo_letter)
);

CREATE INDEX IF NOT EXISTS idx_bingo_connections_participant ON public.bingo_connections (participant_id);

-- 6. Event Settings Table
CREATE TABLE IF NOT EXISTS public.event_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL DEFAULT 'Two of Us Live Event',
    event_status TEXT NOT NULL DEFAULT 'active',
    registration_enabled BOOLEAN NOT NULL DEFAULT true,
    bingo_enabled BOOLEAN NOT NULL DEFAULT true,
    event_start_time TIMESTAMPTZ,
    event_end_time TIMESTAMPTZ
);

-- Insert default event settings row if empty
INSERT INTO public.event_settings (event_name, event_status, registration_enabled, bingo_enabled)
SELECT 'Two of Us Live Event', 'active', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.event_settings LIMIT 1);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Idempotent: DROP POLICY IF EXISTS before CREATE POLICY prevents errors
-- ====================================================================

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bingo_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bingo_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- 1) Event Settings Policies
DROP POLICY IF EXISTS "Public can view event settings" ON public.event_settings;
CREATE POLICY "Public can view event settings" 
ON public.event_settings FOR SELECT USING (true);

-- 2) Participants Policies
DROP POLICY IF EXISTS "Anyone can register as a participant" ON public.participants;
CREATE POLICY "Anyone can register as a participant" 
ON public.participants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can view own profile" ON public.participants;
CREATE POLICY "Participants can view own profile" 
ON public.participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Participants can update own profile" ON public.participants;
CREATE POLICY "Participants can update own profile" 
ON public.participants FOR UPDATE USING (true);

-- 3) Questionnaire Answers Policies
DROP POLICY IF EXISTS "Anyone can insert questionnaire answers" ON public.questionnaire_answers;
CREATE POLICY "Anyone can insert questionnaire answers" 
ON public.questionnaire_answers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can view own questionnaire answers" ON public.questionnaire_answers;
CREATE POLICY "Participants can view own questionnaire answers" 
ON public.questionnaire_answers FOR SELECT USING (true);

-- 4) Bingo Boards Policies
DROP POLICY IF EXISTS "Participants can insert own board" ON public.bingo_boards;
CREATE POLICY "Participants can insert own board" 
ON public.bingo_boards FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can update own board" ON public.bingo_boards;
CREATE POLICY "Participants can update own board" 
ON public.bingo_boards FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Participants can view own board" ON public.bingo_boards;
CREATE POLICY "Participants can view own board" 
ON public.bingo_boards FOR SELECT USING (true);

-- 5) Bingo Connections Policies
DROP POLICY IF EXISTS "Participants can insert own connections" ON public.bingo_connections;
CREATE POLICY "Participants can insert own connections" 
ON public.bingo_connections FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can view own connections" ON public.bingo_connections;
CREATE POLICY "Participants can view own connections" 
ON public.bingo_connections FOR SELECT USING (true);

-- ====================================================================
-- OPTIONAL STORAGE BUCKET (Photos are kept on user phones, so bucket is optional)
-- Safe block: does not fail if storage schema permissions are restricted
-- ====================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('two-of-us-selfies', 'two-of-us-selfies', true)
        ON CONFLICT (id) DO NOTHING;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Non-fatal: selfies are saved to user phone storage directly
        NULL;
END $$;
