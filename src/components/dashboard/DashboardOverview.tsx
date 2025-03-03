
import React, { useState } from 'react';
import DashboardMetrics from './DashboardMetrics';
import PerformanceCharts from './PerformanceCharts';
import RecentActivity from './RecentActivity';

const DashboardOverview: React.FC = () => {
  const [activeView, setActiveView] = useState("week");
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardMetrics activeView={activeView} setActiveView={setActiveView} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PerformanceCharts />
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardOverview;
