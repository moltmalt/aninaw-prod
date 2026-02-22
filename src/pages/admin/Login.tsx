import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const { signIn, session, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If already logged in, redirect to admin or the intended destination
    if (session) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const from = (location.state as any)?.from?.pathname || '/admin';
        return <Navigate to={from} replace />;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-brand-primary"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            setIsSubmitting(true);
            await signIn(email, password);
            // Redirection is handled automatically by the authState change listener in the store 
            // paired with the ProtectedRoutes/session check above, but we can double check here
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const from = (location.state as any)?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border">
                <div className="text-center">
                    <a href="/" className="inline-block outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm mb-6">
                        <span className="font-display text-4xl font-bold italic tracking-tighter text-foreground hover:text-brand-primary transition-colors">
                            Aninaw.
                        </span>
                    </a>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Portal Access
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in with your editor or admin credentials.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full bg-background mt-1"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full bg-background mt-1 pr-10"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-base py-5"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In to Admin Portal"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
                    Access is strictly limited to authorized personnel. <br />
                    Return to <a href="/" className="text-brand-primary hover:underline font-medium">public site</a>.
                </div>
            </div>
        </div>
    );
}
