// ── Story Status ──
export type StoryStatus = 'draft' | 'review' | 'published' | 'archived' | 'scheduled';

// ── Story Category ──
export type StoryCategory =
    | 'news'
    | 'feature'
    | 'opinion'
    | 'explainer'
    | 'investigative'
    | 'multimedia';

// ── Social Origin ──
export type SocialOrigin = 'facebook' | 'youtube' | 'instagram' | 'manual';

// ── Media Embed Type ──
export type MediaEmbedType =
    | 'youtube'
    | 'facebook_video'
    | 'facebook_reel'
    | 'facebook_post'
    | 'soundcloud'
    | 'instagram'
    | 'pdf'
    | 'gallery';

// ── Language ──
export type Language = 'filipino' | 'english';

// ── User Role ──
export type UserRole = 'super_admin' | 'editor' | 'contributor';

// ── Author ──
export interface Author {
    id: string;
    name: string;
    slug: string;
    bio: string | null;
    avatar_url: string | null;
    role_title: string | null;
    email: string | null;
    social_facebook: string | null;
    social_twitter: string | null;
    social_instagram: string | null;
    created_at: string;
}

// ── Series ──
export interface Series {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_image_url: string | null;
    created_at: string;
}

// ── Tag ──
export interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

// ── Media Embed ──
export interface MediaEmbed {
    id: string;
    story_id: string;
    type: MediaEmbedType;
    embed_url: string | null;
    embed_id: string | null;
    caption: string | null;
    thumbnail_override_url: string | null;
    position: number;
}

// ── Cover Focal Point ──
export interface CoverFocalPoint {
    x: number;
    y: number;
}

// ── Story ──
export interface Story {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    category: StoryCategory;
    status: StoryStatus;
    author_id: string;
    author?: Author;
    cover_image_url: string | null;
    cover_image_alt: string | null;
    cover_image_caption: string | null;
    cover_focal_point: CoverFocalPoint;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    is_featured: boolean;
    is_breaking: boolean;
    view_count: number;
    reading_time_minutes: number | null;
    series_id: string | null;
    series?: Series;
    tags?: Tag[];
    media_embeds?: MediaEmbed[];
    correction_notice: string | null;
    seo_title: string | null;
    seo_description: string | null;
    canonical_url: string | null;
    social_origin: SocialOrigin;
    social_origin_url: string | null;
    language: Language;
}

// ── Story Tag (join table) ──
export interface StoryTag {
    story_id: string;
    tag_id: string;
}

// ── Story Related (join table) ──
export interface StoryRelated {
    story_id: string;
    related_story_id: string;
}

// ── Story Revision ──
export interface StoryRevision {
    id: string;
    story_id: string;
    snapshot: Record<string, unknown>;
    saved_by: string;
    saved_at: string;
}

// ── Editorial Note ──
export interface EditorialNote {
    id: string;
    story_id: string;
    author_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

// ── Audit Log ──
export interface AuditLog {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string;
    entity_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

// ── Newsletter Subscriber ──
export interface NewsletterSubscriber {
    id: string;
    email: string;
    subscribed_at: string;
    is_active: boolean;
}

// ── Site Settings ──
export interface SiteSetting {
    key: string;
    value: unknown;
    updated_at: string;
}

// ── User Role Record ──
export interface UserRoleRecord {
    id: string;
    user_id: string;
    role: UserRole;
    created_at: string;
}

// ── Database Types (for Supabase typed client) ──
export interface Database {
    public: {
        Tables: {
            stories: {
                Row: Story;
                Insert: Omit<Story, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'author' | 'series' | 'tags' | 'media_embeds'>;
                Update: Partial<Omit<Story, 'id' | 'created_at' | 'updated_at' | 'author' | 'series' | 'tags' | 'media_embeds'>>;
            };
            authors: {
                Row: Author;
                Insert: Omit<Author, 'id' | 'created_at'>;
                Update: Partial<Omit<Author, 'id' | 'created_at'>>;
            };
            tags: {
                Row: Tag;
                Insert: Omit<Tag, 'id' | 'created_at'>;
                Update: Partial<Omit<Tag, 'id' | 'created_at'>>;
            };
            series: {
                Row: Series;
                Insert: Omit<Series, 'id' | 'created_at'>;
                Update: Partial<Omit<Series, 'id' | 'created_at'>>;
            };
            media_embeds: {
                Row: MediaEmbed;
                Insert: Omit<MediaEmbed, 'id'>;
                Update: Partial<Omit<MediaEmbed, 'id'>>;
            };
            story_tags: {
                Row: StoryTag;
                Insert: StoryTag;
                Update: Partial<StoryTag>;
            };
            story_related: {
                Row: StoryRelated;
                Insert: StoryRelated;
                Update: Partial<StoryRelated>;
            };
            story_revisions: {
                Row: StoryRevision;
                Insert: Omit<StoryRevision, 'id' | 'saved_at'>;
                Update: Partial<Omit<StoryRevision, 'id' | 'saved_at'>>;
            };
            editorial_notes: {
                Row: EditorialNote;
                Insert: Omit<EditorialNote, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<EditorialNote, 'id' | 'created_at' | 'updated_at'>>;
            };
            audit_log: {
                Row: AuditLog;
                Insert: Omit<AuditLog, 'id' | 'created_at'>;
                Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
            };
            newsletter_subscribers: {
                Row: NewsletterSubscriber;
                Insert: Omit<NewsletterSubscriber, 'id' | 'subscribed_at'> & { is_active?: boolean };
                Update: Partial<Omit<NewsletterSubscriber, 'id' | 'subscribed_at'>>;
            };
            site_settings: {
                Row: SiteSetting;
                Insert: SiteSetting;
                Update: Partial<SiteSetting>;
            };
            user_roles: {
                Row: UserRoleRecord;
                Insert: Omit<UserRoleRecord, 'id' | 'created_at'>;
                Update: Partial<Omit<UserRoleRecord, 'id' | 'created_at'>>;
            };
        };
    };
}
