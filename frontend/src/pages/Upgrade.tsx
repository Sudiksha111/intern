import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Upgrade = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/notes" replace />;
  }

  const handleUpgrade = () => {
    toast({
      title: "Upgrade initiated",
      description: "In a real app, this would connect to Stripe for payment processing.",
    });
  };

  const handleDowngrade = () => {
    toast({
      title: "Downgrade requested",
      description: "Contact support to process your downgrade request.",
    });
  };

  const features = {
    free: [
      'Up to 10 notes per workspace',
      'Basic text editor',
      'Tags and organization',
      'Team member access',
      'Email support'
    ],
    pro: [
      'Unlimited notes',
      'Rich text editor with media',
      'Advanced search & filters',
      'Real-time collaboration',
      'Version history',
      'API access',
      'Priority support',
      'Custom integrations'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your {user.tenantName} workspace subscription
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Current Plan</span>
                  <Badge variant={user.subscription === 'pro' ? 'default' : 'secondary'}>
                    {user.subscription === 'pro' ? 'Pro' : 'Free'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {user.subscription === 'pro' 
                    ? 'You have access to all premium features'
                    : 'Upgrade to unlock unlimited notes and premium features'
                  }
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {user.subscription === 'pro' ? '$29' : '$0'}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <Card className={`relative border-border/50 ${user.subscription === 'free' ? 'ring-2 ring-primary shadow-glow' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Free Plan</CardTitle>
                {user.subscription === 'free' && (
                  <Badge variant="outline">Current</Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-foreground">
                $0<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription>Perfect for small teams getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {user.subscription === 'pro' && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDowngrade}
                >
                  Downgrade to Free
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative border-border/50 ${user.subscription === 'pro' ? 'ring-2 ring-primary shadow-glow' : 'ring-1 ring-primary/20'}`}>
            {user.subscription === 'free' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-warm text-white shadow-glow">
                  <Zap className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <span>Pro Plan</span>
                  <Crown className="h-4 w-4 text-primary" />
                </CardTitle>
                {user.subscription === 'pro' && (
                  <Badge className="bg-gradient-warm">Current</Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-foreground">
                $29<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription>Everything you need for growing teams</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {user.subscription === 'free' ? (
                <Button 
                  variant="hero" 
                  className="w-full shadow-glow"
                  onClick={handleUpgrade}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              ) : (
                <div className="text-center p-4 bg-gradient-cool rounded-lg">
                  <Check className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">You're on the Pro plan!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="bg-gradient-subtle border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Why upgrade to Pro?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-gradient-warm rounded-xl w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Scale Your Team</h4>
                <p className="text-sm text-muted-foreground">Remove limits and grow without restrictions</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-gradient-cool rounded-xl w-fit mx-auto mb-3">
                  <Shield className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Advanced Features</h4>
                <p className="text-sm text-muted-foreground">Unlock powerful tools for better productivity</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-accent rounded-xl w-fit mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Priority Support</h4>
                <p className="text-sm text-muted-foreground">Get help when you need it most</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upgrade;