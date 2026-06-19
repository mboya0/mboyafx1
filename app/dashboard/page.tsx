'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';

export default function DashboardPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const [stats, setStats] = useState({ roi: 0, winRate: 0, followers: 0 });

  useEffect(() => {
    setStats({ roi: 4.9, winRate: 63.2, followers: 28 });
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
            <p className="text-sm font-medium text-muted-foreground">Performance dashboard</p>
            <h1 className="text-3xl font-semibold">Your trading insights</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => window.location.assign('/copy-trading')}>
              Copy trading
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.location.assign('/bots')}>
              Bot builder
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{stats.roi.toFixed(1)}%</p>
              <p className="mt-2 text-sm text-muted-foreground">Trailing 30-day return on investment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{stats.winRate.toFixed(1)}%</p>
              <p className="mt-2 text-sm text-muted-foreground">Winning trades percentage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{stats.followers}</p>
              <p className="mt-2 text-sm text-muted-foreground">Active copy trading followers</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Latest activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>New follower joined your copy strategy.</li>
                <li>High-risk exposure flagged for EUR/USD trades.</li>
                <li>Bot template conversion rate improved by 18%.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Strategy dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Quick access to your top performing bots, risk settings, and trade execution summary.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}
