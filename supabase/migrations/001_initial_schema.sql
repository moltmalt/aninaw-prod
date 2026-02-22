-- ============================================================
-- Aninaw Productions — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────

CREATE TYPE story_status AS ENUM (
  'draft',
  'review',
  'published',
  'archived',
  'scheduled'
);

CREATE TYPE story_category AS ENUM (
  'news',
  'feature',
  'opinion',
  'explainer',
  'investigative',
  'multimedia'
);

CREATE TYPE social_origin AS ENUM (
  'facebook',
  'youtube',
  'instagram',
  'manual'
);

CREATE TYPE media_embed_type AS ENUM (
  'youtube',
  'facebook_video',
  'facebook_reel',
  'facebook_post',
  'soundcloud',
  'instagram',
  'pdf',
  'gallery'
);

CREATE TYPE language AS ENUM (
  'filipino',
  'english'
);

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'editor',
  'contributor'
);

-- ────────────────────────────────────────────────────────────
-- 2. TABLES
-- ────────────────────────────────────────────────────────────

-- User roles (linked to Supabase auth.users)
CREATE TABLE user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       user_role NOT NULL DEFAULT 'contributor',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Authors (public contributor profiles)
CREATE TABLE authors (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  slug             text NOT NULL UNIQUE,
  bio              text,
  avatar_url       text,
  role_title       text,
  email            text,
  social_facebook  text,
  social_twitter   text,
  social_instagram text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Series (multi-part story collections)
CREATE TABLE series (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  description     text,
  cover_image_url text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Stories (the core content table)
CREATE TABLE stories (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                  text NOT NULL,
  slug                   text NOT NULL UNIQUE,
  excerpt                text,
  body                   text NOT NULL DEFAULT '',
  category               story_category NOT NULL DEFAULT 'news',
  status                 story_status NOT NULL DEFAULT 'draft',
  author_id              uuid NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
  cover_image_url        text,
  cover_image_alt        text,
  cover_image_caption    text,
  cover_focal_point      jsonb DEFAULT '{"x": 0.5, "y": 0.5}'::jsonb,
  published_at           timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  is_featured            boolean NOT NULL DEFAULT false,
  is_breaking            boolean NOT NULL DEFAULT false,
  view_count             integer NOT NULL DEFAULT 0,
  reading_time_minutes   integer,
  series_id              uuid REFERENCES series(id) ON DELETE SET NULL,
  correction_notice      text,
  seo_title              text,
  seo_description        text,
  canonical_url          text,
  social_origin          social_origin NOT NULL DEFAULT 'manual',
  social_origin_url      text,
  language               language NOT NULL DEFAULT 'english'
);

-- Tags
CREATE TABLE tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Story ↔ Tags (many-to-many)
CREATE TABLE story_tags (
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  tag_id   uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, tag_id)
);

-- Story ↔ Related Stories (many-to-many, self-referencing)
CREATE TABLE story_related (
  story_id         uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  related_story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, related_story_id),
  CHECK (story_id <> related_story_id)
);

-- Media Embeds (ordered per story)
CREATE TABLE media_embeds (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id               uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  type                   media_embed_type NOT NULL,
  embed_url              text,
  embed_id               text,
  caption                text,
  thumbnail_override_url text,
  position               integer NOT NULL DEFAULT 0
);

-- Story Revisions (full snapshot history)
CREATE TABLE story_revisions (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id  uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  snapshot  jsonb NOT NULL,
  saved_by  uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  saved_at  timestamptz NOT NULL DEFAULT now()
);

-- Editorial Notes (internal discussion per story)
CREATE TABLE editorial_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id   uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Audit Log
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   uuid,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  is_active     boolean NOT NULL DEFAULT true
);

-- Site Settings (key-value config store)
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX idx_stories_slug          ON stories (slug);
CREATE INDEX idx_stories_status        ON stories (status);
CREATE INDEX idx_stories_category      ON stories (category);
CREATE INDEX idx_stories_published_at  ON stories (published_at DESC NULLS LAST);
CREATE INDEX idx_stories_is_featured   ON stories (is_featured)  WHERE is_featured = true;
CREATE INDEX idx_stories_is_breaking   ON stories (is_breaking)  WHERE is_breaking = true;
CREATE INDEX idx_stories_author_id     ON stories (author_id);
CREATE INDEX idx_stories_series_id     ON stories (series_id)    WHERE series_id IS NOT NULL;
CREATE INDEX idx_story_tags_tag_id     ON story_tags (tag_id);
CREATE INDEX idx_media_embeds_story    ON media_embeds (story_id, position);
CREATE INDEX idx_story_revisions_story ON story_revisions (story_id, saved_at DESC);
CREATE INDEX idx_editorial_notes_story ON editorial_notes (story_id, created_at DESC);
CREATE INDEX idx_audit_log_entity      ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_log_user        ON audit_log (user_id, created_at DESC);

