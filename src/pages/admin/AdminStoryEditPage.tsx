import { useParams } from 'react-router-dom';

export default function AdminStoryEditPage() {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h2 className="text-2xl font-semibold">Edit Story</h2>
            <p className="mt-2 text-muted-foreground">Editing story {id}</p>
        </div>
    );
}
