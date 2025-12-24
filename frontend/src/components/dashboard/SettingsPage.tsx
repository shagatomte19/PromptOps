import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Key,
    Bell,
    Palette,
    Keyboard,
    AlertTriangle,
    Save,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    Copy,
    Check,
    Moon,
    Sun,
    Monitor,
    RefreshCw,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

// Tab configuration
const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Settings },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
];

// Toggle Switch Component
const Toggle: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
}> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            {label && <div className="text-sm font-medium text-white">{label}</div>}
            {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
                enabled ? 'bg-cyan-500' : 'bg-white/10'
            }`}
        >
            <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
                animate={{ x: enabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </button>
    </div>
);

// Select Component
const Select: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label?: string;
}> = ({ value, onChange, options, label }) => (
    <div className="py-2">
        {label && <div className="text-sm font-medium text-white mb-2">{label}</div>}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface text-white">
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

// Input Component
const Input: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}> = ({ value, onChange, label, type = 'text', placeholder, disabled }) => (
    <div className="py-2">
        {label && <div className="text-sm font-medium text-white mb-2">{label}</div>}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);

// Section Component
const Section: React.FC<{
    title: string;
    description?: string;
    children: React.ReactNode;
}> = ({ title, description, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
        <div className="space-y-1">{children}</div>
    </div>
);

// API Key Row Component
const APIKeyRow: React.FC<{
    name: string;
    maskedKey: string;
    createdAt: string;
    onDelete: () => void;
    onCopy: () => void;
}> = ({ name, maskedKey, createdAt, onDelete, onCopy }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
            <div>
                <div className="font-medium text-white">{name}</div>
                <div className="text-xs text-gray-500 font-mono">{maskedKey}</div>
                <div className="text-xs text-gray-600 mt-0.5">Created {createdAt}</div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleCopy}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Shortcut Row Component
const ShortcutRow: React.FC<{
    action: string;
    keys: string[];
}> = ({ action, keys }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-300">{action}</span>
        <div className="flex items-center gap-1">
            {keys.map((key, i) => (
                <React.Fragment key={i}>
                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs font-mono text-white">
                        {key}
                    </kbd>
                    {i < keys.length - 1 && <span className="text-gray-500 text-xs">+</span>}
                </React.Fragment>
            ))}
        </div>
    </div>
);

// Theme selector option
const ThemeOption: React.FC<{
    theme: 'dark' | 'light' | 'system';
    currentTheme: string;
    onSelect: (theme: string) => void;
    icon: React.ElementType;
    label: string;
}> = ({ theme, currentTheme, onSelect, icon: Icon, label }) => (
    <button
        onClick={() => onSelect(theme)}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
            currentTheme === theme
                ? 'bg-cyan-500/10 border-cyan-500'
                : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}
    >
        <Icon className={`w-6 h-6 ${currentTheme === theme ? 'text-cyan-400' : 'text-gray-400'}`} />
        <span className={`text-sm ${currentTheme === theme ? 'text-white' : 'text-gray-400'}`}>
            {label}
        </span>
    </button>
);

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    
    // Profile state
    const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || '');
    const [bio, setBio] = useState('');
    
    // Workspace state
    const [defaultEnv, setDefaultEnv] = useState('development');
    const [autoSave, setAutoSave] = useState(true);
    const [editorTheme, setEditorTheme] = useState('monokai');
    const [fontSize, setFontSize] = useState('14');
    
    // Notification state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [deploymentAlerts, setDeploymentAlerts] = useState(true);
    const [errorAlerts, setErrorAlerts] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);
    
    // Appearance state
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('#06b6d4');
    const [density, setDensity] = useState('comfortable');
    const [reduceMotion, setReduceMotion] = useState(false);
    
    // Mock API keys
    const [apiKeys, setApiKeys] = useState([
        { id: '1', name: 'Production API Key', maskedKey: 'pk_live_****...****abcd', createdAt: 'Dec 15, 2024' },
        { id: '2', name: 'Development Key', maskedKey: 'pk_test_****...****efgh', createdAt: 'Dec 10, 2024' }
    ]);
    
    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };
    
    const shortcuts = [
        { action: 'Command Palette', keys: ['Ctrl', 'K'] },
        { action: 'Save Prompt', keys: ['Ctrl', 'S'] },
        { action: 'New Prompt', keys: ['Ctrl', 'N'] },
        { action: 'Run Inference', keys: ['Ctrl', 'Enter'] },
        { action: 'Toggle Sidebar', keys: ['Ctrl', 'B'] },
        { action: 'Focus Editor', keys: ['Ctrl', 'E'] },
        { action: 'Show Shortcuts', keys: ['?'] },
        { action: 'Quick Deploy', keys: ['Ctrl', 'Shift', 'D'] },
        { action: 'Search Prompts', keys: ['Ctrl', 'P'] },
        { action: 'Toggle Terminal', keys: ['Ctrl', '`'] }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div>
                        <Section title="Profile Information" description="Manage your public profile information">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                        Change avatar
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                                </div>
                            </div>
                            <Input
                                label="Display Name"
                                value={displayName}
                                onChange={setDisplayName}
                                placeholder="Your display name"
                            />
                            <Input
                                label="Email"
                                value={user?.email || ''}
                                onChange={() => {}}
                                disabled
                            />
                            <div className="py-2">
                                <div className="text-sm font-medium text-white mb-2">Bio</div>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none h-24"
                                />
                            </div>
                        </Section>
                    </div>
                );
                
            case 'workspace':
                return (
                    <div>
                        <Section title="Default Environment" description="Set your preferred environment for new prompts">
                            <Select
                                value={defaultEnv}
                                onChange={setDefaultEnv}
                                options={[
                                    { value: 'development', label: 'Development' },
                                    { value: 'staging', label: 'Staging' },
                                    { value: 'production', label: 'Production' }
                                ]}
                            />
                        </Section>
                        
                        <Section title="Editor Settings" description="Customize your editing experience">
                            <Toggle
                                enabled={autoSave}
                                onChange={setAutoSave}
                                label="Auto-save"
                                description="Automatically save changes as you type"
                            />
                            <Select
                                label="Editor Theme"
                                value={editorTheme}
                                onChange={setEditorTheme}
                                options={[
                                    { value: 'monokai', label: 'Monokai' },
                                    { value: 'dracula', label: 'Dracula' },
                                    { value: 'github-dark', label: 'GitHub Dark' },
                                    { value: 'one-dark', label: 'One Dark Pro' },
                                    { value: 'nord', label: 'Nord' }
                                ]}
                            />
                            <Select
                                label="Font Size"
                                value={fontSize}
                                onChange={setFontSize}
                                options={[
                                    { value: '12', label: '12px' },
                                    { value: '13', label: '13px' },
                                    { value: '14', label: '14px' },
                                    { value: '15', label: '15px' },
                                    { value: '16', label: '16px' }
                                ]}
                            />
                        </Section>
                    </div>
                );
                
            case 'api-keys':
                return (
                    <div>
                        <Section title="API Keys" description="Manage your API keys for programmatic access">
                            <div className="mb-4">
                                <Button size="sm" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Generate New Key
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {apiKeys.map((key) => (
                                    <APIKeyRow
                                        key={key.id}
                                        name={key.name}
                                        maskedKey={key.maskedKey}
                                        createdAt={key.createdAt}
                                        onDelete={() => setApiKeys(apiKeys.filter((k) => k.id !== key.id))}
                                        onCopy={() => navigator.clipboard.writeText(key.maskedKey)}
                                    />
                                ))}
                            </div>
                        </Section>
                        
                        <Section title="Usage" description="Monitor your API usage">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Requests (24h)', value: '12,847' },
                                    { label: 'Tokens Used', value: '2.4M' },
                                    { label: 'Cost (MTD)', value: '$45.23' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </div>
                );
                
            case 'notifications':
                return (
                    <div>
                        <Section title="Email Notifications" description="Configure which emails you receive">
                            <Toggle
                                enabled={emailNotifications}
                                onChange={setEmailNotifications}
                                label="Email Notifications"
                                description="Receive notifications via email"
                            />
                            <Toggle
                                enabled={deploymentAlerts}
                                onChange={setDeploymentAlerts}
                                label="Deployment Alerts"
                                description="Get notified when deployments succeed or fail"
                            />
                            <Toggle
                                enabled={errorAlerts}
                                onChange={setErrorAlerts}
                                label="Error Alerts"
                                description="Receive alerts when error rates spike"
                            />
                            <Toggle
                                enabled={weeklyReport}
                                onChange={setWeeklyReport}
                                label="Weekly Report"
                                description="Receive a weekly summary of your usage"
                            />
                        </Section>
                    </div>
                );
                
            case 'appearance':
                return (
                    <div>
                        <Section title="Theme" description="Choose your preferred color scheme">
                            <div className="grid grid-cols-3 gap-4">
                                <ThemeOption
                                    theme="dark"
                                    currentTheme={theme}
                                    onSelect={setTheme}
                                    icon={Moon}
                                    label="Dark"
                                />
                                <ThemeOption
                                    theme="light"
                                    currentTheme={theme}
                                    onSelect={setTheme}
                                    icon={Sun}
                                    label="Light"
                                />
                                <ThemeOption
                                    theme="system"
                                    currentTheme={theme}
                                    onSelect={setTheme}
                                    icon={Monitor}
                                    label="System"
                                />
                            </div>
                        </Section>
                        
                        <Section title="Accent Color" description="Choose your accent color">
                            <div className="flex items-center gap-3">
                                {['#06b6d4', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setAccentColor(color)}
                                        className={`w-8 h-8 rounded-full transition-all ${
                                            accentColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-white' : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </Section>
                        
                        <Section title="Layout Density" description="Adjust the spacing of interface elements">
                            <Select
                                value={density}
                                onChange={setDensity}
                                options={[
                                    { value: 'compact', label: 'Compact' },
                                    { value: 'comfortable', label: 'Comfortable' },
                                    { value: 'spacious', label: 'Spacious' }
                                ]}
                            />
                        </Section>
                        
                        <Section title="Motion" description="Control animations and transitions">
                            <Toggle
                                enabled={reduceMotion}
                                onChange={setReduceMotion}
                                label="Reduce Motion"
                                description="Minimize animations for accessibility"
                            />
                        </Section>
                    </div>
                );
                
            case 'shortcuts':
                return (
                    <div>
                        <Section title="Keyboard Shortcuts" description="View and customize keyboard shortcuts">
                            <div className="space-y-1 divide-y divide-white/5">
                                {shortcuts.map((shortcut, i) => (
                                    <ShortcutRow
                                        key={i}
                                        action={shortcut.action}
                                        keys={shortcut.keys}
                                    />
                                ))}
                            </div>
                        </Section>
                        <div className="flex gap-3">
                            <Button size="sm" variant="secondary" className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Reset to Defaults
                            </Button>
                        </div>
                    </div>
                );
                
            case 'danger':
                return (
                    <div>
                        <Section title="Export Data" description="Download all your data">
                            <Button size="sm" variant="secondary">
                                Export All Data
                            </Button>
                        </Section>
                        
                        <Section title="Clear Data" description="This will delete all your prompts, deployments, and history">
                            <Button size="sm" variant="secondary" className="text-orange-400 border-orange-400/50 hover:bg-orange-400/10">
                                Clear All Data
                            </Button>
                        </Section>
                        
                        <Section title="Delete Account" description="Permanently delete your account and all associated data">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-400 mb-4">
                                    This action cannot be undone. This will permanently delete your account, 
                                    prompts, API keys, and remove all associations.
                                </p>
                                <Button size="sm" className="bg-red-500 hover:bg-red-600 border-red-500">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </Section>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-60 border-r border-white/10 p-4 flex-shrink-0">
                <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-cyan-500/10 text-cyan-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            } ${tab.id === 'danger' ? 'text-red-400 hover:text-red-300' : ''}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Save button - not shown for danger zone */}
                    {activeTab !== 'danger' && activeTab !== 'shortcuts' && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <Button
                                onClick={handleSave}
                                isLoading={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
