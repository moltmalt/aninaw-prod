import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SidebarMetadata() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div>
                <h3 className="text-lg font-bold font-display tracking-tight mb-4">Story Settings</h3>
                <div className="space-y-5">

                    {/* Status */}
                    <FormField
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status & Visibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft (Hidden)</SelectItem>
                                        <SelectItem value="review">Pending Review</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category */}
                    <FormField
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="news">News</SelectItem>
                                        <SelectItem value="feature">Feature</SelectItem>
                                        <SelectItem value="opinion">Opinion</SelectItem>
                                        <SelectItem value="explainer">Explainer</SelectItem>
                                        <SelectItem value="investigative">Investigative</SelectItem>
                                        <SelectItem value="multimedia">Multimedia</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Author Mapping - Simplification for UI */}
                    <FormField
                        control={control}
                        name="author_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Primary Author ID</FormLabel>
                                <FormControl>
                                    {/* In a real app, this would be an async combobox searching the authors table */}
                                    <Input placeholder="a1000000-..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Series Mapping */}
                    <FormField
                        control={control}
                        name="series_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Series ID (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="b1000000-..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="h-px bg-border my-4" />

                    <h4 className="font-semibold text-sm">Media</h4>

                    {/* Cover Image */}
                    <FormField
                        control={control}
                        name="cover_image_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="cover_image_alt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alt Text</FormLabel>
                                <FormControl>
                                    <Input placeholder="Describe the image..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="cover_image_caption"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caption</FormLabel>
                                <FormControl>
                                    <Input placeholder="Image credit / caption..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="h-px bg-border my-4" />

                    <h4 className="font-semibold text-sm">SEO & Social</h4>

                    <FormField
                        control={control}
                        name="seo_title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Optional override..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="social_origin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Origin</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Content Origin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="manual">Manual Entry</SelectItem>
                                        <SelectItem value="facebook">Imported from Facebook</SelectItem>
                                        <SelectItem value="youtube">Imported from YouTube</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
