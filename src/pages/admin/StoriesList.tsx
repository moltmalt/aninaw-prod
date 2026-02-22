import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import type { RowSelectionState } from '@tanstack/react-table';
import { useAdminStoriesData } from '@/hooks/useAdminStoriesData';
import type { AdminStoriesFilters } from '@/hooks/useAdminStoriesData';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Search, Settings, Edit, Copy, Trash, Archive } from 'lucide-react';
import type { Story } from '@/types';

const columnHelper = createColumnHelper<Story>();

export default function StoriesList() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters State
    const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<AdminStoriesFilters>({
        query: searchParams.get('q') || '',
        status: searchParams.get('status') || 'all',
        category: searchParams.get('category') || 'all',
        authorId: searchParams.get('author_id') || 'all'
    });

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.query !== queryInput) {
                setFilters(prev => ({ ...prev, query: queryInput }));
                setPage(1);

                const params = new URLSearchParams(searchParams);
                if (queryInput) params.set('q', queryInput);
                else params.delete('q');
                setSearchParams(params, { replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [queryInput, filters.query, searchParams, setSearchParams]);

    // Data Fetching
    const {
        stories,
        totalCount,
        totalPages,
        isLoading,
        error
    } = useAdminStoriesData(filters, page);

    // Columns Definition
    const columns = [
        columnHelper.display({
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
        }),
        columnHelper.accessor('title', {
            header: 'Story',
            cell: info => (
                <div className="flex flex-col min-w-[300px]">
                    <Link to={`/admin/stories/${info.row.original.id}/edit`} className="font-semibold hover:text-brand-primary truncate max-w-[400px]">
                        {info.getValue()}
                    </Link>
                    <span className="text-xs text-muted-foreground mt-1 truncate max-w-[400px]">
                        /{info.row.original.slug}
                    </span>
                </div>
            )
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => {
                const status = info.getValue() as string;
                let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
                if (status === 'published') variant = 'default';
                if (status === 'draft') variant = 'secondary';
                if (status === 'archived') variant = 'destructive';
                return <Badge variant={variant} className="capitalize">{status}</Badge>;
            }
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            cell: info => <span className="capitalize text-sm">{info.getValue() as string}</span>
        }),
        columnHelper.accessor('created_at', {
            header: 'Created',
            cell: info => <span className="text-sm text-muted-foreground">{formatRelativeTime(info.getValue() as string)}</span>
        }),
        columnHelper.display({
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link to={`/admin/stories/${row.original.id}/edit`} className="w-full cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-amber-600">
                            <Archive className="mr-2 h-4 w-4" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }),
    ];

    const table = useReactTable({
        data: stories,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    });

    const selectedCount = Object.keys(rowSelection).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Stories</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage articles, news, and features.</p>
                </div>
                <Button asChild size="lg" className="gap-2 shrink-0">
                    <Link to="/admin/stories/new">
                        <Plus className="h-5 w-5" />
                        New Story
                    </Link>
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search stories by title or slug..."
                        className="pl-9 bg-background"
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        className="flex h-10 w-full sm:w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                        value={filters.status}
                        onChange={(e) => {
                            setFilters(prev => ({ ...prev, status: e.target.value }));
                            setPage(1);
                        }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                        <option value="review">In Review</option>
                        <option value="archived">Archived</option>
                    </select>

                    <select
                        className="flex h-10 w-full sm:w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                        value={filters.category}
                        onChange={(e) => {
                            setFilters(prev => ({ ...prev, category: e.target.value }));
                            setPage(1);
                        }}
                    >
                        <option value="all">All Categories</option>
                        <option value="news">News</option>
                        <option value="feature">Feature</option>
                        <option value="opinion">Opinion</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedCount > 0 && (
                <div className="flex items-center justify-between bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-medium text-brand-primary">
                        {selectedCount} stor{selectedCount === 1 ? 'y' : 'ies'} selected
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-background">Assign Category</Button>
                        <Button variant="outline" size="sm" className="bg-background text-amber-600 border-amber-200 hover:bg-amber-50">Archive</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-brand-primary"></div>
                                        <p className="text-sm text-muted-foreground">Loading stories...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64 text-center text-red-500">
                                    Failed to load stories: {error.message}
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Settings className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                        <p className="font-medium text-foreground">No stories found.</p>
                                        <p className="text-sm text-muted-foreground">{queryInput ? 'Try clearing your search query.' : 'Click "New Story" to get started.'}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">
                        Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalCount)} of {totalCount} stories
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm px-4">
                            Page <strong className="font-medium">{page}</strong> of <strong className="font-medium">{totalPages}</strong>
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
