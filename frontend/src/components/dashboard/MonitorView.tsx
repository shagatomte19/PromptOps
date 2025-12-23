import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Clock,
    Zap,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Loading';
import { metricsService } from '@/services';
import type { MetricsOverview, LatencyData, CostData } from '@/types';

const MetricCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string;
    subValue?: string;
    trend?: 'up' | 'down';
    color: string;
}> = ({ icon: Icon, label, value, subValue, trend, color }) => (
    <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{label}</span>
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subValue && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                {trend && (
                    <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
                )}
                {subValue}
            </p>
        )}
    </Card>
);

const SimpleBarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="flex items-end gap-1 h-32">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.value / maxValue) * 100}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full bg-gradient-to-t from-cyan-500/50 to-indigo-500/50 rounded-t min-h-[4px]"
                    />
                    <span className="text-[9px] text-gray-500">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export const MonitorView: React.FC = () => {
    const [overview, setOverview] = useState<MetricsOverview | null>(null);
    const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
    const [costData, setCostData] = useState<CostData[]>([]);
    const [modelData, setModelData] = useState<Array<{
        model: string;
        request_count: number;
        success_rate: number;
        avg_latency_ms: number;
        total_cost_cents: number;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [overviewRes, latencyRes, costRes, modelRes] = await Promise.all([
                    metricsService.getOverview(timeRange),
                    metricsService.getLatency(timeRange),
                    metricsService.getCosts(timeRange),
                    metricsService.getByModel(timeRange)
                ]);

                setOverview(overviewRes);
                setLatencyData(latencyRes);
                setCostData(costRes);
                setModelData(modelRes);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    // Prepare chart data
    const latencyChartData = latencyData.slice(-20).map(d => ({
        label: new Date(d.timestamp).getHours() + 'h',
        value: d.avg_latency_ms
    }));

    const costChartData = costData.slice(-14).map(d => ({
        label: d.date.split('-').slice(1).join('/'),
        value: d.cost_cents
    }));

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Monitoring</h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time metrics and performance data</p>
                </div>
                <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-lg p-1">
                    {[7, 14, 30].map((days) => (
                        <button
                            key={days}
                            onClick={() => setTimeRange(days)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${timeRange === days ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {days}d
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    <>
                        {[1, 2, 3, 4].map(i => (
                            <Card key={i}><Skeleton height={80} /></Card>
                        ))}
                    </>
                ) : (
                    <>
                        <MetricCard
                            icon={Zap}
                            label="Total Requests"
                            value={overview?.total_requests.toLocaleString() || '0'}
                            subValue={`Last ${timeRange} days`}
                            color="text-cyan-400"
                        />
                        <MetricCard
                            icon={CheckCircle}
                            label="Success Rate"
                            value={`${overview?.success_rate || 0}%`}
                            subValue={overview?.success_rate >= 99 ? 'Excellent' : 'Monitor closely'}
                            trend={overview?.success_rate >= 99 ? 'up' : 'down'}
                            color="text-green-400"
                        />
                        <MetricCard
                            icon={Clock}
                            label="P95 Latency"
                            value={`${overview?.p95_latency_ms || 0}ms`}
                            subValue={`Avg: ${overview?.avg_latency_ms || 0}ms`}
                            color="text-yellow-400"
                        />
                        <MetricCard
                            icon={DollarSign}
                            label="Total Cost"
                            value={`$${((overview?.total_cost_cents || 0) / 100).toFixed(2)}`}
                            subValue={`${((overview?.total_tokens || 0) / 1000).toFixed(0)}K tokens`}
                            color="text-purple-400"
                        />
                    </>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latency Chart */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Latency Trend</h3>
                        <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    {loading ? (
                        <Skeleton height={128} />
                    ) : latencyChartData.length > 0 ? (
                        <SimpleBarChart data={latencyChartData} />
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
                            No data available
                        </div>
                    )}
                </Card>

                {/* Cost Chart */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Daily Cost</h3>
                        <DollarSign className="w-4 h-4 text-gray-500" />
                    </div>
                    {loading ? (
                        <Skeleton height={128} />
                    ) : costChartData.length > 0 ? (
                        <SimpleBarChart data={costChartData} />
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
                            No data available
                        </div>
                    )}
                </Card>
            </div>

            {/* Model Breakdown */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Model Usage</h3>
                    <Activity className="w-4 h-4 text-gray-500" />
                </div>
                {loading ? (
                    <Skeleton height={100} />
                ) : modelData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-white/10">
                                    <th className="pb-2 font-medium">Model</th>
                                    <th className="pb-2 font-medium text-right">Requests</th>
                                    <th className="pb-2 font-medium text-right">Success</th>
                                    <th className="pb-2 font-medium text-right">Avg Latency</th>
                                    <th className="pb-2 font-medium text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modelData.map((row, i) => (
                                    <tr key={i} className="border-b border-white/5">
                                        <td className="py-3 font-mono text-cyan-400">{row.model}</td>
                                        <td className="py-3 text-right">{row.request_count.toLocaleString()}</td>
                                        <td className="py-3 text-right">
                                            <span className={row.success_rate >= 99 ? 'text-green-400' : 'text-yellow-400'}>
                                                {row.success_rate}%
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">{row.avg_latency_ms.toFixed(0)}ms</td>
                                        <td className="py-3 text-right">${(row.total_cost_cents / 100).toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        No model data available yet
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MonitorView;
