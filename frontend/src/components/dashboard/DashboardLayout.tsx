import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Settings,
    LogOut,
    LayoutDashboard,
    TerminalSquare,
    BarChart3,
    GitBranch,
    Bell,
    ChevronDown,
    Activity,
    PanelBottomClose,
    PanelBottomOpen,
    HelpCircle,
    FlaskConical
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceStore, useLogs, useActiveEnvironment, useIsLoading } from '@/stores/workspaceStore';
import { LoadingBar } from '@/components/ui/Loading';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    path: string;
    active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, active }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(path)}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative",
                active
                    ? "text-cyan-400 bg-cyan-950/30"
                    : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
            )}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />}
        </button>
    );
};

const TerminalPanel: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
    const logs = useLogs();

    return (
        <motion.div
            initial={{ height: 40 }}
            animate={{ height: isOpen ? 240 : 36 }}
            className="border-t border-white/10 bg-surface flex flex-col shrink-0 transition-all"
        >
            <div
                className="h-9 flex items-center justify-between px-4 border-b border-white/10 cursor-pointer bg-surface-light hover:bg-white/5"
                onClick={toggle}
            >
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Activity className="w-3 h-3" />
                    <span>SYSTEM ACTIVITY</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{logs.length} events</span>
                </div>
                <div className="flex items-center gap-2">
                    {isOpen ? <PanelBottomClose className="w-3 h-3 text-gray-500" /> : <PanelBottomOpen className="w-3 h-3 text-gray-500" />}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 hover:bg-white/5 p-1 rounded"
                        >
                            <span className="text-gray-600 shrink-0">
                                {new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}
                            </span>
                            <span className={cn(
                                "uppercase shrink-0 w-16 font-bold",
                                log.level === 'info' && "text-blue-400",
                                log.level === 'success' && "text-green-400",
                                log.level === 'warning' && "text-yellow-400",
                                log.level === 'error' && "text-red-400",
                            )}>{log.level}</span>
                            <span className="text-gray-500 shrink-0">[{log.source}]</span>
                            <span className="text-gray-300">{log.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const activeEnvironment = useActiveEnvironment();
    const setActiveEnvironment = useWorkspaceStore((s) => s.setActiveEnvironment);
    const fetchPrompts = useWorkspaceStore((s) => s.fetchPrompts);
    const fetchEnvironments = useWorkspaceStore((s) => s.fetchEnvironments);
    const fetchLogs = useWorkspaceStore((s) => s.fetchLogs);
    const isLoading = useIsLoading();

    const [isTerminalOpen, setIsTerminalOpen] = useState(true);

    // Fetch initial data
    useEffect(() => {
        fetchPrompts();
        fetchEnvironments();
        fetchLogs();
    }, [fetchPrompts, fetchEnvironments, fetchLogs]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: TerminalSquare, label: 'Prompt Editor', path: '/dashboard/editor' },
        { icon: FlaskConical, label: 'Experiments', path: '/dashboard/experiments' },
        { icon: GitBranch, label: 'Deployments', path: '/dashboard/deployments' },
        { icon: BarChart3, label: 'Monitor', path: '/dashboard/monitor' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div className="flex h-screen w-screen bg-background text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            <LoadingBar isLoading={isLoading} />

            {/* Left Sidebar */}
            <div className="w-64 flex flex-col border-r border-white/10 bg-surface">
                {/* Logo Area */}
                <div className="h-14 flex items-center px-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Box className="w-5 h-5" />
                        <span className="font-display font-bold tracking-tight text-white">PromptOps</span>
                    </div>
                </div>

                {/* Workspace Selector */}
                <div className="p-3">
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-light border border-white/10 hover:border-white/20 transition-all text-sm group">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">P</div>
                            <span className="font-medium text-gray-200">Production</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-3 py-2 space-y-0.5">
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-3 mb-2 mt-2">Platform</div>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            active={location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))}
                        />
                    ))}
                </div>

                {/* User Profile */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-left group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0] || 'User'}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">
                {/* Top Header */}
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-background">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>/</span>
                            <span className="text-gray-200 capitalize">
                                {location.pathname.split('/').pop() || 'overview'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Env Toggles */}
                        <div className="flex bg-surface-light rounded-md p-1 border border-white/10">
                            {(['development', 'staging', 'production'] as const).map((env) => (
                                <button
                                    key={env}
                                    onClick={() => setActiveEnvironment(env)}
                                    className={cn(
                                        "px-3 py-1 text-xs font-medium rounded transition-all capitalize",
                                        activeEnvironment === env
                                            ? "bg-white/10 text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    {env}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-px bg-white/10 mx-1" />

                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                        </button>
                    </div>
                </header>

                {/* Content Pane */}
                <main className="flex-1 overflow-hidden relative">
                    <Outlet />
                </main>

                {/* Bottom Terminal Panel */}
                <TerminalPanel isOpen={isTerminalOpen} toggle={() => setIsTerminalOpen(!isTerminalOpen)} />
            </div>
        </div>
    );
};

export default DashboardLayout;
