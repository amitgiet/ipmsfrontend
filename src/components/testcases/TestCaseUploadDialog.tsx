
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertTriangle } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';

interface TestCaseUploadDialogProps {
  open: boolean;
  onClose: () => void;
  storyId: string;
  onUploadComplete: () => void;
}

interface ParsedTestCase {
  tc_id: string;
  title: string;
  description?: string;
  preconditions?: string;
  steps: string;
  expected_results: string;
}

export const TestCaseUploadDialog: React.FC<TestCaseUploadDialogProps> = ({
  open,
  onClose,
  storyId,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setErrors([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (csvContent: string): ParsedTestCase[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const validationErrors: string[] = [];
    
    if (lines.length < 2) {
      validationErrors.push('CSV must contain at least a header row and one data row');
      setErrors(validationErrors);
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['tc_id', 'title', 'steps', 'expected_results'];
    const optionalHeaders = ['description', 'preconditions'];
    
    // Check for required headers
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      validationErrors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return [];
    }

    const testCases: ParsedTestCase[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      
      if (values.length < headers.length) {
        validationErrors.push(`Row ${i + 1}: Insufficient columns`);
        continue;
      }

      const testCase: ParsedTestCase = {
        tc_id: '',
        title: '',
        steps: '',
        expected_results: ''
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header) {
          case 'tc_id':
            testCase.tc_id = value;
            break;
          case 'title':
            testCase.title = value;
            break;
          case 'description':
            if (value) testCase.description = value;
            break;
          case 'preconditions':
            if (value) testCase.preconditions = value;
            break;
          case 'steps':
            testCase.steps = value;
            break;
          case 'expected_results':
            testCase.expected_results = value;
            break;
        }
      });

      // Validate required fields
      if (!testCase.tc_id) {
        validationErrors.push(`Row ${i + 1}: TC_ID is required`);
      }
      if (!testCase.title) {
        validationErrors.push(`Row ${i + 1}: Title is required`);
      }
      if (!testCase.steps) {
        validationErrors.push(`Row ${i + 1}: Steps are required`);
      }
      if (!testCase.expected_results) {
        validationErrors.push(`Row ${i + 1}: Expected Results are required`);
      }

      if (testCase.tc_id && testCase.title && testCase.steps && testCase.expected_results) {
        testCases.push(testCase);
      }
    }

    setErrors(validationErrors);
    return testCases;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const csvContent = await file.text();
      const testCases = parseCSV(csvContent);

      if (errors.length > 0 || testCases.length === 0) {
        return;
      }

      console.log('🔄 Uploading test cases:', testCases.length);

      // Insert test cases
      const testCaseData = testCases.map(tc => ({
        story_id: storyId,
        tc_id: tc.tc_id,
        title: tc.title,
        description: tc.description,
        preconditions: tc.preconditions,
        steps: tc.steps,
        expected_results: tc.expected_results,
        status: 'pending'
      }));

        const { error } = await apiCall(allRoutes.testCases.upload(storyId), 'post', testCaseData);

      if (error) {
        console.error('❌ Error uploading test cases:', error);
        toast({
          title: "Upload Error",
          description: error.message.includes('unique') 
            ? "Some test case IDs already exist for this story"
            : "Failed to upload test cases",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${testCases.length} test cases`,
      });

      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('❌ Error in handleUpload:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setErrors([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Test Cases</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing test cases for this user story
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              CSV should have columns: TC_ID, Title, Steps, Expected_Results, Description (optional), Preconditions (optional)
            </AlertDescription>
          </Alert>

          <div className="grid gap-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>Please fix the following errors:</div>
                <ul className="list-disc list-inside mt-2">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!file || uploading || errors.length > 0}
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
