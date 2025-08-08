
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processExcelFile } from './excel/ExcelFileProcessor';
import { ExcelTeamMember } from './excel/ExcelValidation';
import { ExcelTemplateDownloader } from './excel/ExcelTemplateDownloader';
import { ExcelValidationErrors } from './excel/ExcelValidationErrors';
import { ExcelImportPreview } from './excel/ExcelImportPreview';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (teamMembers: any[]) => Promise<boolean>;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  open,
  onOpenChange,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<ExcelTeamMember[]>([]);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationErrors([]);
      setPreviewData([]);
      
      try {
        const result = await processExcelFile(selectedFile);
        setValidationErrors(result.errors);
        setPreviewData(result.processedData);

        if (result.errors.length === 0) {
          toast({
            title: "File validated successfully",
            description: `${result.processedData.length} team members ready to import`,
          });
        } else {
          toast({
            title: "Validation Issues Found",
            description: `${result.errors.length} validation errors found. Please review and fix the issues.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process Excel file. Please check the file format.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast({
        title: "Error",
        description: "No valid data to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const success = await onImport(previewData);
      if (success) {
        toast({
          title: "Success",
          description: `Successfully imported ${previewData.length} team members`,
        });
        onOpenChange(false);
        setFile(null);
        setPreviewData([]);
        setValidationErrors([]);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import team members",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Team Members from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple team members at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <ExcelTemplateDownloader />
          </div>

          <div>
            <Label htmlFor="excel-file">Upload Excel File</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          <ExcelValidationErrors errors={validationErrors} />
          <ExcelImportPreview data={previewData} hasErrors={validationErrors.length > 0} />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={previewData.length === 0 || validationErrors.length > 0 || importing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : `Import ${previewData.length} Members`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
