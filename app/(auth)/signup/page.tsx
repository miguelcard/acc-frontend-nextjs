/**
 * Signup page — currently redirects to /spaces.
 * Firebase anonymous auth handles authentication automatically.
 * Original UI is preserved in page.original.tsx.bak for future account linking.
 */
import { redirect } from 'next/navigation';

export default function SignUp() {
    redirect('/spaces');
}
