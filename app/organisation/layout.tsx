import { IconLayoutDashboard, IconSchool, IconListCheck } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';
import { GlobalOrgProvider } from './components/global-org-context';
import { AnswerProvider } from '~/app/contexts/answer-context';

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
    <GlobalOrgProvider>
      <AnswerProvider>
        <AppShell links={ORGANISATION_DASHBOARD_LINKS}>
          {children}
        </AppShell>
      </AnswerProvider>
    </GlobalOrgProvider>
  );
}
