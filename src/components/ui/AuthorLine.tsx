import { User } from 'lucide-react';
import type { Story } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';

interface AuthorLineProps {
    story: Story;
    className?: string;
    showAvatar?: boolean;
}

export function AuthorLine({ story, className, showAvatar = true }: AuthorLineProps) {
    // Supabase FK join returns author under `authors` alias
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const author = (story as any).authors ?? story.author;

    return (
        <div className={cn('flex items-center gap-2 text-xs', className)}>
            {showAvatar && (
                (author as { avatar_url?: string })?.avatar_url ? (
                    <img
                        src={(author as { avatar_url: string }).avatar_url}
                        alt=""
                        className="h-5 w-5 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted shrink-0">
                        <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                )
            )}
            <span className="font-medium truncate">{(author as { name?: string })?.name ?? 'Staff'}</span>
            {story.published_at && (
                <>
                    <span className="text-muted-foreground/60 shrink-0">·</span>
                    <span className="text-muted-foreground shrink-0">{formatRelativeTime(story.published_at)}</span>
                </>
            )}
        </div>
    );
}
