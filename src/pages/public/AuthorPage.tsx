import { useParams } from 'react-router-dom';

export default function AuthorPage() {
    const { slug } = useParams<{ slug: string }>();
    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold">Author: {slug}</h1>
            <p className="mt-2 text-muted-foreground">Author profile placeholder</p>
        </div>
    );
}
