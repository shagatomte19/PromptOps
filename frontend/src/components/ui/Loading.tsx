import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingBarProps {
    isLoading: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-cyan-900/30 overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500 to-indigo-500 animate-loading-bar" />
        </div>
    );
};

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rectangular',
    width,
    height,
    className,
    style,
    ...props
}) => {
    const variants = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md',
    };

    return (
        <div
            className={cn(
                'bg-white/5 animate-pulse',
                variants[variant],
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                ...style,
            }}
            {...props}
        />
    );
};

// Skeleton presets for common UI elements
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="space-y-3">
        <div className="flex gap-4">
            <Skeleton width="30%" height={12} />
            <Skeleton width="20%" height={12} />
            <Skeleton width="25%" height={12} />
            <Skeleton width="15%" height={12} />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
                <Skeleton width="30%" height={20} />
                <Skeleton width="20%" height={20} />
                <Skeleton width="25%" height={20} />
                <Skeleton width="15%" height={20} />
            </div>
        ))}
    </div>
);

export const SkeletonCard: React.FC = () => (
    <div className="p-4 bg-surface border border-white/10 rounded-lg space-y-3">
        <Skeleton width="60%" height={20} />
        <Skeleton width="100%" height={12} />
        <Skeleton width="80%" height={12} />
        <div className="flex gap-2 pt-2">
            <Skeleton width={60} height={24} />
            <Skeleton width={60} height={24} />
        </div>
    </div>
);

export default LoadingBar;
