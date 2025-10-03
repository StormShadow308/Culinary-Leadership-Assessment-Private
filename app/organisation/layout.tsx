import { IconLayoutDashboard, IconSchool } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';
import { GlobalOrgProvider } from './components/global-org-context';

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

export default function OrganisationDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <GlobalOrgProvider>
      <AppShell links={ORGANISATION_DASHBOARD_LINKS}>
        {children}
      </AppShell>
    </GlobalOrgProvider>
  );
}
