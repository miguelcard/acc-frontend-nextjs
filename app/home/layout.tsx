import AuthenticatedLayout from "@/components/shared/AuthenticatedLayout/authenticated-layout";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthenticatedLayout>
                {children}
            </AuthenticatedLayout>
        </>
    );
}