-- ────────────────────────────────────────────────────────────
-- 4. FUNCTIONS
-- ────────────────────────────────────────────────────────────

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_editorial_notes_updated_at
  BEFORE UPDATE ON editorial_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Safe atomic view count increment
CREATE OR REPLACE FUNCTION increment_view_count(p_story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET view_count = view_count + 1
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

-- Enable RLS on all content tables
ALTER TABLE stories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE series               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_related        ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_embeds         ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_revisions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_notes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log            ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles           ENABLE ROW LEVEL SECURITY;

-- ── Helper: check if current user has a given role ──
CREATE OR REPLACE FUNCTION auth_has_role(required_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
      AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper: check if current user is editor or super_admin
CREATE OR REPLACE FUNCTION auth_is_editor_or_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
      AND role IN ('editor', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── STORIES ──

-- Public: anyone can read published stories
CREATE POLICY stories_public_read ON stories
  FOR SELECT
  USING (status = 'published');

-- Authenticated: can read all stories (drafts, review, archived, scheduled)
CREATE POLICY stories_auth_read ON stories
  FOR SELECT TO authenticated
  USING (true);

-- Authenticated: can insert stories
CREATE POLICY stories_auth_insert ON stories
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Authenticated: can update stories (but publishing restricted below)
CREATE POLICY stories_auth_update ON stories
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (
    -- If setting status to 'published', user must be editor or super_admin
    CASE
      WHEN status = 'published' AND OLD.status IS DISTINCT FROM 'published'
        THEN auth_is_editor_or_admin()
      ELSE true
    END
  );

-- Authenticated: can delete stories
CREATE POLICY stories_auth_delete ON stories
  FOR DELETE TO authenticated
  USING (auth_is_editor_or_admin());

-- ── AUTHORS (public read, admin write) ──

CREATE POLICY authors_public_read ON authors
  FOR SELECT USING (true);

CREATE POLICY authors_auth_manage ON authors
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── SERIES (public read, admin write) ──

CREATE POLICY series_public_read ON series
  FOR SELECT USING (true);

CREATE POLICY series_auth_manage ON series
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── TAGS (public read, admin write) ──

CREATE POLICY tags_public_read ON tags
  FOR SELECT USING (true);

CREATE POLICY tags_auth_manage ON tags
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── STORY_TAGS (follows story visibility) ──

CREATE POLICY story_tags_public_read ON story_tags
  FOR SELECT USING (true);

CREATE POLICY story_tags_auth_manage ON story_tags
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── STORY_RELATED ──

CREATE POLICY story_related_public_read ON story_related
  FOR SELECT USING (true);

CREATE POLICY story_related_auth_manage ON story_related
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── MEDIA_EMBEDS ──

CREATE POLICY media_embeds_public_read ON media_embeds
  FOR SELECT USING (true);

CREATE POLICY media_embeds_auth_manage ON media_embeds
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── STORY_REVISIONS (auth only) ──

CREATE POLICY revisions_auth_read ON story_revisions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY revisions_auth_insert ON story_revisions
  FOR INSERT TO authenticated WITH CHECK (true);

-- ── EDITORIAL_NOTES (auth only) ──

CREATE POLICY notes_auth_all ON editorial_notes
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── AUDIT_LOG (auth only, insert for all, read for admins) ──

CREATE POLICY audit_auth_insert ON audit_log
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY audit_admin_read ON audit_log
  FOR SELECT TO authenticated
  USING (auth_is_editor_or_admin());

-- ── NEWSLETTER_SUBSCRIBERS ──

-- Anyone can insert (subscribe)
CREATE POLICY newsletter_public_insert ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY newsletter_admin_read ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (auth_is_editor_or_admin());

CREATE POLICY newsletter_admin_update ON newsletter_subscribers
  FOR UPDATE TO authenticated
  USING (auth_is_editor_or_admin());

-- ── SITE_SETTINGS (public read, admin write) ──

CREATE POLICY settings_public_read ON site_settings
  FOR SELECT USING (true);

CREATE POLICY settings_admin_manage ON site_settings
  FOR ALL TO authenticated
  USING (auth_is_editor_or_admin())
  WITH CHECK (auth_is_editor_or_admin());

-- ── USER_ROLES (admin only) ──

CREATE POLICY user_roles_self_read ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY user_roles_admin_manage ON user_roles
  FOR ALL TO authenticated
  USING (auth_has_role('super_admin'))
  WITH CHECK (auth_has_role('super_admin'));
