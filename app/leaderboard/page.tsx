'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import Link from 'next/link';

interface TraderRow {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  roi: number;
  winRate: number;
  followersCount: number;
  riskScore: number;
}

export default function LeaderboardPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const [traders, setTraders] = useState<TraderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/traders');
      const json = await response.json();
      setTraders(json.traders ?? []);
      setIsLoading(false);
    };

    load();
  }, []);

  return (
    <main className="flex flex-col bg-background max-lg:h-dvh max-lg:overflow-y-auto lg:min-h-dvh">
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={login}
        onSignUp={signUp}
        onLogout={logout}
        onSwitchAccount={switchAccount}
        logoSrc={logoSrc}
        actions={<ThemeToggle />}
      />
      <div className="h-[76px] shrink-0" />
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6 pb-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Community leaderboard</p>
            <h1 className="text-3xl font-semibold">Top traders</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">Back to trading</Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/traders/1">View sample profile</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Trader</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Risk Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                        Loading leaderboard...
                      </TableCell>
                    </TableRow>
                  ) : traders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                        No traders available yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    traders.map((trader, index) => (
                      <TableRow key={trader.user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Link href={`/traders/${trader.user.id}`} className="font-medium text-primary hover:underline">
                            {trader.user.displayName}
                          </Link>
                        </TableCell>
                        <TableCell>{trader.roi.toFixed(1)}%</TableCell>
                        <TableCell>{trader.winRate.toFixed(1)}%</TableCell>
                        <TableCell>{trader.followersCount}</TableCell>
                        <TableCell>{trader.riskScore}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}
