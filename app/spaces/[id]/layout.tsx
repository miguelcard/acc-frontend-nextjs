import AuthenticatedLayout from '@/components/shared/AuthenticatedLayout/authenticated-layout';

export default function SingleSpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </>
    );
}
