import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Vote, ArrowLeft, Send, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoteConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { votes, posts } = location.state || { votes: {}, posts: [] };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Vote Submitted Successfully!",
      description: "Your votes have been recorded securely.",
    });
    
    navigate('/success');
    setIsSubmitting(false);
  };

  const getSelectedCandidate = (postId: string) => {
    const post = posts.find((p: any) => p.id === postId);
    const candidateId = votes[postId];
    return post?.candidates.find((c: any) => c.id === candidateId);
  };

  if (!votes || Object.keys(votes).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="vote-card max-w-md">
          <div className="p-8 text-center">
            <Vote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Votes Found</h2>
            <p className="text-muted-foreground mb-6">
              It looks like you haven't cast any votes yet.
            </p>
            <Button onClick={() => navigate('/voting')}>
              Go to Voting
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <h1 className="text-xl font-semibold">Vote Confirmation</h1>
              <p className="text-sm text-muted-foreground">Review your selections</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/voting')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Voting</span>
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Confirmation Message */}
        <Alert className="border-success text-success-foreground bg-success/10">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-base">
            Please review your selections carefully. Once submitted, your votes cannot be changed.
          </AlertDescription>
        </Alert>

        {/* Vote Summary */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gradient mb-2">
              Your Vote Summary
            </h2>
            <p className="text-muted-foreground">
              Review your selections for all positions
            </p>
          </div>

          <div className="grid gap-6">
            {posts.map((post: any) => {
              const selectedCandidate = getSelectedCandidate(post.id);
              
              return (
                <Card key={post.id} className="vote-card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
                    
                    {selectedCandidate && (
                      <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                        <img
                          src={selectedCandidate.photo}
                          alt={selectedCandidate.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-success"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-medium">{selectedCandidate.name}</h4>
                          <p className="text-muted-foreground">
                            {selectedCandidate.department} • {selectedCandidate.year}
                          </p>
                        </div>
                        <Trophy className="h-6 w-6 text-success" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Confirmation Actions */}
        <Card className="vote-card bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="p-8 text-center space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Ready to Submit?</h3>
              <p className="text-muted-foreground">
                By clicking "Submit Vote", you confirm that your selections are final and cannot be changed.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/voting')}
                variant="outline"
                className="h-12 px-8"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back & Edit
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 px-8 bg-success hover:bg-success/90 text-success-foreground"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Submit Vote</span>
                  </div>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Your vote is anonymous and secure. Thank you for participating in the democratic process.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VoteConfirmation;