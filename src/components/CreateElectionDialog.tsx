import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  Upload, 
  User,
  Calendar,
  Clock,
  Trophy,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  department: string;
  year: string;
  photo: File | null;
  photoPreview: string | null;
}

interface Position {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

interface CreateElectionDialogProps {
  children: React.ReactNode;
}

const CreateElectionDialog = ({ children }: CreateElectionDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [electionTitle, setElectionTitle] = useState('');
  const [electionDescription, setElectionDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);

  const addPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      title: '',
      description: '',
      candidates: []
    };
    setPositions([...positions, newPosition]);
  };

  const removePosition = (positionId: string) => {
    setPositions(positions.filter(p => p.id !== positionId));
  };

  const updatePosition = (positionId: string, field: string, value: string) => {
    setPositions(positions.map(p => 
      p.id === positionId ? { ...p, [field]: value } : p
    ));
  };

  const addCandidate = (positionId: string) => {
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: '',
      department: '',
      year: '',
      photo: null,
      photoPreview: null
    };
    
    setPositions(positions.map(p => 
      p.id === positionId 
        ? { ...p, candidates: [...p.candidates, newCandidate] }
        : p
    ));
  };

  const removeCandidate = (positionId: string, candidateId: string) => {
    setPositions(positions.map(p => 
      p.id === positionId 
        ? { ...p, candidates: p.candidates.filter(c => c.id !== candidateId) }
        : p
    ));
  };

  const updateCandidate = (positionId: string, candidateId: string, field: string, value: string) => {
    setPositions(positions.map(p => 
      p.id === positionId 
        ? {
            ...p, 
            candidates: p.candidates.map(c => 
              c.id === candidateId ? { ...c, [field]: value } : c
            )
          }
        : p
    ));
  };

  const handlePhotoUpload = (positionId: string, candidateId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoPreview = e.target?.result as string;
      setPositions(positions.map(p => 
        p.id === positionId 
          ? {
              ...p, 
              candidates: p.candidates.map(c => 
                c.id === candidateId 
                  ? { ...c, photo: file, photoPreview }
                  : c
              )
            }
          : p
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!electionTitle || !startDate || !endDate || positions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one position.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    toast({
      title: "Election Created Successfully!",
      description: `${electionTitle} has been created with ${positions.length} positions.`,
    });
    
    // Reset form
    setElectionTitle('');
    setElectionDescription('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setPositions([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Create New Election</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Election Basic Info */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Election Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Election Title *</Label>
                <Input
                  id="title"
                  value={electionTitle}
                  onChange={(e) => setElectionTitle(e.target.value)}
                  placeholder="e.g., College Elections 2024"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={electionDescription}
                  onChange={(e) => setElectionDescription(e.target.value)}
                  placeholder="Brief description of the election"
                />
              </div>
              
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Positions and Candidates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Positions & Candidates</h3>
              <Button onClick={addPosition} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </div>

            {positions.map((position, positionIndex) => (
              <Card key={position.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">
                    Position {positionIndex + 1}
                  </Badge>
                  <Button
                    onClick={() => removePosition(position.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Position Title *</Label>
                    <Input
                      value={position.title}
                      onChange={(e) => updatePosition(position.id, 'title', e.target.value)}
                      placeholder="e.g., Student Body President"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={position.description}
                      onChange={(e) => updatePosition(position.id, 'description', e.target.value)}
                      placeholder="Brief description of the position"
                    />
                  </div>
                </div>

                {/* Candidates for this position */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Candidates</h4>
                    <Button
                      onClick={() => addCandidate(position.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Candidate
                    </Button>
                  </div>

                  {position.candidates.map((candidate, candidateIndex) => (
                    <Card key={candidate.id} className="p-3 bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">
                          Candidate {candidateIndex + 1}
                        </Badge>
                        <Button
                          onClick={() => removeCandidate(position.id, candidate.id)}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={candidate.name}
                            onChange={(e) => updateCandidate(position.id, candidate.id, 'name', e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Input
                            value={candidate.department}
                            onChange={(e) => updateCandidate(position.id, candidate.id, 'department', e.target.value)}
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div>
                          <Label>Year/Class</Label>
                          <Input
                            value={candidate.year}
                            onChange={(e) => updateCandidate(position.id, candidate.id, 'year', e.target.value)}
                            placeholder="e.g., Final Year"
                          />
                        </div>
                        <div>
                          <Label>Photo</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handlePhotoUpload(position.id, candidate.id, file);
                                }
                              }}
                              className="hidden"
                              id={`photo-${position.id}-${candidate.id}`}
                            />
                            <label
                              htmlFor={`photo-${position.id}-${candidate.id}`}
                              className="cursor-pointer"
                            >
                              <Button type="button" variant="outline" size="sm" asChild>
                                <span>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload
                                </span>
                              </Button>
                            </label>
                            {candidate.photoPreview && (
                              <div className="w-8 h-8 rounded-full overflow-hidden border">
                                <img
                                  src={candidate.photoPreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {position.candidates.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No candidates added yet</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {positions.length === 0 && (
              <Card className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h4 className="text-lg font-medium mb-2">No Positions Added</h4>
                <p className="text-muted-foreground mb-4">
                  Start by adding positions for your election
                </p>
                <Button onClick={addPosition}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Position
                </Button>
              </Card>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Election
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateElectionDialog;