import React, { useState } from 'react';
import { File, Image, FileText, Download, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface FileAttachmentProps {
  name: string;
  url?: string;
  file?: any;
  className?: string;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({ name, url, file, className }) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '')) return 'image';
    if (['doc', 'docx'].includes(extension || '')) return 'word';
    if (['xls', 'xlsx'].includes(extension || '')) return 'excel';
    if (['ppt', 'pptx'].includes(extension || '')) return 'powerpoint';
    if (['zip', 'rar', '7z'].includes(extension || '')) return 'archive';
    
    return 'file';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-600" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-600" />;
      case 'word':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'excel':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'powerpoint':
        return <FileText className="h-4 w-4 text-orange-600" />;
      case 'archive':
        return <File className="h-4 w-4 text-purple-600" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'image':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'word':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'excel':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'powerpoint':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'archive':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const fileType = getFileType(name);
  const fileUrl = url || (file?.url ? `${import.meta.env.VITE_API_BASE_URL || 'https://ipmsnew.24livehost.com/api/v1'}/storage/${file.url}` : '');

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileType === 'image' && fileUrl) {
      setIsImagePreviewOpen(true);
    }
  };

  const isImage = fileType === 'image' && fileUrl;

  return (
    <>
      <div className={cn("flex items-center gap-2 px-3 py-2 border rounded-md transition-colors", getFileColor(fileType), className)}>
        {getFileIcon(fileType)}
        <span className="text-sm font-medium text-gray-700 flex-1 truncate" title={name}>
          {name}
        </span>
        {fileUrl && (
          <div className="flex items-center gap-1">
            {isImage ? (
              <button
                onClick={handleImageClick}
                className="p-1 rounded hover:bg-white/50 transition-colors"
                title="View image"
              >
                <ExternalLink className="h-3 w-3 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="p-1 rounded hover:bg-white/50 transition-colors"
                title="Download file"
              >
                <Download className="h-3 w-3 text-gray-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      {isImage && (
        <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <div className="relative">
         
              <img 
                src={fileUrl} 
                alt={name}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-600">{name}</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Component for displaying multiple file attachments
interface FileAttachmentsListProps {
  files: any[];
  className?: string;
}

export const FileAttachmentsList: React.FC<FileAttachmentsListProps> = ({ files, className }) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <span className="font-medium text-gray-600 text-sm">Attachments:</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {files.map((file, index) => (
          <FileAttachment
            key={file.id || index}
            name={file.name || file.filename || 'Unknown file'}
            url={file.url}
            file={file}
          />
        ))}
      </div>
    </div>
  );
};

