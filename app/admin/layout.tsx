import { IconHome, IconQuestionMark } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';

const ADMIN_DASHBOARD_LINKS: Array<NavLink> = [
  {
    href: '/admin',
    label: 'Overview',
    icon: <IconHome />,
  },
  {
    href: '/admin/qa',
    label: 'Q&A',
    icon: <IconQuestionMark />,
  },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell links={ADMIN_DASHBOARD_LINKS}>{children}</AppShell>;
}
