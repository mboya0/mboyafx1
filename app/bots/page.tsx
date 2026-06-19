'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';

interface BotInfo {
  id: number;
  name: string;
  description?: string;
  performanceStats?: { roi: number; winRate: number };
}

export default function BotsPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const [bots, setBots] = useState<BotInfo[]>([]);

  useEffect(() => {
    setBots([
      { id: 1, name: 'Momentum Miner', description: 'Captures short-term volatility with strict risk controls.', performanceStats: { roi: 12.4, winRate: 68.9 } },
      { id: 2, name: 'Range Guardian', description: 'Manages mean reversion trades in low-volatility markets.', performanceStats: { roi: 7.2, winRate: 60.1 } },
    ]);
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
            <p className="text-sm font-medium text-muted-foreground">Bot builder</p>
            <h1 className="text-3xl font-semibold">Your strategies</h1>
          </div>
          <Button variant="secondary" size="sm">Create new bot</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {bots.map((bot) => (
            <Card key={bot.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>{bot.name}</CardTitle>
                    <CardDescription>{bot.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">ROI</p>
                    <p>{bot.performanceStats?.roi.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Win Rate</p>
                    <p>{bot.performanceStats?.winRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}
