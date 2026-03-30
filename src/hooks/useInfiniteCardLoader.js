import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_INITIAL_COUNT = 8;
const DEFAULT_INCREMENT_COUNT = 8;
const DEFAULT_ROOT_MARGIN = "320px";
const EMPTY_ITEMS = [];

export default function useInfiniteCardLoader({
    items,
    initialCount = DEFAULT_INITIAL_COUNT,
    incrementCount = DEFAULT_INCREMENT_COUNT,
    resetKey = "",
    rootMargin = DEFAULT_ROOT_MARGIN,
}) {
    const normalizedItems = Array.isArray(items) ? items : EMPTY_ITEMS;
    const [loaderState, setLoaderState] = useState(() => ({
        resetKey,
        visibleCount: Math.min(initialCount, normalizedItems.length),
    }));
    const sentinelRef = useRef(null);

    const visibleCount =
        loaderState.resetKey === resetKey
            ? loaderState.visibleCount
            : Math.min(initialCount, normalizedItems.length);

    const clampedVisibleCount = Math.min(visibleCount, normalizedItems.length);
    const hasMore = clampedVisibleCount < normalizedItems.length;

    const loadMore = useCallback(() => {
        setLoaderState((currentState) => {
            const baseCount =
                currentState.resetKey === resetKey
                    ? currentState.visibleCount
                    : Math.min(initialCount, normalizedItems.length);

            return {
                resetKey,
                visibleCount: Math.min(
                    baseCount + incrementCount,
                    normalizedItems.length,
                ),
            };
        });
    }, [incrementCount, initialCount, normalizedItems.length, resetKey]);

    useEffect(() => {
        if (!hasMore) return undefined;

        const sentinel = sentinelRef.current;
        if (!sentinel) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting) return;

                observer.unobserve(entry.target);
                loadMore();
            },
            {
                root: null,
                rootMargin,
                threshold: 0.01,
            },
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [clampedVisibleCount, hasMore, loadMore, rootMargin]);

    const visibleItems = useMemo(
        () => normalizedItems.slice(0, clampedVisibleCount),
        [clampedVisibleCount, normalizedItems],
    );

    return {
        visibleItems,
        hasMore,
        sentinelRef,
    };
}
