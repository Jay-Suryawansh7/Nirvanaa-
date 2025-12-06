'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  const sendReminder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.post(`http://localhost:5001/api/cases/${id}/remind`);
      alert(`Reminder sent for Case ${id}`);
    } catch (error) {
      console.error('Failed to send reminder', error);
      alert('Failed to send reminder');
    }
  };

  if (loading) return <div>Loading cases...</div>;

  return (
    <div className="space-y-4">
      {cases.map((c) => (
        <Card key={c.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex flex-col">
                <CardTitle className="text-sm font-medium">Case {c.id}</CardTitle>
                <div className="text-xs text-muted-foreground mt-1">
                    {c.lawyerConfirmed ? (
                        <span className="text-green-600 font-bold">✓ Lawyer Confirmed</span>
                    ) : (
                        <span className="text-yellow-600 font-bold">⚠ Lawyer Pending</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {!c.lawyerConfirmed && (
                    <Button variant="outline" size="sm" onClick={(e) => sendReminder(c.id, e)}>
                        Send Reminder
                    </Button>
                )}
                <Badge className={getStatusColor(c.status)}>{c.status.replace('_', ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.readinessScore}/100</div>
            <p className="text-xs text-muted-foreground mt-2">
              Witness: {c.witnessConfirmed ? '✅' : '❌'} | 
              Docs: {c.documentsReady ? '✅' : '❌'} | 
              Mediation: {c.mediationWilling}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
