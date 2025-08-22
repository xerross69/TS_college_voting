import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Shield, CheckCircle } from 'lucide-react';
import collegeLogo from '@/assets/college-logo.png';
import { useToast } from '@/hooks/use-toast';

const VoterLogin = () => {
  const [voterKey, setVoterKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock voter keys for demo
  const validKeys = ['VOTE2024001', 'VOTE2024002', 'VOTE2024003', 'DEMO123'];
  const usedKeys = ['VOTE2024004']; // Simulated used keys

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!voterKey.trim()) {
      setError('Please enter your voter key');
      setIsLoading(false);
      return;
    }

    if (usedKeys.includes(voterKey)) {
      setError('This voter key has already been used');
      setIsLoading(false);
      return;
    }

    if (!validKeys.includes(voterKey)) {
      setError('Invalid voter key. Please check and try again.');
      setIsLoading(false);
      return;
    }

    toast({
      title: "Login Successful",
      description: "Welcome to the voting system!",
    });
    
    navigate('/voting');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* College Branding */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 mb-6 relative">
            <img 
              src={collegeLogo} 
              alt="College Logo" 
              className="w-full h-full object-contain rounded-full bg-white/20 backdrop-blur-sm p-2"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            College Elections 2024
          </h1>
          <p className="text-white/80 text-lg">
            Secure Online Voting System
          </p>
        </div>

        {/* Login Card */}
        <Card className="vote-card bg-white/95 backdrop-blur-sm border-0">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <Vote className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">
                Voter Login
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter your unique voter key to access the ballot
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="voterKey" className="text-sm font-medium text-foreground">
                  Voter Key (PIN)
                </label>
                <Input
                  id="voterKey"
                  type="text"
                  placeholder="Enter your voter key"
                  value={voterKey}
                  onChange={(e) => setVoterKey(e.target.value.toUpperCase())}
                  className="h-12 text-center text-lg font-mono tracking-wider"
                  maxLength={20}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Vote className="h-5 w-5" />
                    <span>Login to Vote</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                <span>Secure and Anonymous Voting</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>One Vote Per Student</span>
              </div>
            </div>

            {/* Demo Keys */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">Demo Keys:</p>
              <div className="flex flex-wrap gap-2">
                {validKeys.slice(0, 2).map((key) => (
                  <button
                    key={key}
                    onClick={() => setVoterKey(key)}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-mono hover:bg-primary/20 transition-colors"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Admin Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-white/60 hover:text-white text-sm underline transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;