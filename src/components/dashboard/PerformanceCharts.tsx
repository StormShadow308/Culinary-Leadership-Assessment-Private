
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";

const PerformanceCharts: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Performance across all cohorts over time
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <LineChart
            data={[
              { name: "Jan", avg: 65, highest: 90, lowest: 40 },
              { name: "Feb", avg: 68, highest: 92, lowest: 45 },
              { name: "Mar", avg: 70, highest: 91, lowest: 50 },
              { name: "Apr", avg: 73, highest: 94, lowest: 52 },
              { name: "May", avg: 75, highest: 95, lowest: 55 },
              { name: "Jun", avg: 78, highest: 96, lowest: 60 },
              { name: "Jul", avg: 80, highest: 97, lowest: 63 },
              { name: "Aug", avg: 83, highest: 98, lowest: 68 },
            ]}
            categories={["avg", "highest", "lowest"]}
            index="name"
            colors={["blue", "green", "red"]}
            valueFormatter={(value) => `${value}%`}
            className="aspect-[4/3]"
          />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Cohort Comparison</CardTitle>
          <CardDescription>Average scores by cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={[
              { name: "Cohort A", value: 85 },
              { name: "Cohort B", value: 78 },
              { name: "Cohort C", value: 90 },
              { name: "Cohort D", value: 82 },
              { name: "Cohort E", value: 87 },
              { name: "Cohort F", value: 76 },
              { name: "Cohort G", value: 81 },
            ]}
            categories={["value"]}
            index="name"
            colors={["blue"]}
            valueFormatter={(value) => `${value}%`}
            className="aspect-[4/3]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceCharts;
