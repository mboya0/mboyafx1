'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Header } from '@/components/custom/header';
import { Footer } from '@/components/custom/footer';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { useTraderProfile } from '@/hooks/use-trader-profiles';

interface TraderPageProps {
  params: {
    traderId: string;
  };
}

export default function TraderProfilePage({ params }: TraderPageProps) {
  const router = useRouter();
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const { profile: trader, isLoading } = useTraderProfile(params.traderId);

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
      <div className="flex-1 w-full max-w-5xl mx-auto px-3 py-4 sm:px-4 sm:py-6 pb-14">
        <Button variant="link" size="sm" onClick={() => router.back()}>
          ← Back
        </Button>

        {isLoading ? (
          <div className="mt-10 text-center text-sm text-muted-foreground">Loading profile…</div>
        ) : trader ? (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trader profile</p>
                  <CardTitle>{trader.user.displayName}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Follow</Button>
                  <Button variant="secondary" size="sm">Copy trades</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl text-primary">
                      {trader.user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{trader.tagline ?? 'Experienced trader'}</p>
                      <p className="text-sm text-muted-foreground">{trader.user.bio ?? 'No bio added yet.'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-3xl font-semibold">{trader.roi.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-3xl font-semibold">{trader.winRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="mt-3 text-sm leading-6 text-foreground">
                    {trader.user.bio ?? 'This trader has not added a profile description yet.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Followers</p>
                  <p className="text-3xl font-semibold">{trader.followersCount}</p>
                </div>
                <div className="rounded-3xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Risk score</p>
                  <p className="text-3xl font-semibold">{trader.riskScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 text-center text-sm text-destructive">Trader not found.</div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}
