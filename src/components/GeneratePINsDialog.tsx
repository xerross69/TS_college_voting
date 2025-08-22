import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Hash, FileText } from 'lucide-react';

const GeneratePINsDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState('');
  const [prefix, setPrefix] = useState('VOTE2024');
  const [length, setLength] = useState('8');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!count || parseInt(count) <= 0) {
      toast({
        title: "Invalid Count",
        description: "Please enter a valid number of PINs to generate.",
        variant: "destructive",
      });
      return;
    }

    const pinCount = parseInt(count);
    if (pinCount > 1000) {
      toast({
        title: "Too Many PINs",
        description: "Maximum 1000 PINs can be generated at once.",
        variant: "destructive",
      });
      return;
    }

    // Generate PINs logic would go here
    toast({
      title: "PINs Generated Successfully",
      description: `Generated ${pinCount} voter PINs with prefix "${prefix}".`,
    });

    setOpen(false);
    setCount('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-primary" />
            <span>Generate Voter PINs</span>
          </DialogTitle>
          <DialogDescription>
            Create unique voter PINs for the election. These will be distributed to eligible voters.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of PINs</Label>
              <Input
                id="count"
                type="number"
                placeholder="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">PIN Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 digits</SelectItem>
                  <SelectItem value="8">8 digits</SelectItem>
                  <SelectItem value="10">10 digits</SelectItem>
                  <SelectItem value="12">12 digits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prefix">PIN Prefix</Label>
            <Input
              id="prefix"
              placeholder="VOTE2024"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={10}
            />
            <p className="text-sm text-muted-foreground">
              Example: {prefix}001, {prefix}002, etc.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Batch description for internal reference..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Preview:</p>
                <p className="text-muted-foreground">
                  {count ? `${count} PINs will be generated` : 'Enter count to see preview'}
                  {prefix && count ? ` from ${prefix}001 to ${prefix}${count.padStart(3, '0')}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            <Plus className="h-4 w-4 mr-2" />
            Generate PINs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePINsDialog;