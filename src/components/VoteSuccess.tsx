import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Trophy, Users, Clock } from 'lucide-react';

const VoteSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable back navigation
    history.pushState(null, "", location.href);
    const handlePopState = () => history.go(1);
    window.addEventListener("popstate", handlePopState);

    // Disable certain keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.keyCode === 82) || // Ctrl+R
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="vote-card bg-white/95 backdrop-blur-sm border-0 max-w-lg w-full">
        <div className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center college-glow">
            <CheckCircle className="h-12 w-12 text-success animate-vote-success" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient">
              Vote Submitted Successfully!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for participating in the College Elections 2024
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-foreground">Your vote has been recorded securely</span>
            </div>
            <div className="flex items-center space-x-3">
              <Trophy className="h-5 w-5 text-warning" />
              <span className="text-foreground">Results will be announced after voting ends</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-foreground">Your participation makes democracy stronger</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-foreground">Voting closes at 11:59 PM today</span>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-muted rounded-lg text-left">
            <h3 className="font-semibold text-sm mb-2">Important Notice:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Your vote is completely anonymous and secure</li>
              <li>• You cannot change your vote once submitted</li>
              <li>• Results will be published on the college website</li>
              <li>• Contact admin for any issues or concerns</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/results')}
              className="w-full h-12"
            >
              <Trophy className="h-5 w-5 mr-2" />
              View Live Results
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Return to Login
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              College Elections 2024 • Powered by Secure Voting System
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VoteSuccess;