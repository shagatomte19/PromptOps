import React, { useState } from 'react';
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
  Search, 
  ChevronDown,
  Activity,
  Zap,
  Layout,
  PanelBottomClose,
  PanelBottomOpen,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { UserManual } from './UserManual';

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
    )
}

const TerminalPanel = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
    const { logs } = useWorkspace();

    return (
        <motion.div 
            initial={{ height: 40 }}
            animate={{ height: isOpen ? 240 : 36 }}
            className="border-t border-white/10 bg-[#0A0B14] flex flex-col shrink-0 transition-all"
        >
            <div 
                className="h-9 flex items-center justify-between px-4 border-b border-white/10 cursor-pointer bg-[#0F111A] hover:bg-[#151720]"
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
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 hover:bg-white/5 p-1 rounded">
                        <span className="text-gray-600 shrink-0">{log.timestamp.toLocaleTimeString().split(' ')[0]}</span>
                        <span className={cn(
                            "uppercase shrink-0 w-16 font-bold",
                            log.level === 'info' && "text-blue-400",
                            log.level === 'success' && "text-green-400",
                            log.level === 'warning' && "text-yellow-400",
                            log.level === 'error' && "text-red-400",
                        )}>{log.level}</span>
                        <span className="text-gray-500 shrink-0">[{log.source}]</span>
                        <span className="text-gray-300">{log.message}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { activeEnvironment, setActiveEnvironment, isLoading } = useWorkspace();
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);
    const [isManualOpen, setIsManualOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: TerminalSquare, label: 'Prompt Editor', path: '/dashboard/editor' },
        { icon: GitBranch, label: 'Deployments', path: '/dashboard/deployments' },
        { icon: BarChart3, label: 'Monitor', path: '/dashboard/monitor' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div className="flex h-screen w-screen bg-[#05050A] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            <UserManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
            
            {/* Left Sidebar */}
            <div className="w-64 flex flex-col border-r border-white/10 bg-[#08090F]">
                {/* Logo Area */}
                <div className="h-14 flex items-center px-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Box className="w-5 h-5" />
                        <span className="font-display font-bold tracking-tight text-white">PromptOps</span>
                    </div>
                </div>

                {/* Workspace Selector */}
                <div className="p-3">
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0F111A] border border-white/10 hover:border-white/20 transition-all text-sm group">
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
                    
                    <button
                        onClick={() => setIsManualOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-400 hover:text-gray-100 hover:bg-white/5 mt-4"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>User Manual</span>
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-3 border-t border-white/10">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-left group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">Engineering Team</div>
                            <div className="text-xs text-gray-500 truncate">Pro Plan</div>
                        </div>
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#05050A]">
                {/* Top Header */}
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#05050A]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                             <Layout className="w-4 h-4" />
                             <span>/</span>
                             <span className="text-gray-200 capitalize">
                                {location.pathname.split('/').pop() || 'overview'}
                             </span>
                        </div>
                        {isLoading && <div className="h-1 w-24 bg-cyan-900/30 rounded overflow-hidden relative">
                            <div className="absolute inset-0 bg-cyan-400 animate-loading-bar" />
                        </div>}
                    </div>

                    <div className="flex items-center gap-3">
                         {/* Env Toggles */}
                        <div className="flex bg-[#0F111A] rounded-md p-1 border border-white/10">
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
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#05050A]" />
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