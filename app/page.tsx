import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to sign-in page as the main entry point
  redirect('/sign-in');
}
