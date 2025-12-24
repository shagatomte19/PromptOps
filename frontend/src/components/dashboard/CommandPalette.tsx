import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search,
    Command,
    FileText,
    Play,
    Upload,
    Settings,
    PlusCircle,
    GitBranch,
    Activity,
    FlaskConical,
    LogOut,
    Moon,
    Sun,
    Keyboard,
    X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommandItem {
    id: string;
    title: string;
    description?: string;
    icon: React.ElementType;
    shortcut?: string[];
    action: () => void;
    category: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();
    
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands: CommandItem[] = [
        // Navigation
        { 
            id: 'nav-overview',
            title: 'Go to Overview',
            icon: Activity,
            action: () => { navigate('/dashboard'); onClose(); },
            category: 'Navigation'
        },
        { 
            id: 'nav-editor',
            title: 'Go to Prompt Editor',
            icon: FileText,
            action: () => { navigate('/dashboard/editor'); onClose(); },
            category: 'Navigation'
        },
        { 
            id: 'nav-monitor',
            title: 'Go to Monitor',
            icon: Activity,
            action: () => { navigate('/dashboard/monitor'); onClose(); },
            category: 'Navigation'
        },
        { 
            id: 'nav-deployments',
            title: 'Go to Deployments',
            icon: Upload,
            action: () => { navigate('/dashboard/deployments'); onClose(); },
            category: 'Navigation'
        },
        { 
            id: 'nav-experiments',
            title: 'Go to Experiments',
            icon: FlaskConical,
            action: () => { navigate('/dashboard/experiments'); onClose(); },
            category: 'Navigation'
        },
        { 
            id: 'nav-settings',
            title: 'Go to Settings',
            icon: Settings,
            shortcut: ['Ctrl', ','],
            action: () => { navigate('/dashboard/settings'); onClose(); },
            category: 'Navigation'
        },
        
        // Actions
        { 
            id: 'action-new-prompt',
            title: 'Create New Prompt',
            description: 'Start a new prompt from scratch',
            icon: PlusCircle,
            shortcut: ['Ctrl', 'N'],
            action: () => { navigate('/dashboard/editor?new=true'); onClose(); },
            category: 'Actions'
        },
        { 
            id: 'action-run-inference',
            title: 'Run Inference',
            description: 'Execute the current prompt',
            icon: Play,
            shortcut: ['Ctrl', 'Enter'],
            action: () => { onClose(); /* Trigger inference */ },
            category: 'Actions'
        },
        { 
            id: 'action-deploy',
            title: 'Quick Deploy',
            description: 'Deploy current prompt to an environment',
            icon: Upload,
            shortcut: ['Ctrl', 'Shift', 'D'],
            action: () => { onClose(); /* Trigger deploy modal */ },
            category: 'Actions'
        },
        { 
            id: 'action-new-version',
            title: 'Create Version',
            description: 'Save current changes as a new version',
            icon: GitBranch,
            action: () => { onClose(); /* Trigger version modal */ },
            category: 'Actions'
        },
        
        // Settings
        { 
            id: 'settings-shortcuts',
            title: 'Keyboard Shortcuts',
            icon: Keyboard,
            shortcut: ['?'],
            action: () => { navigate('/dashboard/settings?tab=shortcuts'); onClose(); },
            category: 'Settings'
        },
        { 
            id: 'settings-theme-dark',
            title: 'Switch to Dark Theme',
            icon: Moon,
            action: () => { onClose(); },
            category: 'Settings'
        },
        { 
            id: 'settings-theme-light',
            title: 'Switch to Light Theme',
            icon: Sun,
            action: () => { onClose(); },
            category: 'Settings'
        },
        
        // Account
        { 
            id: 'account-signout',
            title: 'Sign Out',
            icon: LogOut,
            action: () => { signOut(); onClose(); },
            category: 'Account'
        }
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    const flatFiltered = filteredCommands;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            flatFiltered[selectedIndex]?.action();
        }
    }, [flatFiltered, selectedIndex, onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                
                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-xl bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                        <Search className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Type a command or search..."
                            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                            autoFocus
                        />
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd>
                            <span>to close</span>
                        </div>
                    </div>

                    {/* Commands list */}
                    <div className="max-h-80 overflow-y-auto p-2">
                        {Object.entries(groupedCommands).map(([category, items]) => (
                            <div key={category} className="mb-2">
                                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {category}
                                </div>
                                {items.map((cmd, i) => {
                                    const globalIndex = flatFiltered.findIndex(c => c.id === cmd.id);
                                    const isSelected = globalIndex === selectedIndex;
                                    
                                    return (
                                        <button
                                            key={cmd.id}
                                            onClick={cmd.action}
                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                                isSelected ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300 hover:bg-white/5'
                                            }`}
                                        >
                                            <cmd.icon className="w-4 h-4 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{cmd.title}</div>
                                                {cmd.description && (
                                                    <div className="text-xs text-gray-500 truncate">{cmd.description}</div>
                                                )}
                                            </div>
                                            {cmd.shortcut && (
                                                <div className="flex items-center gap-1">
                                                    {cmd.shortcut.map((key, ki) => (
                                                        <React.Fragment key={ki}>
                                                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">
                                                                {key}
                                                            </kbd>
                                                            {ki < cmd.shortcut!.length - 1 && (
                                                                <span className="text-gray-600 text-xs">+</span>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                        
                        {flatFiltered.length === 0 && (
                            <div className="py-8 text-center text-gray-500 text-sm">
                                No commands found for "{query}"
                            </div>
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/5 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Command className="w-3 h-3" />
                            <span>PromptOps Command Palette</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>↑↓ to navigate</span>
                            <span>↵ to select</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CommandPalette;
