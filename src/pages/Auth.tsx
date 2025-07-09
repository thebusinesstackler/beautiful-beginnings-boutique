
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    } else if (user) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf6ee' }}>
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-lg border-0" style={{ backgroundColor: '#ffffff' }}>
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2" style={{ color: '#5B4C37' }}>
              Admin Login
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#5B4C37' }}>
              Sign in to manage your products and website
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#5B4C37' }}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 border-2 focus:ring-0 focus:border-opacity-70"
                  style={{ 
                    borderColor: '#A89B84',
                    backgroundColor: '#faf6ee',
                    color: '#000000'
                  }}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#5B4C37' }}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 border-2 focus:ring-0 focus:border-opacity-70"
                  style={{ 
                    borderColor: '#A89B84',
                    backgroundColor: '#faf6ee',
                    color: '#000000'
                  }}
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <Alert className="border-0" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full h-12 text-white font-semibold text-base hover:opacity-90 transition-opacity border-0" 
                disabled={loading}
                style={{ backgroundColor: '#E28F84' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
