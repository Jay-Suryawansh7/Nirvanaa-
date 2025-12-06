'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

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
            case 'PARTIALLY_READY': return 'bg-orange-500 hover:bg-orange-600';
            case 'HIGH_RISK': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
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

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: '#363636' }}>
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white">
                            Case Management
                        </h1>
                        <p className="text-gray-300 mt-2">
                            View and manage all cases in the system
                        </p>
                    </div>
                    <Button onClick={fetchCases} variant="outline">
                        🔄 Refresh
                    </Button>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { key: 'ALL', label: 'All Cases', color: 'bg-gray-500' },
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
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        {label} ({statusCounts[key as keyof typeof statusCounts]})
                    </button>
                ))}
            </div>

            {/* Cases Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredCases.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No cases found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        {filter !== 'ALL' ? 'Try selecting a different filter' : 'Add cases via the API'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCases.map((c) => (
                        <Card key={c.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: getStatusColor(c.status).includes('green') ? '#22c55e' : getStatusColor(c.status).includes('blue') ? '#3b82f6' : getStatusColor(c.status).includes('yellow') ? '#eab308' : getStatusColor(c.status).includes('orange') ? '#f97316' : getStatusColor(c.status).includes('red') ? '#ef4444' : '#6b7280' }}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold">Case {c.id}</CardTitle>
                                    <Badge className={getStatusColor(c.status)}>
                                        {c.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Readiness Score */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-500">Readiness Score</span>
                                        <span className={`text-2xl font-bold ${getScoreColor(c.readinessScore)}`}>
                                            {c.readinessScore}/100
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${c.readinessScore >= 85 ? 'bg-green-500' : c.readinessScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${c.readinessScore}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Status Indicators */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Lawyer</span>
                                        {c.lawyerConfirmed ? (
                                            <span className="text-green-600 font-medium">✅ Confirmed</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">⚠️ Pending</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Witness</span>
                                        {c.witnessConfirmed ? (
                                            <span className="text-green-600 font-medium">✅ Confirmed</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">⚠️ Pending</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Documents</span>
                                        {c.documentsReady ? (
                                            <span className="text-green-600 font-medium">✅ Ready</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">❌ Not Ready</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Mediation</span>
                                        <span className={`font-medium ${c.mediationWilling === 'BOTH' ? 'text-green-600' : c.mediationWilling === 'ONE_PARTY' ? 'text-yellow-600' : 'text-gray-500'}`}>
                                            {c.mediationWilling === 'BOTH' ? '✅ Both Willing' : c.mediationWilling === 'ONE_PARTY' ? '⚠️ One Party' : '➖ None'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {!c.lawyerConfirmed && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
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
    );
}
