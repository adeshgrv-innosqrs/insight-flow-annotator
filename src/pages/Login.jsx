import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Shield, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ApiService from '@/services/api';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSSOLogin = async (provider) => {
    setIsLoading(true);

    try {
      const mockSSOData = {
        email: provider === 'Google' ? 'john.doe@gmail.com' : 'john.doe@company.com',
        name: 'John Doe',
        provider: provider,
        sso_token: 'mock_sso_token_' + Date.now()
      };

      const response = await ApiService.authenticateWithSSO(provider, mockSSOData);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast({
        title: "Login successful",
        description: `Authenticated with ${provider}`
      });

      navigate('/');
    } catch (error) {
      console.error('SSO login failed, using fallback:', error);

      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        provider: provider
      }));

      toast({
        title: "Login successful (Fallback)",
        description: `Logged in with ${provider} - Backend not connected`,
        variant: "destructive"
      });

      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-blue-500 shadow-lg">
              <Brain className="h-8 w-8 text-red-700" />
            </div>

          </div>
          <h1 className="text-3xl font-bold text-foreground">Query Evaluation</h1>
          <p className="text-muted-foreground">Sign in to start evaluating queries with AI</p>
        </div>

        {/* Card */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in with your organizational account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Optional Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* SSO Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSSOLogin('Google')}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <Button
                onClick={() => handleSSOLogin('Microsoft')}
                disabled={isLoading}
                variant="outline"
                className="w-full border-2 hover:bg-secondary/50 transition-all duration-300"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M0 0h11.377v11.377H0z" />
                  <path fill="#00a4ef" d="M12.623 0H24v11.377H12.623z" />
                  <path fill="#7fba00" d="M0 12.623h11.377V24H0z" />
                  <path fill="#ffb900" d="M12.623 12.623H24V24H12.623z" />
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            {/* Secure Info */}
            <div className="pt-4 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Enterprise SSO</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>This is a demo interface. In production, this would connect to your organization’s SSO provider.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
