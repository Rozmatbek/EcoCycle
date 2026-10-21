-- EcoCycle Supabase Schema Setup
-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Create Visitors Table (Har bir kirgan foydalanuvchi ma'lumotlari)
CREATE TABLE IF NOT EXISTS public.visitors (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    full_name TEXT DEFAULT 'Mehmon (Guest)',
    phone TEXT,
    role TEXT DEFAULT 'user',
    region TEXT,
    district TEXT,
    user_agent TEXT,
    device TEXT,
    current_page TEXT,
    is_authenticated BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Users Table (Ro'yxatdan o'tgan foydalanuvchilar)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    region TEXT,
    district TEXT,
    mahalla TEXT,
    street TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Feedbacks Table (Izohlar va savollar)
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    region TEXT,
    district TEXT,
    sent_to_email TEXT DEFAULT 'dasturlash85@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies to allow anonymous inserts from public client
CREATE POLICY "Allow public insert to visitors" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to visitors" ON public.visitors FOR SELECT USING (true);

CREATE POLICY "Allow public insert to users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public update to users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to feedbacks" ON public.feedbacks FOR SELECT USING (true);
