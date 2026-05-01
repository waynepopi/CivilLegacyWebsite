import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Base skeleton block. Renders a rounded rectangle with the site's shimmer
 * animation. Compose these to match the shape of the real content.
 */
export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('skeleton-shimmer rounded-xl', className)}
    {...props}
  />
);

/** Full team-member card skeleton */
export const TeamCardSkeleton = () => (
  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col">
    {/* Square image placeholder */}
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-8 space-y-4 flex-grow">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="h-px bg-black/10 dark:bg-white/10 w-12 my-4" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

/** Featured carousel card skeleton */
export const ProjectCarouselSkeleton = () => (
  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-8 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-1/3 mt-2" />
    </div>
  </div>
);

/** Project grid card skeleton */
export const ProjectCardSkeleton = () => (
  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="p-4 bg-black/5 dark:bg-black/40 rounded-xl space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

/** Storefront category tab bar skeleton */
export const CategoryTabsSkeleton = () => (
  <div className="flex gap-3 justify-center flex-wrap">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-11 rounded-2xl" style={{ width: `${80 + i * 20}px` }} />
    ))}
  </div>
);

/** Service card skeleton */
export const ServiceCardSkeleton = () => (
  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col">
    <div className="p-8 pb-5 space-y-4">
      <div className="flex items-start justify-between mb-6">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
    <div className="px-8 pb-5 space-y-2 flex-grow">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-4/5" />
      ))}
    </div>
    <div className="px-8 pb-8 pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  </div>
);
