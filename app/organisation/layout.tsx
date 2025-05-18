import { IconLayoutDashboard, IconSchool } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';

const ORGANISATION_DASHBOARD_LINKS: Array<NavLink> = [
  {
    href: '/organisation',
    label: 'Overview',
    icon: <IconLayoutDashboard />,
  },
  {
    href: '/organisation/respondents',
    label: 'Respondents',
    icon: <IconSchool />,
  },
];

export default function OrganisationDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell links={ORGANISATION_DASHBOARD_LINKS}>{children}</AppShell>;
}
