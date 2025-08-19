
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
import { Badge } from '@/components/ui/badge';
import { apiCall } from '@/services/apiCall';
import { toast } from 'react-toastify';
import { CheckCircle2, Plus, Upload, X, Image } from 'lucide-react';
import { allRoutes } from '@/services/routes';

interface BugReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  onBugsSubmitted: () => void;
}

interface AttachedImage {
  file: File;
  preview: string;
  name: string;
}

export const BugReportDialog: React.FC<BugReportDialogProps> = ({
  isOpen,
  onClose,
  storyId,
  onBugsSubmitted
}) => {
  const [loading, setLoading] = useState(false);
  const [bugsReported, setBugsReported] = useState(0);
  const [reportedBugs, setReportedBugs] = useState<Array<{title: string, severity: string}>>([]);
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
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
          throw uploadError;
        }

      }
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a bug title");
      return;
    }

    try {
      setLoading(true);

      // First, get the sprint_id for this story
      const { data: storyData, error: storyError } = await apiCall(allRoutes.sprints.getSprintBacklog(storyId), 'GET');

      if (storyError || !storyData) {
        throw new Error('Could not find sprint for this story');
      }

      // Create the bug report
        const { data: bugData, error } = await apiCall(allRoutes.sprints.createBug, 'POST', {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          severity: formData.severity,
          story_id: storyId,
          sprint_id: storyData.sprint_id,
          reported_by: 'QA User',
          status: 'open'
        });

      if (error) {
        toast.error("Failed to create bug");
      }

      // Upload images if any
      if (attachedImages.length > 0) {
        await uploadImages(bugData.id);
      }

      // Update story status back to in_progress since bugs were found (only on first bug)
      if (bugsReported === 0) {
        const { error: statusError } = await apiCall(allRoutes.stories.update(storyId), 'PUT', { 
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('id', storyId);

        if (statusError) {
          toast.error("Failed to update story status");
          // Don't throw here, bug was created successfully
        }
      }

      // Add to reported bugs list
      setReportedBugs(prev => [...prev, { title: formData.title, severity: formData.severity }]);

      toast.success(`Bug "${formData.title}" reported successfully${attachedImages.length > 0 ? ` with ${attachedImages.length} image(s)` : ''}`);

      // Increment bugs reported counter
      setBugsReported(prev => prev + 1);

      // Reset form but keep dialog open
      setFormData({
        title: '',
        description: '',
        severity: 'medium'
      });

      // Clear attached images
      attachedImages.forEach(image => URL.revokeObjectURL(image.preview));
      setAttachedImages([]);

      onBugsSubmitted();
    } catch (error) {
      toast.error("Failed to report bug");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      severity: 'medium'
    });
    setBugsReported(0);
    setReportedBugs([]);
    
    // Clean up image previews
    attachedImages.forEach(image => URL.revokeObjectURL(image.preview));
    setAttachedImages([]);
    
    onClose();
  };

  const handleFinishReporting = () => {
    toast.success(`Finished reporting ${bugsReported} bug${bugsReported !== 1 ? 's' : ''}. Story moved back to In Progress.`);
    handleClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Report Bugs
            {bugsReported > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {bugsReported} reported
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Report bugs found during QA testing. You can report multiple bugs before finishing.
          </DialogDescription>
        </DialogHeader>

        {/* Show reported bugs list */}
        {reportedBugs.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700">Reported Bugs:</h4>
            {reportedBugs.map((bug, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">{bug.title}</span>
                <Badge variant="outline" className={getSeverityColor(bug.severity)}>
                  {bug.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              {loading ? 'Reporting...' : `Add Bug ${bugsReported > 0 ? `(${bugsReported + 1})` : ''}`}
            </Button>
            
            {bugsReported > 0 && (
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="default" 
                  onClick={handleFinishReporting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Finish Reporting ({bugsReported} bugs)
                </Button>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            )}
            
            {bugsReported === 0 && (
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
