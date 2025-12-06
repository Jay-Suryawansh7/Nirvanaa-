'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Case {
  id: string;
  readinessScore: number;
  status: 'READY' | 'MEDIATION_READY' | 'WAITING' | 'PARTIALLY_READY' | 'HIGH_RISK';
  lawyerConfirmed: boolean;
  witnessConfirmed: boolean;
  documentsReady: boolean;
  mediationWilling: 'NONE' | 'ONE_PARTY' | 'BOTH';
}

const API_URL = 'http://localhost:5001/api/cases';

export function CaseList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setCases(data);
    } catch (error) {
      console.error('Failed to fetch cases', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-500 hover:bg-green-600';
      case 'MEDIATION_READY': return 'bg-blue-500 hover:bg-blue-600';
      case 'WAITING': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'HIGH_RISK': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <div>Loading cases...</div>;

  return (
    <div className="space-y-4">
      {cases.map((c) => (
        <Card key={c.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case {c.id}</CardTitle>
            <Badge className={getStatusColor(c.status)}>{c.status.replace('_', ' ')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.readinessScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Lawyer: {c.lawyerConfirmed ? '✅' : '❌'} | 
              Witness: {c.witnessConfirmed ? '✅' : '❌'} | 
              Docs: {c.documentsReady ? '✅' : '❌'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
