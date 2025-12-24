import React from 'react';
import {
    Wifi,
    WifiOff,
    Cloud,
    CheckCircle,
    AlertCircle,
    Loader2,
    User,
    GitBranch,
    Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveEnvironment, useIsLoading } from '@/stores/workspaceStore';

interface StatusBarProps {
    className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ className = '' }) => {
    const { user } = useAuth();
    const activeEnvironment = useActiveEnvironment();
    const isLoading = useIsLoading();
    
    // Mock status data - in a real app these would come from stores/context
    const isConnected = true;
    const lastSyncTime = new Date();
    const currentBranch = 'main';
    const unsavedChanges = false;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    const getEnvironmentColor = (env: string) => {
        switch (env) {
            case 'production': return 'text-red-400 bg-red-400/10';
            case 'staging': return 'text-yellow-400 bg-yellow-400/10';
            default: return 'text-green-400 bg-green-400/10';
        }
    };

    return (
        <div className={`h-6 bg-surface-light border-t border-white/10 flex items-center justify-between px-3 text-xs ${className}`}>
            {/* Left section */}
            <div className="flex items-center gap-3">
                {/* Environment indicator */}
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${getEnvironmentColor(activeEnvironment)}`}>
                    <Cloud className="w-3 h-3" />
                    <span className="font-medium capitalize">{activeEnvironment}</span>
                </div>

                {/* Branch indicator */}
                <div className="flex items-center gap-1.5 text-gray-400">
                    <GitBranch className="w-3 h-3" />
                    <span>{currentBranch}</span>
                </div>

                {/* Sync status */}
                {isLoading ? (
                    <div className="flex items-center gap-1.5 text-cyan-400">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Syncing...</span>
                    </div>
                ) : unsavedChanges ? (
                    <div className="flex items-center gap-1.5 text-yellow-400">
                        <AlertCircle className="w-3 h-3" />
                        <span>Unsaved changes</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <CheckCircle className="w-3 h-3" />
                        <span>Saved</span>
                    </div>
                )}
            </div>

            {/* Center section */}
            <div className="flex items-center gap-3 text-gray-500">
                {/* Command palette hint */}
                <div className="flex items-center gap-1">
                    <span>Command Palette:</span>
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">Ctrl+K</kbd>
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Last sync time */}
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Last sync: {formatTime(lastSyncTime)}</span>
                </div>

                {/* Connection status */}
                {isConnected ? (
                    <div className="flex items-center gap-1.5 text-green-400">
                        <Wifi className="w-3 h-3" />
                        <span>Connected</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-red-400">
                        <WifiOff className="w-3 h-3" />
                        <span>Offline</span>
                    </div>
                )}

                {/* User */}
                {user && (
                    <div className="flex items-center gap-1.5 text-gray-400 border-l border-white/10 pl-3">
                        <User className="w-3 h-3" />
                        <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusBar;
