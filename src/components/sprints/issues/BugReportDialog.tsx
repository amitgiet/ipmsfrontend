
import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';
import { allRoutes } from '@/services/routes';
import { useParams } from 'react-router-dom';

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

interface AttachedImage {
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
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    storyId: ''
  });
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      setAttachedImages(prev => [...prev, {
        file,
        preview,
        name: file.name
      }]);
    });

    // Clear the input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => {
      const imageToRemove = prev[index];
      URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (bugId: string) => {
    if (attachedImages.length === 0) return;

    try {
      for (const image of attachedImages) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${bugId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await apiCall(allRoutes.sprints.uploadImage(fileName, image.file), 'POST', {
          file: image.file,
          fileName: fileName
        });

        if (uploadError) {
          console.error('❌ Error uploading image:', uploadError);
          throw uploadError;
        }

        console.log('✅ Image uploaded successfully:', fileName);
      }
    } catch (error) {
      console.error('❌ Error in uploadImages:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.storyId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
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

      const { data: bugData, error } = await apiCall(allRoutes.sprints.createBug, 'post', body);

      if (error) {
        console.error('❌ Error creating bug:', error);
        throw error;
      }

      // Upload images if any
      if (attachedImages.length > 0) {
        await uploadImages(bugData.id);
      }

      // Update story status back to in_progress since a bug was found
      console.log('🔄 Updating story status back to in_progress for story:', formData.storyId);
      const { error: statusError } = await apiCall(allRoutes.stories.update(formData.storyId), 'PUT', {
        status: 'in_progress',
        updated_at: new Date().toISOString()
      });

      if (statusError) {
        console.error('❌ Error updating story status:', statusError);
        // Don't throw here, bug was created successfully
      } else {
        console.log('✅ Story status updated to in_progress');
      }

      toast({
        title: "Success",
        description: `Bug reported successfully${attachedImages.length > 0 ? ` with ${attachedImages.length} image(s)` : ''}. Story moved back to In Progress.`,
      });

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        storyId: ''
      });

      // Clear attached images
      attachedImages.forEach(image => URL.revokeObjectURL(image.preview));
      setAttachedImages([]);

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

    // Clean up image previews
    attachedImages.forEach(image => URL.revokeObjectURL(image.preview));
    setAttachedImages([]);

    onClose();
  };

  console.log(" stories ", stories, " formData ", formData);
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
                  <SelectItem key={story.id} value={story.id.toString()}>
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
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
              rows={4}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <Label htmlFor="images">Attach Images</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('images')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Add Images
                </Button>
                <span className="text-sm text-gray-500">
                  Max 5MB per image
                </span>
              </div>

              {/* Image Previews */}
              {attachedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {attachedImages.map((image, index) => (
                    <div key={index} className="relative border rounded-lg p-2 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate flex-1">{image.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="mt-2 w-full h-20 object-cover rounded border"
                      />
                    </div>
                  ))}
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
