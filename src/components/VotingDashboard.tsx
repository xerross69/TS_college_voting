import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Vote, Check, User, GraduationCap, LogOut } from 'lucide-react';
import candidate1 from '@/assets/candidate1.jpg';
import candidate2 from '@/assets/candidate2.jpg';
import candidate3 from '@/assets/candidate3.jpg';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  department: string;
  year: string;
  photo: string;
}

interface Post {
  id: string;
  title: string;
  candidates: Candidate[];
}

const VotingDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

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

  const posts: Post[] = [
    {
      id: 'president',
      title: 'Student Body President',
      candidates: [
        {
          id: 'cand1',
          name: 'Alex Johnson',
          department: 'Computer Science',
          year: 'Final Year',
          photo: candidate1
        },
        {
          id: 'cand2',
          name: 'Sarah Williams',
          department: 'Business Administration',
          year: 'Third Year',
          photo: candidate2
        }
      ]
    },
    {
      id: 'vicepresident',
      title: 'Vice President',
      candidates: [
        {
          id: 'cand3',
          name: 'Michael Chen',
          department: 'Engineering',
          year: 'Final Year',
          photo: candidate3
        },
        {
          id: 'cand4',
          name: 'Emma Davis',
          department: 'Liberal Arts',
          year: 'Third Year',
          photo: candidate1
        }
      ]
    },
    {
      id: 'secretary',
      title: 'Secretary',
      candidates: [
        {
          id: 'cand5',
          name: 'David Kim',
          department: 'Mathematics',
          year: 'Second Year',
          photo: candidate2
        },
        {
          id: 'cand6',
          name: 'Lisa Anderson',
          department: 'Psychology',
          year: 'Final Year',
          photo: candidate3
        }
      ]
    }
  ];

  const currentPost = posts[currentPostIndex];
  const totalPosts = posts.length;
  const completedVotes = Object.keys(votes).length;
  const progressPercentage = (completedVotes / totalPosts) * 100;

  const handleVote = (candidateId: string) => {
    setVotes({ ...votes, [currentPost.id]: candidateId });
    
    toast({
      title: "Vote Recorded",
      description: `Your vote for ${currentPost.title} has been recorded.`,
    });

    // Auto-advance to next post after a short delay
    if (currentPostIndex < totalPosts - 1) {
      setTimeout(() => {
        setCurrentPostIndex(currentPostIndex + 1);
      }, 1000);
    }
  };

  const handlePrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPostIndex < totalPosts - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  const handleSubmitAll = () => {
    if (completedVotes === totalPosts) {
      navigate('/confirmation', { state: { votes, posts } });
    } else {
      toast({
        title: "Incomplete Voting",
        description: "Please vote for all positions before submitting.",
        variant: "destructive"
      });
    }
  };

  const isPostVoted = (postId: string) => !!votes[postId];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Vote className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">College Elections 2024</h1>
              <p className="text-sm text-muted-foreground">Voting Dashboard</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Progress Section */}
        <Card className="vote-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Voting Progress</h2>
              <Badge variant={completedVotes === totalPosts ? "default" : "secondary"}>
                {completedVotes}/{totalPosts} Completed
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-2">
              {posts.map((post, index) => (
                <div key={post.id} className="flex flex-col items-center space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isPostVoted(post.id) 
                      ? 'bg-success text-success-foreground' 
                      : index === currentPostIndex 
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isPostVoted(post.id) ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-xs text-center max-w-16">{post.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Current Post */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gradient mb-2">
              {currentPost.title}
            </h2>
            <p className="text-muted-foreground">
              Choose your candidate for this position
            </p>
          </div>

          {/* Candidates Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {currentPost.candidates.map((candidate) => (
              <Card key={candidate.id} className="candidate-card">
                <div className="p-6 text-center space-y-4">
                  <div className="relative">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {votes[currentPost.id] === candidate.id && (
                      <div className="absolute inset-0 rounded-full bg-success/20 flex items-center justify-center">
                        <div className="bg-success text-success-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{candidate.department}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{candidate.year}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleVote(candidate.id)}
                    disabled={!!votes[currentPost.id]}
                    variant={votes[currentPost.id] === candidate.id ? "default" : "outline"}
                    className="w-full h-12 text-lg"
                  >
                    {votes[currentPost.id] === candidate.id ? (
                      <div className="flex items-center space-x-2">
                        <Check className="h-5 w-5" />
                        <span>Voted</span>
                      </div>
                    ) : votes[currentPost.id] ? (
                      'Vote Cast'
                    ) : (
                      'Vote for This Candidate'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentPostIndex === 0}
            variant="outline"
          >
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Position {currentPostIndex + 1} of {totalPosts}
            </p>
          </div>

          {currentPostIndex === totalPosts - 1 ? (
            <Button
              onClick={handleSubmitAll}
              className="bg-success hover:bg-success/90 text-success-foreground"
              disabled={completedVotes !== totalPosts}
            >
              Submit All Votes
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentPostIndex === totalPosts - 1}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingDashboard;