import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, NotebookPen, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { user, login, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  if (user) {
    return <Navigate to="/notes" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try 'password' for demo accounts.",
        variant: "destructive",
      });
    }
    
    setIsLogging(false);
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-gradient-warm rounded-xl shadow-glow">
              <NotebookPen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CozyNotes</h1>
          </div>
          <p className="text-muted-foreground">Your multi-tenant notes workspace</p>
        </div>

        {/* Login Card with Role Tabs */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Choose your role and sign in to your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="member" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Member Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="member" className="space-y-4 mt-6">
                <div className="text-center space-y-1 mb-4">
                  <h3 className="font-medium text-foreground">Team Member Access</h3>
                  <p className="text-sm text-muted-foreground">Access your team's shared notes and collaborate</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your member email"
                      required
                      className="transition-smooth"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="member-password">Password</Label>
                    <Input
                      id="member-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="transition-smooth"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero"
                    className="w-full"
                    disabled={isLogging}
                  >
                    {isLogging ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In as Member'
                    )}
                  </Button>
                </form>

                {/* Member Demo Accounts */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Try member demo accounts:</p>
                  <div className="space-y-2">
                    <Button
                      variant="soft"
                      size="sm"
                      className="w-full text-xs justify-start"
                      onClick={() => fillDemoAccount('member@company1.com')}
                    >
                      👤 Member at Acme Corp (Free plan)
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Password: <code className="bg-muted px-1 rounded">password</code>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="text-center space-y-1 mb-4">
                  <h3 className="font-medium text-foreground">Administrator Access</h3>
                  <p className="text-sm text-muted-foreground">Manage your organization and team settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your admin email"
                      required
                      className="transition-smooth"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="transition-smooth"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero"
                    className="w-full"
                    disabled={isLogging}
                  >
                    {isLogging ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In as Admin'
                    )}
                  </Button>
                </form>

                {/* Admin Demo Accounts */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Try admin demo accounts:</p>
                  <div className="space-y-2">
                    <Button
                      variant="soft"
                      size="sm"
                      className="w-full text-xs justify-start"
                      onClick={() => fillDemoAccount('admin@company1.com')}
                    >
                      🧑‍💼 Admin at Acme Corp (Pro plan)
                    </Button>
                    <Button
                      variant="soft"
                      size="sm"
                      className="w-full text-xs justify-start"
                      onClick={() => fillDemoAccount('admin@company2.com')}
                    >
                      🧑‍💼 Admin at TechFlow Inc (Free plan)
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Password: <code className="bg-muted px-1 rounded">password</code>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;