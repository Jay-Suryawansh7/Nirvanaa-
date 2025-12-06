'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Metrics {
  totalCases: number;
  readyCases: number;
  highRiskCases: number;
  mediationReadyCases: number;
  partiallyReadyCases: number;
}

const API_URL = 'http://localhost:5001/api/cases/metrics';

export function CaseMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics', error);
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalCases}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ready for Trial</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.readyCases}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mediation Ready</CardTitle>
          <div className="h-4 w-4 rounded-full bg-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.mediationReadyCases}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          <div className="h-4 w-4 rounded-full bg-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.highRiskCases}</div>
        </CardContent>
      </Card>
    </div>
  );
}
