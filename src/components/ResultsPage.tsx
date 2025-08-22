import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, BarChart3, ArrowLeft, Crown, Medal } from 'lucide-react';
import candidate1 from '@/assets/candidate1.jpg';
import candidate2 from '@/assets/candidate2.jpg';
import candidate3 from '@/assets/candidate3.jpg';

const ResultsPage = () => {
  const navigate = useNavigate();

  const electionResults = [
    {
      post: 'Student Body President',
      totalVotes: 687,
      candidates: [
        {
          id: 'cand2',
          name: 'Sarah Williams',
          department: 'Business Administration',
          year: 'Third Year',
          photo: candidate2,
          votes: 345,
          percentage: 50.2,
          winner: true
        },
        {
          id: 'cand1',
          name: 'Alex Johnson',
          department: 'Computer Science', 
          year: 'Final Year',
          photo: candidate1,
          votes: 342,
          percentage: 49.8,
          winner: false
        }
      ]
    },
    {
      post: 'Vice President',
      totalVotes: 687,
      candidates: [
        {
          id: 'cand4',
          name: 'Emma Davis',
          department: 'Liberal Arts',
          year: 'Third Year',
          photo: candidate1,
          votes: 389,
          percentage: 56.6,
          winner: true
        },
        {
          id: 'cand3',
          name: 'Michael Chen',
          department: 'Engineering',
          year: 'Final Year',
          photo: candidate3,
          votes: 298,
          percentage: 43.4,
          winner: false
        }
      ]
    },
    {
      post: 'Secretary',
      totalVotes: 687,
      candidates: [
        {
          id: 'cand6',
          name: 'Lisa Anderson',
          department: 'Psychology',
          year: 'Final Year',
          photo: candidate3,
          votes: 378,
          percentage: 55.0,
          winner: true
        },
        {
          id: 'cand5',
          name: 'David Kim',
          department: 'Mathematics',
          year: 'Second Year',
          photo: candidate2,
          votes: 309,
          percentage: 45.0,
          winner: false
        }
      ]
    }
  ];

  const overallStats = {
    totalVoters: 1250,
    totalVotes: 687,
    turnout: 55
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
            <Badge className="bg-white/20 text-white border-white/20">
              Live Results
            </Badge>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              College Elections 2024 Results
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Official Election Results - Real-time Updates
            </p>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{overallStats.totalVoters}</div>
                <div className="text-sm text-white/80">Total Eligible Voters</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{overallStats.totalVotes}</div>
                <div className="text-sm text-white/80">Votes Cast</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Trophy className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{overallStats.turnout}%</div>
                <div className="text-sm text-white/80">Voter Turnout</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Winners Announcement */}
        <Card className="vote-card bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="p-8 text-center">
            <Trophy className="h-16 w-16 text-warning mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gradient mb-6">
              🎉 Congratulations to Our Winners! 🎉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {electionResults.map((result) => {
                const winner = result.candidates.find(c => c.winner);
                return (
                  <div key={result.post} className="text-center">
                    <div className="relative mb-3">
                      <img
                        src={winner?.photo}
                        alt={winner?.name}
                        className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-warning"
                      />
                      <Crown className="absolute -top-2 -right-2 h-8 w-8 text-warning" />
                    </div>
                    <h3 className="font-semibold text-lg">{winner?.name}</h3>
                    <p className="text-primary font-medium">{result.post}</p>
                    <p className="text-sm text-muted-foreground">{winner?.percentage}% votes</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Detailed Results by Position</h2>
          
          {electionResults.map((result, index) => (
            <Card key={result.post} className="vote-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">{result.post}</h3>
                  <Badge variant="outline">
                    {result.totalVotes} total votes
                  </Badge>
                </div>
                
                <div className="grid gap-6">
                  {result.candidates
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate, candidateIndex) => (
                    <div key={candidate.id} className="space-y-4">
                      <div className="flex items-center space-x-6">
                        {/* Ranking */}
                        <div className="flex-shrink-0">
                          {candidateIndex === 0 ? (
                            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-warning" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <Medal className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Candidate Info */}
                        <div className="flex items-center space-x-4 flex-1">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className={`w-16 h-16 rounded-full object-cover border-4 ${
                              candidate.winner ? 'border-warning' : 'border-muted'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold">{candidate.name}</h4>
                              {candidate.winner && (
                                <Crown className="h-5 w-5 text-warning" />
                              )}
                            </div>
                            <p className="text-muted-foreground">
                              {candidate.department} • {candidate.year}
                            </p>
                          </div>
                        </div>

                        {/* Vote Stats */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold">{candidate.votes}</div>
                          <div className="text-sm text-muted-foreground">votes</div>
                        </div>

                        <div className="text-right flex-shrink-0 min-w-[80px]">
                          <div className="text-xl font-semibold">{candidate.percentage}%</div>
                          {candidate.winner && (
                            <Badge className="bg-success text-success-foreground">
                              Winner
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="ml-18">
                        <Progress 
                          value={candidate.percentage} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Election Info */}
        <Card className="vote-card">
          <div className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold">Election Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Election Date</p>
                <p className="text-muted-foreground">March 15, 2024</p>
              </div>
              <div>
                <p className="font-medium">Voting Period</p>
                <p className="text-muted-foreground">9:00 AM - 11:59 PM</p>
              </div>
              <div>
                <p className="font-medium">Total Positions</p>
                <p className="text-muted-foreground">3 Positions</p>
              </div>
              <div>
                <p className="font-medium">System</p>
                <p className="text-muted-foreground">Secure Online Voting</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Results are updated in real-time. All votes are verified and secure.
                <br />
                For questions, contact the Election Commission.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;