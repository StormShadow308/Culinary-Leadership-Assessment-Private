import { IconLayoutDashboard, IconSchool, IconListCheck, IconUsers } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';
import { SmartOrgProvider } from './components/smart-org-provider';
import { AnswerProvider } from '~/app/contexts/answer-context';

const ORGANISATION_DASHBOARD_LINKS: Array<NavLink> = [
  {
    href: '/organisation',
    label: 'Overview',
    icon: <IconLayoutDashboard />,
  },
  {
    href: '/organisation/cohorts',
    label: 'Cohorts',
    icon: <IconUsers />,
  },
  {
    href: '/organisation/respondents',
    label: 'Respondents',
    icon: <IconSchool />,
  },
  {
    href: '/organisation/answers',
    label: 'Answers',
    icon: <IconListCheck />,
  },
];

export default function OrganisationDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <SmartOrgProvider>
      <AnswerProvider>
        <AppShell links={ORGANISATION_DASHBOARD_LINKS}>
          {children}
        </AppShell>
      </AnswerProvider>
    </SmartOrgProvider>
  );
}
