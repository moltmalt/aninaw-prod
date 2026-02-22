// ── Story Status ──
export type StoryStatus = 'draft' | 'review' | 'published' | 'archived';

// ── Story Category ──
export type StoryCategory =
    | 'news'
    | 'feature'
    | 'opinion'
    | 'investigation'
    | 'culture'
    | 'community'
    | 'multimedia'
    | 'editorial';

// ── User Role ──
export type UserRole = 'admin' | 'editor' | 'writer' | 'contributor';

// ── Author ──
export interface Author {
    id: string;
    email: string;
    full_name: string;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ── Tag ──
export interface Tag {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
}

// ── Series ──
export interface Series {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_image_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ── Media Embed ──
export interface MediaEmbed {
    id: string;
    story_id: string;
    type: 'youtube' | 'facebook' | 'twitter' | 'image' | 'audio';
    url: string;
    caption: string | null;
    position: number;
    created_at: string;
}

// ── Story ──
export interface Story {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    excerpt: string | null;
    body: string;
    cover_image_url: string | null;
    cover_image_caption: string | null;
    category: StoryCategory;
    status: StoryStatus;
    is_featured: boolean;
    is_breaking: boolean;
    author_id: string;
    author?: Author;
    series_id: string | null;
    series?: Series;
    tags?: Tag[];
    media_embeds?: MediaEmbed[];
    reading_time: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
}

// ── Audit Log ──
export interface AuditLog {
    id: string;
    user_id: string;
    user?: Author;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

// ── Newsletter Subscriber ──
export interface NewsletterSubscriber {
    id: string;
    email: string;
    full_name: string | null;
    is_active: boolean;
    subscribed_at: string;
    unsubscribed_at: string | null;
}

// ── Database Types (for Supabase typed client) ──
export interface Database {
    public: {
        Tables: {
            stories: {
                Row: Story;
                Insert: Omit<Story, 'id' | 'created_at' | 'updated_at' | 'author' | 'series' | 'tags' | 'media_embeds'>;
                Update: Partial<Omit<Story, 'id' | 'created_at' | 'updated_at' | 'author' | 'series' | 'tags' | 'media_embeds'>>;
            };
            authors: {
                Row: Author;
                Insert: Omit<Author, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Author, 'id' | 'created_at' | 'updated_at'>>;
            };
            tags: {
                Row: Tag;
                Insert: Omit<Tag, 'id' | 'created_at'>;
                Update: Partial<Omit<Tag, 'id' | 'created_at'>>;
            };
            series: {
                Row: Series;
                Insert: Omit<Series, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Series, 'id' | 'created_at' | 'updated_at'>>;
            };
            media_embeds: {
                Row: MediaEmbed;
                Insert: Omit<MediaEmbed, 'id' | 'created_at'>;
                Update: Partial<Omit<MediaEmbed, 'id' | 'created_at'>>;
            };
            audit_logs: {
                Row: AuditLog;
                Insert: Omit<AuditLog, 'id' | 'created_at' | 'user'>;
                Update: Partial<Omit<AuditLog, 'id' | 'created_at' | 'user'>>;
            };
            newsletter_subscribers: {
                Row: NewsletterSubscriber;
                Insert: Omit<NewsletterSubscriber, 'id' | 'subscribed_at'>;
                Update: Partial<Omit<NewsletterSubscriber, 'id' | 'subscribed_at'>>;
            };
        };
    };
}
