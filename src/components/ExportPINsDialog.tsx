import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Download, FileText, FileSpreadsheet, Filter } from 'lucide-react';

const ExportPINsDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState('csv');
  const [status, setStatus] = useState('all');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockPINs = [
    { id: 'VOTE2024001', status: 'used', usedAt: '2024-03-15 10:30 AM', createdAt: '2024-03-01 09:00 AM' },
    { id: 'VOTE2024002', status: 'active', usedAt: null, createdAt: '2024-03-01 09:00 AM' },
    { id: 'VOTE2024003', status: 'active', usedAt: null, createdAt: '2024-03-01 09:00 AM' },
    { id: 'VOTE2024004', status: 'used', usedAt: '2024-03-15 11:15 AM', createdAt: '2024-03-01 09:00 AM' },
  ];

  const handleExport = () => {
    // Filter PINs based on status
    let filteredPINs = mockPINs;
    if (status !== 'all') {
      filteredPINs = mockPINs.filter(pin => pin.status === status);
    }

    if (format === 'csv') {
      exportToCSV(filteredPINs);
    } else {
      exportToDocument(filteredPINs);
    }

    toast({
      title: "Export Successful",
      description: `${filteredPINs.length} PINs exported as ${format.toUpperCase()}.`,
    });

    setOpen(false);
  };

  const exportToCSV = (pins: any[]) => {
    let csvContent = '';
    
    // Add headers if selected
    if (includeHeaders) {
      const headers = ['PIN', 'Status'];
      if (includeTimestamp) {
        headers.push('Created At', 'Used At');
      }
      csvContent += headers.join(',') + '\n';
    }

    // Add data rows
    pins.forEach(pin => {
      const row = [pin.id, pin.status];
      if (includeTimestamp) {
        row.push(pin.createdAt, pin.usedAt || 'Not used');
      }
      csvContent += row.join(',') + '\n';
    });

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voter-pins-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToDocument = (pins: any[]) => {
    let content = 'VOTER PINS EXPORT\n';
    content += '===================\n\n';
    content += `Export Date: ${new Date().toLocaleString()}\n`;
    content += `Total PINs: ${pins.length}\n`;
    content += `Status Filter: ${status === 'all' ? 'All PINs' : status.charAt(0).toUpperCase() + status.slice(1) + ' PINs'}\n\n`;
    
    pins.forEach((pin, index) => {
      content += `${index + 1}. PIN: ${pin.id}\n`;
      content += `   Status: ${pin.status.toUpperCase()}\n`;
      if (includeTimestamp) {
        content += `   Created: ${pin.createdAt}\n`;
        content += `   Used: ${pin.usedAt || 'Not used'}\n`;
      }
      content += '\n';
    });

    // Download as text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voter-pins-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Export Voter PINs</span>
          </DialogTitle>
          <DialogDescription>
            Choose your export format and options for the voter PINs data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center space-x-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>CSV File (.csv)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="document" id="document" />
                <Label htmlFor="document" className="flex items-center space-x-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <span>Text Document (.txt)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Filter by Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All PINs</SelectItem>
                <SelectItem value="active">Active PINs Only</SelectItem>
                <SelectItem value="used">Used PINs Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Export Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="headers" 
                  checked={includeHeaders}
                  onCheckedChange={(checked) => setIncludeHeaders(checked === true)}
                />
                <Label htmlFor="headers" className="text-sm">
                  Include column headers
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="timestamp" 
                  checked={includeTimestamp}
                  onCheckedChange={(checked) => setIncludeTimestamp(checked === true)}
                />
                <Label htmlFor="timestamp" className="text-sm">
                  Include timestamps
                </Label>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Export Preview:</p>
                <p className="text-muted-foreground">
                  {status === 'all' ? '4 total PINs' : 
                   status === 'active' ? '2 active PINs' : 
                   '2 used PINs'} will be exported as {format.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPINsDialog;