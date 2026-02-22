import { Link } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuditLogs, usePendingReviews } from '@/hooks/useDashboardWidgets';
import { formatRelativeTime } from '@/lib/utils';
import {
    FileText,
    Eye,
    Clock,
    CheckCircle,
    Plus,
    UploadCloud,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
    const { stats, isLoading: isLoadingStats } = useDashboardStats();
    const { logs, isLoading: isLoadingLogs } = useAuditLogs(8);
    const { stories: pending, isLoading: isLoadingPending } = usePendingReviews();

    return (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <Button asChild size="lg" className="gap-2">
                    <Link to="/admin/stories/new">
                        <Plus className="h-5 w-5" />
                        New Story
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/admin/import">
                        <UploadCloud className="h-5 w-5" />
                        Import from URL
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Published"
                    value={stats.totalStories}
                    icon={FileText}
                    isLoading={isLoadingStats}
                />
                <StatCard
                    title="Published This Month"
                    value={stats.monthStories}
                    icon={CheckCircle}
                    isLoading={isLoadingStats}
                />
                <StatCard
                    title="Pending Review"
                    value={stats.pendingDrafts}
                    icon={Clock}
                    isLoading={isLoadingStats}
                    alert={stats.pendingDrafts > 0}
                />
                <StatCard
                    title="Views This Month"
                    value={stats.monthViews.toLocaleString()}
                    icon={Eye}
                    isLoading={isLoadingStats}
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Pending Reviews Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold font-display">Pending Reviews</h2>
                        <Button variant="ghost" size="sm" asChild className="gap-2">
                            <Link to="/admin/stories?status=review">
                                View all <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        {isLoadingPending ? (
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : pending.length > 0 ? (
                            <div className="divide-y divide-border">
                                {pending.map((story) => (
                                    <div key={story.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate" title={story.title}>{story.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Submitted by {story.authors?.name || 'Unknown Author'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button variant="outline" size="sm">
                                                Request Changes
                                            </Button>
                                            <Button size="sm">
                                                Approve & Publish
                                            </Button>
                                            <Button variant="secondary" size="sm" asChild>
                                                <Link to={`/admin/stories/${story.id}/edit`}>Review</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-brand-primary/50" />
                                <p className="font-medium">All caught up!</p>
                                <p className="text-sm">No stories are currently awaiting review.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Log / Recent Activity */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold font-display">Recent Activity</h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
                        {isLoadingLogs ? (
                            <div className="space-y-6">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="h-3 w-3 mt-1.5 rounded-full shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : logs.length > 0 ? (
                            <div className="relative border-l border-border/50 ml-3 space-y-8 pb-4">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-6">
                                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-brand-primary ring-4 ring-card" />
                                        <p className="text-sm text-foreground">
                                            <span className="font-semibold">{log.user?.email || 'System'}</span>
                                            {' '}
                                            <span className="text-muted-foreground">{formatAction(log.action)}</span>
                                            {' '}
                                            <span className="font-medium truncate block sm:inline">{log.description || log.entity_type}</span>
                                        </p>
                                        <time className="text-xs text-muted-foreground mt-1 block">
                                            {formatRelativeTime(log.created_at)}
                                        </time>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No recent activity recorded.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ title, value, icon: Icon, isLoading, alert }: any) {
    return (
        <div className={`rounded-xl border bg-card p-6 shadow-sm transition-shadow ${alert ? 'border-amber-500/50' : 'border-border'}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-muted-foreground text-sm">{title}</h3>
                <Icon className={`h-5 w-5 ${alert ? 'text-amber-500' : 'text-brand-primary/70'}`} />
            </div>
            <div className="mt-4">
                {isLoading ? (
                    <Skeleton className="h-10 w-20" />
                ) : (
                    <p className={`text-4xl font-bold font-display ${alert && value > 0 ? 'text-amber-500' : 'text-foreground'}`}>
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

function formatAction(action: string) {
    // Basic humanizer for common audit actions
    const map: Record<string, string> = {
        'CREATE': 'created',
        'UPDATE': 'updated',
        'DELETE': 'deleted',
        'PUBLISH': 'published',
        'ARCHIVE': 'archived',
        'LOGIN': 'logged in to'
    };
    return map[action] || action.toLowerCase();
}
