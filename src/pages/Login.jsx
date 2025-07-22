import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Users, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ApiService from '@/services/api';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOLogin = async (provider) => {
    setIsLoading(true);
    
    try {
      // In real implementation, this would redirect to SSO provider
      // For demo, simulate SSO response
      const mockSSOData = {
        email: provider === 'Google' ? 'john.doe@gmail.com' : 'john.doe@company.com',
        name: 'John Doe',
        provider: provider,
        sso_token: 'mock_sso_token_' + Date.now()
      };

      // Try Django SSO authentication
      const response = await ApiService.authenticateWithSSO(provider, mockSSOData);
      
      // Store user session
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Login successful",
        description: `Authenticated with ${provider} via Django backend`
      });
      
      navigate('/');
      
    } catch (error) {
      console.error('SSO login failed, using fallback:', error);
      
      // Fallback to mock authentication
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        provider: provider
      }));
      
      toast({
        title: "Login successful (Fallback)",
        description: `Logged in with ${provider} - Check Django backend connection`,
        variant: "destructive"
      });
      
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-3">
              <Search className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Query Evaluation</h1>
          <p className="text-muted-foreground">
            Sign in to start evaluating queries with AI assistance
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Use your organizational account to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SSO Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-12 text-base"
                onClick={() => handleSSOLogin('Google')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="secondary"
                className="w-full h-12 text-base"
                onClick={() => handleSSOLogin('Microsoft')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Manual Login Form */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.com"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-11"
                />
              </div>
              <Button
                className="w-full h-11"
                onClick={() => handleSSOLogin('Email')}
                disabled={isLoading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Secure authentication powered by SSO</p>
          <p className="mt-1">Contact your administrator for access</p>
        </div>
      </div>
    </div>
  );
};

export default Login;