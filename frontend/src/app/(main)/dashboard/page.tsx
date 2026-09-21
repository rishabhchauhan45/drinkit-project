import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Since we are mapping the regular user Dashboard to their Profile,
  // we redirect them smoothly.
  redirect('/profile');
}
