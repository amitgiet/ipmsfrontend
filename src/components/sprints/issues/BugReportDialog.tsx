
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiCall } from '@/services/apiCall';
import { toast } from 'react-toastify';
import { Upload, X, Image } from 'lucide-react';
import { allRoutes } from '@/services/routes';
import { useParams } from 'react-router-dom';
import QuillEditor from '@/components/common/QuillEditor';

interface Story {
  id: string;
  title: string;
}

interface BugReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  stories: Story[];
  onBugReported: () => void;
}

interface AttachedFile {
  file: File;
  preview: string;
  name: string;
}

export const BugReportDialog: React.FC<BugReportDialogProps> = ({
  isOpen,
  onClose,
  sprintId,
  stories,
  onBugReported
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [bugLabel, setBugLabel] = useState([]);
  const [bugLabelSelected, setBugLabelSelected] = useState('');
  const [customLabelName, setCustomLabelName] = useState('');
  const [isOthersSelected, setIsOthersSelected] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    storyId: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, and PDF files are allowed");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);

    // Remove previous file if exists
    if (attachedFile) {
      URL.revokeObjectURL(attachedFile.preview);
    }

    setAttachedFile({
      file,
      preview,
      name: file.name
    });

    // Clear the input
    event.target.value = '';
  };

  const removeFile = () => {
    if (attachedFile) {
      URL.revokeObjectURL(attachedFile.preview);
      setAttachedFile(null);
    }
  };

  const uploadFile = async (bugId: string) => {
    if (!attachedFile) return;

    try {
      const fileExt = attachedFile.file.name.split('.').pop();
      const fileName = `${bugId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await apiCall(allRoutes.sprints.uploadImage(fileName, attachedFile.file), 'POST', {
        file: attachedFile.file,
        fileName: fileName
      });

      if (uploadError) {
        console.error('❌ Error uploading file:', uploadError);
        throw uploadError;
      }
    } catch (error) {
      console.error('❌ Error in uploadFile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.storyId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      let body = new FormData();
      body.append('project_id', projectId);
      body.append('sprint_id', sprintId);
      body.append('user_story_id', formData.storyId);
      body.append('title', formData.title.trim());
      body.append('description', formData.description.trim() || '');
      body.append('severity', formData.severity);
      if (attachedFile) {
        body.append('file', attachedFile.file);
      }
      // Add bug label if selected
      if (bugLabelSelected && !isOthersSelected) {
        body.append('label', bugLabelSelected);
      } else if (isOthersSelected && customLabelName.trim()) {
        body.append('label', customLabelName.trim());
      }

      const { data: bugData, error } = await apiCall(allRoutes.sprints.createBug, 'post', body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (error) {
        console.error('❌ Error creating bug:', error);
        return;
      }

      toast.success(`Bug reported successfully !`);

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        storyId: ''
      });

      // Clear attached file
      if (attachedFile) {
        URL.revokeObjectURL(attachedFile.preview);
        setAttachedFile(null);
      }

      onClose();
      onBugReported();
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      storyId: ''
    });

    // Clean up file preview and reset bug label selection
    if (attachedFile) {
      URL.revokeObjectURL(attachedFile.preview);
      setAttachedFile(null);
    }
    setBugLabelSelected('');
    setCustomLabelName('');

    onClose();
  };

  const getBugLabel = async () => {
    const { data: bugLabelData, error } = await apiCall(allRoutes.sprints.bugLabel(projectId, 9), 'get');
    if (error) {
      console.error('❌ Error getting bug label:', error);
      return;
    }
    setBugLabel(bugLabelData.data);
  };

  useEffect(() => {
    getBugLabel();
  }, [projectId]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Bug</DialogTitle>
          <DialogDescription>
            Report a bug found during QA testing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="story">Story *</Label>
            <Select
              value={formData.storyId.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, storyId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a story" />
              </SelectTrigger>
              <SelectContent>
                {stories.map(story => (
                  <SelectItem className="w-[620px]" key={story.id} value={story.id.toString()}>
                    {story.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Bug Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of the bug"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="bug-label">Bug Label *</Label>

            {/* Radio buttons for predefined labels */}

            <div className="space-y-2 flex flex-row gap-2 items-center self-end">
              {bugLabel.map((label) => (
                <div key={label.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`label-${label.name}`}
                    name="bugLabel"
                    value={label.name}
                    checked={bugLabelSelected === label.name}
                    onChange={(e) => { setIsOthersSelected(false); setCustomLabelName(''); setBugLabelSelected(e.target.value) }}
                    className="w-4 h-4 text-blue-600 accent-blue-600"
                  />
                  <label htmlFor={`label-${label.name}`} className="text-sm text-gray-700 cursor-pointer">
                    {label.name}
                  </label>
                </div>
              ))}

              {/* "Others" radio option */}
              <div className="flex items-center space-x-2 mt-[-0px!important]">
                <input
                  type="radio"
                  id="label-others"
                  name="bugLabel"
                  value="custom"
                  checked={isOthersSelected}
                  onChange={(e) => { setCustomLabelName(''); setIsOthersSelected(e.target.checked); setBugLabelSelected('') }}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
                <label htmlFor="label-others" className="text-sm text-gray-700 cursor-pointer">
                  Others
                </label>
              </div>
            </div>

            {/* Custom label input - show when "Others" is selected */}
            {isOthersSelected && (
              <div className="space-y-2">
                <Label htmlFor="custom-label">Custom Label: </Label>
                <Input
                  type="text"
                  placeholder="Enter custom bug label"
                  value={customLabelName}
                  onChange={(e) => setCustomLabelName(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* Show selected label info */}
            {bugLabelSelected && !isOthersSelected && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                Selected: {bugLabelSelected}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') =>
                setFormData(prev => ({ ...prev, severity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            {/* <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
              rows={4}
            /> */}

            <QuillEditor
              text={formData.description}
              setText={(value) => setFormData(prev => ({ ...prev, description: value }))}
              limit={1000}
              placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
            />
          </div>

          {/* File Upload Section */}
          <div>
            <Label htmlFor="file">Attach File</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {attachedFile ? 'Replace File' : 'Add File'}
                </Button>
                <span className="text-sm text-gray-500">
                  JPG, JPEG, PNG, PDF only - Max 5MB
                </span>
              </div>

              {/* File Preview */}
              {attachedFile && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-gray-500" />
                    <span className="text-sm truncate flex-1">{attachedFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {attachedFile.file.type.startsWith('image/') && (
                    <img
                      src={attachedFile.preview}
                      alt={attachedFile.name}
                      className="mt-2 w-full h-20 object-cover rounded border"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? 'Reporting...' : 'Report Bug'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
