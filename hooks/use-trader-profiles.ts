import { useState, useEffect, useCallback } from 'react';

export interface TraderProfile {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
  };
  riskScore: number;
  winRate: number;
  roi: number;
  followersCount: number;
  tagline?: string;
}

export function useTraderProfile(traderId: string | null) {
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!traderId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const response = await fetch(`/api/traders/${traderId}`);
    if (response.ok) {
      const json = await response.json();
      setProfile(json.trader);
    } else {
      setProfile(null);
    }
    setIsLoading(false);
  }, [traderId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return { profile, isLoading, refresh: loadProfile };
}
