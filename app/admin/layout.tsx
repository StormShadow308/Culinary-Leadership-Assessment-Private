import { IconHome, IconQuestionMark, IconUsers, IconBuilding, IconSchool, IconUserCheck, IconClipboardList, IconFileText } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';

const ADMIN_DASHBOARD_LINKS: Array<NavLink> = [
  {
    href: '/admin',
    label: 'Overview',
    icon: <IconHome />,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: <IconUsers />,
  },
  {
    href: '/admin/organizations',
    label: 'Organizations',
    icon: <IconBuilding />,
  },
  {
    href: '/admin/cohorts',
    label: 'Cohorts',
    icon: <IconSchool />,
  },
  {
    href: '/admin/participants',
    label: 'Participants',
    icon: <IconUserCheck />,
  },
  {
    href: '/admin/attempts',
    label: 'Attempts',
    icon: <IconClipboardList />,
  },
  {
    href: '/admin/qa',
    label: 'Q&A',
    icon: <IconQuestionMark />,
  },
  {
    href: '/admin/assessments',
    label: 'Assessments',
    icon: <IconFileText />,
  },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell links={ADMIN_DASHBOARD_LINKS}>{children}</AppShell>;
}
