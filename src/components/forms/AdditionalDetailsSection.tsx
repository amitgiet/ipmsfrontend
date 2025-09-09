import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileImage, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MilestoneSection } from './MilestoneSection';

export const AdditionalDetailsSection = ({ formData, onInputChange }) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = [];

    Array.from(files).forEach(file => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return;
      }

      newFiles.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type
      });
    });

    if (newFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);

      const fileNames = updatedFiles.map(f => f.name).join(', ');
      onInputChange('documents', fileNames);
      onInputChange('documentFiles', updatedFiles.map(f => f.file));
    }

    event.target.value = '';
  };

  const removeFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    const fileNames = updatedFiles.map(f => f.name).join(', ');
    onInputChange('documents', fileNames);
    onInputChange('documentFiles', updatedFiles.map(f => f.file));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <>
      {/* Documents Upload */}
      <div className="space-y-2">
        <Label htmlFor="documents">Documents & Images</Label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              id="documents"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleFileUpload}
              // className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
         
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Uploaded Files:</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Supported formats: PDF, Word documents, images (JPG, PNG, GIF, WebP), and text files. Max size: 10MB per file.
          </p>
        </div>
      </div>

      {/* Milestones */}
      <MilestoneSection 
        formData={formData} 
        onInputChange={onInputChange} 
      />

      {/* Client Dependencies */}
      <div className="space-y-2">
        <Label htmlFor="clientDependencies">Client Dependencies</Label>
        <Textarea
          id="clientDependencies"
          value={formData.clientDependencies}
          onChange={(e) => onInputChange('clientDependencies', e.target.value)}
          placeholder="Enter client dependencies"
          rows={2}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tagsLabels">Tags / Labels</Label>
        <Input
          id="tagsLabels"
          value={formData.tagsLabels}
          onChange={(e) => onInputChange('tagsLabels', e.target.value)}
          placeholder="Enter tags (comma separated)"
        />
      </div>
    </>
  );
};
