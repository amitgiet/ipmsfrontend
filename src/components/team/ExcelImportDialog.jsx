import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { processExcelFile } from './excel/ExcelFileProcessor';
import { validateExcelData } from './excel/ExcelValidation';
import { ExcelImportPreview } from './excel/ExcelImportPreview';
import { ExcelValidationErrors } from './excel/ExcelValidationErrors';
import { toast } from 'react-toastify';

export const ExcelImportDialog = ({ open, onOpenChange, onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('upload'); // upload, preview, errors, success

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedData(null);
      setValidationErrors([]);
      setStep('upload');
    }
  };

  const handleProcessFile = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsProcessing(true);
    try {
      const data = await processExcelFile(file);
      setProcessedData(data);
      
      // Validate the data
      const errors = validateExcelData(data);
      setValidationErrors(errors);
      
      if (errors.length === 0) {
        setStep('preview');
        toast.success("File processed successfully! Review the data below.");
      } else {
        setStep('errors');
        toast.warning(`Found ${errors.length} validation errors. Please fix them before importing.`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error("Failed to process the Excel file. Please check the file format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!processedData || validationErrors.length > 0) {
      toast.error("Cannot import data with validation errors");
      return;
    }

    try {
      // Here you would typically send the data to your API
      // For now, we'll simulate a successful import
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('success');
      toast.success("Team members imported successfully!");
      
      // Call the callback to refresh the team list
      if (onImportComplete) {
        onImportComplete(processedData);
      }
      
      // Reset the form after a delay
      setTimeout(() => {
        handleReset();
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error("Failed to import team members. Please try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setProcessedData(null);
    setValidationErrors([]);
    setStep('upload');
  };

  const handleBackToUpload = () => {
    setStep('upload');
  };

  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-2">
                  Excel files only (.xlsx, .xls)
                </p>
              </div>
            </div>
            
            {file && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleProcessFile}
                disabled={!file || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Process File
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <ExcelImportPreview data={processedData} />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleBackToUpload}>
                Back
              </Button>
              <Button onClick={handleImport}>
                Import Team Members
              </Button>
            </div>
          </div>
        );

      case 'errors':
        return (
          <div className="space-y-4">
            <ExcelValidationErrors errors={validationErrors} />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleBackToUpload}>
                Back
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Import Successful!
            </h3>
            <p className="text-sm text-gray-500">
              {processedData?.length || 0} team members have been imported.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Team Members from Excel</DialogTitle>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};
