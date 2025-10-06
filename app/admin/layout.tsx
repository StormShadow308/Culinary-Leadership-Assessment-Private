import { IconHome, IconQuestionMark, IconUsers, IconBuilding, IconSchool, IconUserCheck, IconClipboardList, IconFileText, IconTable, IconListCheck } from '@tabler/icons-react';

import { AppShell, type NavLink } from '~/components/app-shell';
import { GlobalOrgProvider } from '~/app/organisation/components/global-org-context';
import { AnswerProvider } from '~/app/contexts/answer-context';
import { AdminGlobalOrgSelector } from './components/admin-global-org-selector';

const ADMIN_DASHBOARD_LINKS: Array<NavLink> = [
  {
    href: '/admin',
    label: 'Overview',
    icon: <IconHome />,
  },
  {
    href: '/admin/all-clients',
    label: "All Client's Data",
    icon: <IconTable />,
  },
  {
    href: '/admin/answers',
    label: 'Answers',
    icon: <IconListCheck />,
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
  return (
    <GlobalOrgProvider>
      <AnswerProvider>
        <AppShell 
          links={ADMIN_DASHBOARD_LINKS}
          headerContent={<AdminGlobalOrgSelector />}
        >
          {children}
        </AppShell>
      </AnswerProvider>
    </GlobalOrgProvider>
  );
}
