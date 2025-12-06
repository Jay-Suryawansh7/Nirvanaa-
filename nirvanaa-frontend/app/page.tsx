'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaseList } from '@/components/case-list';
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from '@/components/ui/expandable-screen';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BackgroundImageTexture } from '@/components/ui/bg-image-texture';

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

export default function Home() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthChecked(true);
      fetchCases();
    }
  }, [router]);

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
      case 'PARTIALLY_READY': return 'bg-orange-500 hover:bg-orange-600';
      case 'HIGH_RISK': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
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

  const filteredCases = filter === 'ALL'
    ? cases
    : cases.filter(c => c.status === filter);

  const statusCounts = {
    ALL: cases.length,
    READY: cases.filter(c => c.status === 'READY').length,
    MEDIATION_READY: cases.filter(c => c.status === 'MEDIATION_READY').length,
    WAITING: cases.filter(c => c.status === 'WAITING').length,
    PARTIALLY_READY: cases.filter(c => c.status === 'PARTIALLY_READY').length,
    HIGH_RISK: cases.filter(c => c.status === 'HIGH_RISK').length,
  };

  if (!authChecked) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#363636' }}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Nyaya Readiness Dashboard
        </h1>
        <p className="text-gray-300 mt-2">
          AI-Powered Case Readiness &amp; Mediation System
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Dashboard Metrics */}
        <main className="flex-1 lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BackgroundImageTexture
              variant="fabric-of-squares"
              opacity={0.3}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Pending Confirmations</h2>
                <div className="text-3xl font-bold text-blue-600">12</div>
                <p className="text-sm text-gray-500 mt-1">Lawyers yet to respond</p>
              </div>
            </BackgroundImageTexture>

            <BackgroundImageTexture
              variant="grid-noise"
              opacity={0.3}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Ready for Hearing</h2>
                <div className="text-3xl font-bold text-green-600">5</div>
                <p className="text-sm text-gray-500 mt-1">Score &ge; 85</p>
              </div>
            </BackgroundImageTexture>

            <BackgroundImageTexture
              variant="debut-light"
              opacity={0.3}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Mediation Candidates</h2>
                <div className="text-3xl font-bold text-purple-600">3</div>
                <p className="text-sm text-gray-500 mt-1">Both parties willing</p>
              </div>
            </BackgroundImageTexture>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Today&apos;s Cases</h2>
            <div className="sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Case ID</th>
                    <th scope="col" className="px-6 py-3">Lawyer Confirmed</th>
                    <th scope="col" className="px-6 py-3">Witness Confirmed</th>
                    <th scope="col" className="px-6 py-3">Readiness Score</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">C-2023-001</td>
                    <td className="px-6 py-4 text-green-600">Yes</td>
                    <td className="px-6 py-4 text-green-600">Yes</td>
                    <td className="px-6 py-4">95</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">READY</span></td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">C-2023-002</td>
                    <td className="px-6 py-4 text-red-600">No</td>
                    <td className="px-6 py-4 text-gray-400">Pending</td>
                    <td className="px-6 py-4">30</td>
                    <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">PARTIALLY_READY</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Right Section - Cases Panel */}
        <aside className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">All Cases</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                Live
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Real-time case data from the backend API
            </p>
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <CaseList />
            </div>

            {/* Expandable Screen for View All Cases */}
            <ExpandableScreen
              layoutId="view-all-cases"
              triggerRadius="8px"
              contentRadius="16px"
              animationDuration={0.4}
            >
              <ExpandableScreenTrigger className="mt-4 w-full">
                <button className="group cursor-pointer w-full px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex justify-between items-center font-semibold transition-all shadow-lg hover:shadow-xl">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    View All Cases
                  </span>
                  <div className="group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </ExpandableScreenTrigger>

              <ExpandableScreenContent className="bg-[#2a2a2a] overflow-auto">
                <div className="p-8 min-h-full">
                  {/* Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Case Management
                    </h1>
                    <p className="text-gray-400">
                      View and manage all cases in the system
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { key: 'ALL', label: 'All Cases', color: 'bg-gray-600' },
                      { key: 'READY', label: 'Ready', color: 'bg-green-500' },
                      { key: 'MEDIATION_READY', label: 'Mediation Ready', color: 'bg-blue-500' },
                      { key: 'WAITING', label: 'Waiting', color: 'bg-yellow-500' },
                      { key: 'PARTIALLY_READY', label: 'Partially Ready', color: 'bg-orange-500' },
                      { key: 'HIGH_RISK', label: 'High Risk', color: 'bg-red-500' },
                    ].map(({ key, label, color }) => (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === key
                          ? `${color} text-white shadow-lg scale-105`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                          }`}
                      >
                        {label} ({statusCounts[key as keyof typeof statusCounts]})
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end mb-4">
                    <Button onClick={fetchCases} variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      🔄 Refresh
                    </Button>
                  </div>

                  {/* Cases Grid */}
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredCases.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-lg">No cases found</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {filter !== 'ALL' ? 'Try selecting a different filter' : 'Add cases via the API'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCases.map((c) => (
                        <Card key={c.id} className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: c.status === 'READY' ? '#22c55e' : c.status === 'MEDIATION_READY' ? '#3b82f6' : c.status === 'WAITING' ? '#eab308' : c.status === 'PARTIALLY_READY' ? '#f97316' : c.status === 'HIGH_RISK' ? '#ef4444' : '#6b7280' }}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-bold text-white">Case {c.id}</CardTitle>
                              <Badge className={getStatusColor(c.status)}>
                                {c.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Readiness Score */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-400">Readiness Score</span>
                                <span className={`text-2xl font-bold ${getScoreColor(c.readinessScore)}`}>
                                  {c.readinessScore}/100
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${c.readinessScore >= 85 ? 'bg-green-500' : c.readinessScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${c.readinessScore}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Lawyer</span>
                                {c.lawyerConfirmed ? (
                                  <span className="text-green-400 font-medium">✅ Confirmed</span>
                                ) : (
                                  <span className="text-yellow-400 font-medium">⚠️ Pending</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Witness</span>
                                {c.witnessConfirmed ? (
                                  <span className="text-green-400 font-medium">✅ Confirmed</span>
                                ) : (
                                  <span className="text-yellow-400 font-medium">⚠️ Pending</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Documents</span>
                                {c.documentsReady ? (
                                  <span className="text-green-400 font-medium">✅ Ready</span>
                                ) : (
                                  <span className="text-red-400 font-medium">❌ Not Ready</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Mediation</span>
                                <span className={`font-medium ${c.mediationWilling === 'BOTH' ? 'text-green-400' : c.mediationWilling === 'ONE_PARTY' ? 'text-yellow-400' : 'text-gray-500'}`}>
                                  {c.mediationWilling === 'BOTH' ? '✅ Both Willing' : c.mediationWilling === 'ONE_PARTY' ? '⚠️ One Party' : '➖ None'}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            {!c.lawyerConfirmed && (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                  onClick={(e) => sendReminder(c.id, e)}
                                >
                                  📧 Send Reminder to Lawyer
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </aside>
      </div>
    </div>
  );
}
