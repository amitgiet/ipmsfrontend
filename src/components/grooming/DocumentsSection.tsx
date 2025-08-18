
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Image, Download } from 'lucide-react';

interface StoryDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
}

interface DocumentsSectionProps {
  documents: StoryDocument[];
  uploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadDocument: (document: StoryDocument) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  uploading,
  onFileUpload,
  onDownloadDocument
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Flow Documents</CardTitle>
        <CardDescription>Upload flow documents, wireframes, or reference materials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            onChange={onFileUpload}
            disabled={uploading}
            className="mb-2"
          />
          <p className="text-sm text-gray-500">
            Supported formats: PDF, Word documents, and images
          </p>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {doc.file_type.startsWith('image/') ? (
                    <Image className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">{doc.filename}</p>
                    <p className="text-sm text-gray-500">
                      {(doc.file_size / 1024).toFixed(1)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadDocument(doc)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
