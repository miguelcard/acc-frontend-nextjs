import SingleSpaceClient from './space-page';
import SpaceMembersClient from './members-page';

/**
 * Catch-all route for /spaces/:id and /spaces/:id/members.
 * Required for Next.js static export (output: 'export') — dynamic [id]
 * routes need all values at build time. With [...slug] and a placeholder
 * in generateStaticParams, only /spaces/_/index.html is pre-rendered.
 * All real space pages are fully client-rendered via useParams().
 */
export function generateStaticParams() {
    return [{ slug: ['_'] }, { slug: ['_', 'members'] }];
}

export default async function SpaceCatchAllPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;

    // /spaces/:id/members → slug = ['73', 'members']
    if (slug.length === 2 && slug[1] === 'members') {
        return <SpaceMembersClient />;
    }

    // /spaces/:id → slug = ['73']
    return <SingleSpaceClient />;
}
