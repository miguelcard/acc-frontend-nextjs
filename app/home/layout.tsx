

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <h2>Layout Title</h2>
            {children}
        </>
    );
}