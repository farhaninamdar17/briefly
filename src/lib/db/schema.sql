-- ====================================================================
-- BRIEFLY: PostgreSQL Database Schema with Row Level Security (RLS)
-- Defense-in-depth authorization, explicit foreign keys, indexes, and audit logs
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMIN & ROLES
CREATE TYPE user_role_type AS ENUM ('USER', 'EDITOR', 'ADMIN');

CREATE TABLE IF NOT EXISTS admin_users (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'USER',
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOCATIONS & USER LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- CITY, STATE, COUNTRY, GLOBAL
    parent_id UUID REFERENCES locations(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_locations (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, location_id)
);

-- 5. TOPICS & USER TOPICS
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_topics (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_id)
);

-- 6. SOURCES & SOURCE ARTICLES
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    base_url TEXT NOT NULL,
    feed_url TEXT,
    feed_type TEXT NOT NULL DEFAULT 'RSS', -- RSS, API, OFFICIAL_CAP
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS source_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    external_id TEXT,
    title TEXT NOT NULL,
    content TEXT,
    original_url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_source_article UNIQUE (source_id, original_url)
);

-- 7. STORIES & STORY SOURCES
CREATE TYPE importance_level AS ENUM ('NORMAL', 'IMPORTANT', 'BREAKING', 'CRITICAL');

CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    what_happened TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    who_is_affected TEXT NOT NULL,
    what_happens_next TEXT NOT NULL,
    location_id UUID REFERENCES locations(id),
    topic_id UUID REFERENCES topics(id),
    importance importance_level DEFAULT 'NORMAL',
    is_developing BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    reading_time_minutes INT DEFAULT 2,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_sources (
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    external_url TEXT NOT NULL,
    reporting_angle TEXT,
    PRIMARY KEY (story_id, source_id, external_url)
);

-- 8. DEVELOPING STORY UPDATES
CREATE TABLE IF NOT EXISTS story_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    update_time TIMESTAMPTZ NOT NULL,
    event_description TEXT NOT NULL,
    source_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SHORT VIDEO BRIEFINGS
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_summary TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    location_id UUID REFERENCES locations(id),
    topic_id UUID REFERENCES topics(id),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_videos (
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    PRIMARY KEY (story_id, video_id)
);

-- 10. OFFICIAL DISASTER & EMERGENCY ALERTS
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authority TEXT NOT NULL,
    event TEXT NOT NULL,
    severity importance_level NOT NULL,
    area TEXT NOT NULL,
    instructions TEXT NOT NULL,
    original_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    source_type TEXT NOT NULL DEFAULT 'NDMA_SACHET',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS & PREFERENCES
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    push_enabled BOOLEAN DEFAULT TRUE,
    only_important_alerts BOOLEAN DEFAULT TRUE,
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TEXT DEFAULT '22:00',
    quiet_hours_end TEXT DEFAULT '07:00',
    briefing_mode TEXT DEFAULT 'read',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SAVED CONTENT & HISTORY
CREATE TABLE IF NOT EXISTS saved_stories (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, story_id)
);

CREATE TABLE IF NOT EXISTS saved_videos (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, video_id)
);

-- 13. DAILY BRIEFINGS
CREATE TABLE IF NOT EXISTS daily_briefings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    briefing_date DATE UNIQUE NOT NULL,
    title TEXT NOT NULL,
    estimated_minutes INT DEFAULT 5,
    audio_duration_seconds INT DEFAULT 300,
    content_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SECURITY & AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    result TEXT NOT NULL,
    metadata JSONB,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all user-sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view & update only their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. User Locations & Topics: Access only own preferences
CREATE POLICY "Users manage own locations" ON user_locations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own topics" ON user_topics
    FOR ALL USING (auth.uid() = user_id);

-- 3. Saved Content: Access only own saved items
CREATE POLICY "Users manage own saved stories" ON saved_stories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own saved videos" ON saved_videos
    FOR ALL USING (auth.uid() = user_id);

-- 4. Notification Preferences & User Notifications
CREATE POLICY "Users manage own notification preferences" ON user_notification_preferences
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users read own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- 5. Admin & Audit Logs: Only verified admins
CREATE POLICY "Only admins view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role = 'ADMIN'
        )
    );
