import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  Vote, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Download,
  Eye,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateElectionDialog from './CreateElectionDialog';
import GeneratePINsDialog from './GeneratePINsDialog';
import ExportPINsDialog from './ExportPINsDialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const electionStats = {
    totalVoters: 1250,
    votedCount: 687,
    remainingVoters: 563,
    turnoutPercentage: 55
  };

  const results = [
    {
      post: 'Student Body President',
      candidates: [
        { name: 'Alex Johnson', votes: 342, percentage: 49.8 },
        { name: 'Sarah Williams', votes: 345, percentage: 50.2 }
      ]
    },
    {
      post: 'Vice President',
      candidates: [
        { name: 'Michael Chen', votes: 298, percentage: 43.4 },
        { name: 'Emma Davis', votes: 389, percentage: 56.6 }
      ]
    }
  ];

  const recentPINs = [
    { id: 'VOTE2024001', status: 'used', usedAt: '2024-03-15 10:30 AM' },
    { id: 'VOTE2024002', status: 'active', usedAt: null },
    { id: 'VOTE2024003', status: 'active', usedAt: null },
    { id: 'VOTE2024004', status: 'used', usedAt: '2024-03-15 11:15 AM' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">College Elections 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/results')}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Results
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="pins">Voter PINs</TabsTrigger>
            <TabsTrigger value="results">Live Results</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="vote-card">
                <div className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{electionStats.totalVoters}</h3>
                  <p className="text-muted-foreground">Total Voters</p>
                </div>
              </Card>
              
              <Card className="vote-card">
                <div className="p-6 text-center">
                  <Vote className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{electionStats.votedCount}</h3>
                  <p className="text-muted-foreground">Votes Cast</p>
                </div>
              </Card>
              
              <Card className="vote-card">
                <div className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-warning mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{electionStats.turnoutPercentage}%</h3>
                  <p className="text-muted-foreground">Turnout</p>
                </div>
              </Card>
              
              <Card className="vote-card">
                <div className="p-6 text-center">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{electionStats.remainingVoters}</h3>
                  <p className="text-muted-foreground">Pending Votes</p>
                </div>
              </Card>
            </div>

            {/* Quick Results Preview */}
            <Card className="vote-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Quick Results Preview</h2>
                  <Button onClick={() => setActiveTab('results')} size="sm">
                    View Full Results
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {results.slice(0, 2).map((result, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium">{result.post}</h3>
                      <div className="space-y-1">
                        {result.candidates.map((candidate, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span>{candidate.name}</span>
                            <div className="flex items-center space-x-2">
                              <span>{candidate.votes} votes</span>
                              <Badge variant={i === 0 ? "default" : "secondary"}>
                                {candidate.percentage}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Election Management</h2>
              <CreateElectionDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Election
                </Button>
              </CreateElectionDialog>
            </div>
            
            <Card className="vote-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Current Election</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">College Elections 2024</h4>
                      <p className="text-sm text-muted-foreground">March 15, 2024 • 9:00 AM - 11:59 PM</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Positions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-sm text-muted-foreground">Candidates</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">1250</p>
                      <p className="text-sm text-muted-foreground">Eligible Voters</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* PINs Tab */}
          <TabsContent value="pins" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Voter PIN Management</h2>
              <div className="flex space-x-2">
                <ExportPINsDialog>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PINs
                  </Button>
                </ExportPINsDialog>
                <GeneratePINsDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate PINs
                  </Button>
                </GeneratePINsDialog>
              </div>
            </div>
            
            <Card className="vote-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent PIN Activity</h3>
                  <Input 
                    placeholder="Search PIN..." 
                    className="max-w-xs"
                  />
                </div>
                
                <div className="space-y-3">
                  {recentPINs.map((pin) => (
                    <div key={pin.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                          {pin.id}
                        </code>
                        <Badge variant={pin.status === 'used' ? 'secondary' : 'default'}>
                          {pin.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pin.usedAt || 'Not used'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Live Election Results</h2>
              <Button onClick={() => navigate('/results')}>
                <Eye className="h-4 w-4 mr-2" />
                Public Results View
              </Button>
            </div>
            
            <div className="grid gap-6">
              {results.map((result, index) => (
                <Card key={index} className="vote-card">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{result.post}</h3>
                    <div className="space-y-4">
                      {result.candidates.map((candidate, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{candidate.name}</span>
                              {i === 0 && candidate.percentage > 50 && (
                                <Trophy className="h-4 w-4 text-warning" />
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">{candidate.votes} votes</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({candidate.percentage}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                i === 0 ? 'bg-primary' : 'bg-muted-foreground'
                              }`}
                              style={{ width: `${candidate.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;