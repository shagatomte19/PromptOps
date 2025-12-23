import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'bordered';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    className,
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-surface border border-white/10',
        glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
        bordered: 'bg-transparent border border-white/10',
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    return (
        <div
            className={cn(
                'rounded-lg transition-all duration-200',
                variants[variant],
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div className={cn('pb-4 border-b border-white/10', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    className,
    children,
    ...props
}) => (
    <h3 className={cn('text-lg font-semibold text-white', className)} {...props}>
        {children}
    </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div className={cn('pt-4', className)} {...props}>
        {children}
    </div>
);

export default Card;
