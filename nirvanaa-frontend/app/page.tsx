'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Clock, AlertCircle, CheckCircle, FileText, Users, TrendingUp } from 'lucide-react';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
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
      case 'READY': return '#10b981'; // green
      case 'MEDIATION_READY': return '#3b82f6'; // blue
     case 'WAITING': return '#f59e0b'; // yellow/orange
      case 'PARTIALLY_READY': return '#f59e0b'; // orange
      case 'HIGH_RISK': return '#ef4444'; // red
      default: return '#9ca3af';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'READY': return 'Ready';
      case 'MEDIATION_READY': return 'Ready';
      case 'WAITING': return 'Waiting';
      case 'PARTIALLY_READY': return 'Medium';
      case 'HIGH_RISK': return 'High';
      default: return status;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'READY': return 'rgba(16, 185, 129, 0.1)';
      case 'WAITING': return 'rgba(245, 158, 11, 0.1)';
      case 'PARTIALLY_READY': return 'rgba(245, 158, 11, 0.1)';
      case 'HIGH_RISK': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(156, 163, 175, 0.1)';
    }
  };

  const totalCases = cases.length;
  const readyCases = cases.filter(c => c.status === 'READY').length;
  const highRiskCases = cases.filter(c => c.status === 'HIGH_RISK').length;

  // Calculate overall readiness score
  const averageScore = cases.length > 0 
    ? Math.round(cases.reduce((sum, c) => sum + c.readinessScore, 0) / cases.length)
    : 0;

  // Count incomplete items for urgent gaps
  const documentsNotFiled = cases.filter(c => !c.documentsReady).length;
  const pendingWitness = cases.filter(c => !c.witnessConfirmed).length;
  const lawyerDelayed = cases.filter(c => !c.lawyerConfirmed).length;

  if (!authChecked) {
    return <div className="flex h-screen items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <Users className="w-6 h-6" style={{ color: '#d4af37' }} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Judicial Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg p-4 text-center" style={{ background: '#152238', border: '1px solid #2d4a6e' }}>
          <div className="text-3xl font-bold text-foreground mb-1">{totalCases}</div>
          <div className="text-sm text-muted-foreground">Today's cases</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ background: '#152238', border: '1px solid #2d4a6e' }}>
          <div className="text-3xl font-bold mb-1" style={{ color: '#10b981' }}>{readyCases}</div>
          <div className="text-sm text-muted-foreground">Ready</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ background: '#152238', border: '1px solid #2d4a6e' }}>
          <div className="text-3xl font-bold mb-1" style={{ color: '#ef4444' }}>{highRiskCases}</div>
          <div className="text-sm text-muted-foreground">High Risk</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Daily Case List - 2/3 width */}
        <div className="col-span-2 rounded-xl p-6" style={{ background: '#152238', border: '1px solid #2d4a6e' }}>
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5" style={{ color: '#d4af37' }} />
            <h2 className="text-xl font-bold text-foreground">Daily Case List</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {['All Cases', 'Ready', 'Waiting', 'High Risk'].map((tab, idx) => (
              <button 
                key={tab}
                className="px-4 py-2 rounded text-sm font-medium transition-colors"
                style={{ 
                  background: idx === 0 ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: idx === 0 ? '#d4af37' : '#9ca3af',
                  border: idx === 0 ? '1px solid #d4af37' : '1px solid transparent'
                }}
              >
                {tab} {idx === 0 && <span className="ml-1 text-xs">({cases.length})</span>}
              </button>
            ))}
          </div>

          {/* Case Cards */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#2d4a6e #152238'
          }}>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading cases...</div>
            ) : cases.slice(0, 8).map((c) => (
              <div 
                key={c.id}
                className="rounded-lg p-4 transition-all hover:border-primary cursor-pointer"
                style={{ 
                  background: '#1e3a5f',
                  border: '1px solid #2d4a6e'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Status Icon */}
                    <div 
                      className="flex-shrink-0 p-2 rounded-full"
                      style={{ background: getStatusBgColor(c.status) }}
                    >
                      {c.status === 'READY' ? (
                        <CheckCircle className="w-5 h-5" style={{ color: getStatusColor(c.status) }} />
                      ) : c.status === 'HIGH_RISK' ? (
                        <AlertCircle className="w-5 h-5" style={{ color: getStatusColor(c.status) }} />
                      ) : (
                        <Clock className="w-5 h-5" style={{ color: getStatusColor(c.status) }} />
                      )}
                    </div>

                    {/* Case Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{ 
                            background: getStatusBgColor(c.status),
                            color: getStatusColor(c.status)
                          }}
                        >
                          {c.caseNumber || c.id}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded font-semibold"
                          style={{ 
                            background: getStatusBgColor(c.status),
                            color: getStatusColor(c.status)
                          }}
                        >
                          {getStatusLabel(c.status)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-foreground">{c.title}</div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Hearing</div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ color: '#d4af37' }} />
                        <span className="text-sm font-medium text-foreground">9:00 AM</span>
                      </div>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-xs text-muted-foreground mb-1">Readiness</div>
                      <div className="text-sm font-bold" style={{ 
                        color: c.readinessScore >= 80 ? '#10b981' : c.readinessScore >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {c.readinessScore}%
                      </div>
                    </div>

                    <button 
                      className="px-4 py-2 rounded text-sm font-semibold transition-colors"
                      style={{ 
                        background: 'rgba(212, 175, 55, 0.1)',
                        color: '#d4af37',
                        border: '1px solid #d4af37'
                      }}
                    >
                      Open Case
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Case Readiness */}
          <div className="rounded-xl p-6" style={{ background: '#152238', border: '1px solid #2d4a6e' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Case Readiness</h3>
              <span className="text-xs text-muted-foreground">Overall preparation status</span>
            </div>

            {/* Circular Score */}
            <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#2d4a6e"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#d4af37"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * (averageScore / 100)} ${2 * Math.PI * 56}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold" style={{ color: '#10b981' }}>{averageScore}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Documents Filed</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                    {Math.round(((cases.length - documentsNotFiled) / (cases.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: '#1e3a5f' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      background: '#10b981',
                      width: `${((cases.length - documentsNotFiled) / (cases.length || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Witness Confirmation</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>
                    {Math.round(((cases.length - pendingWitness) / (cases.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: '#1e3a5f' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      background: '#f59e0b',
                      width: `${((cases.length - pendingWitness) / (cases.length || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Lawyer Readiness</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                    {Math.round(((cases.length - lawyerDelayed) / (cases.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: '#1e3a5f' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      background: '#10b981',
                      width: `${((cases.length - lawyerDelayed) / (cases.length || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Gaps */}
          <div className="rounded-xl p-6" style={{ background: '#152238', border: '1px solid #2d4a6e' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
              <h3 className="text-lg font-bold text-foreground">Urgent Gaps</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#ef4444' }} />
                <span className="text-sm text-foreground">
                  Evidence documentation requires additional verification
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#ef4444' }} />
                <span className="text-sm text-foreground">
                  Pending witness depositions from defendant's side
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#ef4444' }} />
                <span className="text-sm text-foreground">
                  Lawyer response delayed for motion hearing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
