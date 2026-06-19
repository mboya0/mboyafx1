'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { useCopySubscriptions } from '@/hooks/use-copy-subscriptions';

export default function CopyTradingPage() {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const { subscriptions, isLoading } = useCopySubscriptions(auth.activeAccountId);

  const activeCount = useMemo(() => subscriptions.filter((sub) => sub.isActive).length, [subscriptions]);

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
            <p className="text-sm font-medium text-muted-foreground">Copy trading</p>
            <h1 className="text-3xl font-semibold">Manage your traders</h1>
            <p className="text-sm text-muted-foreground">{activeCount} active subscription{activeCount === 1 ? '' : 's'}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => router.push('/leaderboard')}>
            Find traders
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Active subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trader</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-sm text-muted-foreground">
                        Loading subscriptions...
                      </TableCell>
                    </TableRow>
                  ) : subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-sm text-muted-foreground">
                        No copy trading subscriptions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.trader.displayName}</TableCell>
                        <TableCell>{sub.allocation.toFixed(2)}x</TableCell>
                        <TableCell>{sub.isActive ? 'Active' : 'Paused'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="destructive">Stop</Button>
                          </div>
                        </TableCell>
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
