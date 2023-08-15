// see https://beta.nextjs.org/docs/api-reference/file-conventions/layout

// if you needed a layout only for the login page this would be it
export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section>
        <h2>layout header</h2>
        {children}
        <h2>layout footer</h2>
    </section>;
}