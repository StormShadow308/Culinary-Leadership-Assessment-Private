
import React from 'react';
import DashboardMetrics from './overview/DashboardMetrics';
import PerformanceCharts from './overview/PerformanceCharts';
import RecentActivity from './overview/RecentActivity';

interface DashboardOverviewProps {
  data?: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
  return (
    <div className="p-6 space-y-6">
      <DashboardMetrics />
      <PerformanceCharts />
      <div className="grid grid-cols-1 gap-6">
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardOverview;
