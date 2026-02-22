import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { session, role, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-brand-primary"></div>
            </div>
        );
    }

    if (!session) {
        // Redirect to login but save the attempted url
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
        // Authenticated but unauthorized
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
                </div>
                <h1 className="font-display text-4xl font-bold">Access Denied</h1>
                <p className="mt-4 max-w-md text-lg text-muted-foreground">
                    You do not have permission to view this page. If you believe this is an error, please contact the site administrator.
                </p>
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="rounded-md border border-input bg-background px-4 py-2 hover:bg-muted"
                    >
                        Go Back
                    </button>
                    <a href="/" className="rounded-md bg-brand-primary px-4 py-2 text-white hover:bg-brand-primary/90">
                        View Homepage
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
