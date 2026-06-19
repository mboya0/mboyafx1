import { useState, useEffect, useCallback } from 'react';

interface CopySubscriptionRow {
  id: number;
  allocation: number;
  isActive: boolean;
  trader: {
    id: string;
    displayName: string;
  };
}

export interface UseCopySubscriptionsReturn {
  subscriptions: CopySubscriptionRow[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useCopySubscriptions(activeAccountId: string | null): UseCopySubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<CopySubscriptionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    if (!activeAccountId) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const response = await fetch('/api/copy-subscriptions', {
      headers: { 'x-deriv-login-id': activeAccountId },
    });
    if (response.ok) {
      const json = await response.json();
      setSubscriptions(json.subscriptions ?? []);
    } else {
      setSubscriptions([]);
    }
    setIsLoading(false);
  }, [activeAccountId]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  return { subscriptions, isLoading, refresh: loadSubscriptions };
}
