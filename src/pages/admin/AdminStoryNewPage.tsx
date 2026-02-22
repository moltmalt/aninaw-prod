import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { SidebarMetadata } from '@/components/editor/SidebarMetadata';
import { ArrowLeft, Save, Send } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
    slug: z.string().min(2, 'Slug required').max(200, 'Slug too long'),
    excerpt: z.string().max(500, 'Excerpt too long').optional().nullable(),
    body: z.string().min(10, 'Story body must be at least 10 characters'),
    category: z.enum(['news', 'feature', 'opinion', 'explainer', 'investigative', 'multimedia']),
    status: z.enum(['draft', 'review', 'published', 'archived', 'scheduled']),
    author_id: z.string().uuid('Must be a valid UUID'),
    series_id: z.string().uuid('Must be a valid UUID').optional().or(z.literal('')),
    cover_image_url: z.string().url().optional().or(z.literal('')),
    cover_image_alt: z.string().max(200).optional().nullable(),
    cover_image_caption: z.string().max(500).optional().nullable(),
    seo_title: z.string().max(100).optional().nullable(),
    social_origin: z.enum(['manual', 'facebook', 'youtube']),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminStoryNewPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Default form configuration
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            body: '',
            category: 'news',
            status: 'draft',
            author_id: '', // Would default to context user's author profile ID in a prod system
            series_id: '',
            cover_image_url: '',
            cover_image_alt: '',
            cover_image_caption: '',
            seo_title: '',
            social_origin: 'manual'
        },
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const onSubmit = async (data: FormValues) => {
        if (!user) return;
        setIsSaving(true);
        setError(null);

        try {
            // Data cleanup before inserting
            const insertData = {
                ...data,
                // Nullify empty UUIDs
                series_id: data.series_id || null,
                cover_image_url: data.cover_image_url || null,
                is_featured: false,
                is_breaking: false,
                reading_time_minutes: Math.ceil(data.body.split(' ').length / 200), // Simple estimation
                language: 'english' as const,
                published_at: data.status === 'published' ? new Date().toISOString() : null,
            };

            const { error: insertError } = await (supabase as any)
                .from('stories')
                .insert([insertData])
                .select()
                .single();

            if (insertError) throw insertError;

            // Optional: Handle tags and media embeds insertions here based on extended form data.

            // On success, redirect to the list view
            navigate('/admin/stories');
        } catch (err) {
            console.error("Failed to create story:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while saving the story.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24 max-w-7xl mx-auto">
                {/* Action Bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl border border-border bg-card/80 backdrop-blur-md p-4 shadow-sm mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/admin/stories')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold font-display">New Story</h1>
                            <p className="text-sm text-muted-foreground leading-none mt-1">
                                {form.watch('status') === 'draft' ? 'Draft saved locally.' : 'Unsaved changes.'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                form.setValue('status', 'draft');
                                form.handleSubmit(onSubmit)();
                            }}
                            disabled={isSaving}
                        >
                            <Save className="mr-2 h-4 w-4" /> Save Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                        >
                            <Send className="mr-2 h-4 w-4" /> Publish
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Editor Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Main Content Pane */}
                    <div className="lg:col-span-2 space-y-6">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Story Headline..."
                                            className="resize-none font-display text-4xl sm:text-5xl font-bold italic tracking-tighter border-0 p-0 focus-visible:ring-0 shadow-none min-h-[80px]"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                // Auto-generate slug if it hasn't been manually edited
                                                if (!form.formState.dirtyFields.slug) {
                                                    form.setValue('slug', generateSlug(e.target.value));
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center text-sm">
                                            <span className="text-muted-foreground mr-1 shrink-0">aninaw.com/story/</span>
                                            <CustomInput
                                                variant="ghost"
                                                className="h-8 px-2 font-mono text-muted-foreground max-w-md w-full focus-visible:ring-1"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a brief excerpt or summary (optional)..."
                                            className="resize-none text-xl text-muted-foreground border-0 border-l-4 border-brand-primary pl-4 p-0 rounded-none focus-visible:ring-0 shadow-none min-h-[60px]"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Rich Text Editor */}
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="lg:col-span-1">
                        <SidebarMetadata />
                    </div>

                </div>
            </form>
        </Form>
    );
}

// Temporary ghost input variant extension
const CustomInput = Input as React.FC<React.ComponentProps<typeof Input> & { variant?: 'ghost' }>;
