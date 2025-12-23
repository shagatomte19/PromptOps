import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface Prompt {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  status: 'prod' | 'staging' | 'dev';
  model: string;
  system: string;
  user: string;
}

interface WorkspaceContextType {
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string, source?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeEnvironment: 'production' | 'staging' | 'development';
  setActiveEnvironment: (env: 'production' | 'staging' | 'development') => void;
  prompts: Prompt[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeEnvironment, setActiveEnvironment] = useState<'production' | 'staging' | 'development'>('production');
  
  // Mock Data
  const prompts: Prompt[] = [
    { 
      id: '1', 
      name: 'Customer Support Agent', 
      version: 'v2.1.0', 
      updatedAt: '2h ago', 
      status: 'prod', 
      model: 'gpt-4-turbo', 
      system: 'You are a helpful customer support agent for a SaaS platform.',
      user: 'Customer: {{customer_message}}' 
    },
    { 
      id: '2', 
      name: 'SQL Generator', 
      version: 'v1.0.4', 
      updatedAt: '1d ago', 
      status: 'staging', 
      model: 'claude-3-opus',
      system: 'You are an expert Data Engineer. Output only valid SQL.',
      user: 'Schema: {{schema}}\nQuestion: {{question}}' 
    },
  ];

  const addLog = (level: LogEntry['level'], message: string, source = 'System') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      source
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // Initial Boot Log
  useEffect(() => {
    setTimeout(() => addLog('info', 'Workspace initialized', 'Boot'), 500);
    setTimeout(() => addLog('success', 'Connected to Edge Network (us-east-1)', 'Network'), 1200);
  }, []);

  return (
    <WorkspaceContext.Provider value={{ 
      logs, 
      addLog, 
      isLoading, 
      setIsLoading, 
      activeEnvironment, 
      setActiveEnvironment,
      prompts 
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
};