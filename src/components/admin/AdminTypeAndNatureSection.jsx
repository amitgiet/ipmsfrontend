import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, X, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const AdminTypeAndNatureSection = () => {
  const [activeTab, setActiveTab] = useState('type');
  const [types, setTypes] = useState([]);
  const [natures, setNatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [typeForm, setTypeForm] = useState({ name: '', active: "1" });
  const [natureForm, setNatureForm] = useState({ name: '', active: "1" });
  const [updateConfirmationDialog, setUpdateConfirmationDialog] = useState({
    open: false,
    formType: null,
    oldName: '',
    newName: '',
    oldStatus: '',
    newStatus: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch types and natures
      const [typesResponse, naturesResponse] = await Promise.all([
        apiCall(allRoutes.master.types_create_or_get(null), 'get'),
        apiCall(allRoutes.master.natures_create_or_get(null), 'get')
      ]);

      if (typesResponse.data) {
        setTypes(typesResponse.data.data);
      }
      
      if (naturesResponse.data) {
        setNatures(naturesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    
    const formData = formType === 'type' ? typeForm : natureForm;
    const isEditing = editingId !== null;
    
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    // If editing, show confirmation dialog
    if (isEditing) {
      const currentItem = formType === 'type' 
        ? types.find(item => item.id === editingId)
        : natures.find(item => item.id === editingId);
      
      if (currentItem) {
        setUpdateConfirmationDialog({
          open: true,
          formType: formType,
          oldName: currentItem.name,
          newName: formData.name,
          oldStatus: currentItem.active === 1 ? 'Active' : 'Inactive',
          newStatus: formData.active === "1" ? 'Active' : 'Inactive'
        });
      }
      return;
    }

    // For new items, proceed directly
    await performSubmit(formType, formData, false);
  };

  const performSubmit = async (formType, formData, isEditing) => {
    try {
      setLoading(true);
      
      if (isEditing) {
        // Update existing
        const endpoint = formType === 'type' 
          ? allRoutes.master.types_update_or_delete(editingId)
          : allRoutes.master.natures_update_or_delete(editingId);
          
        const { error } = await apiCall(endpoint, 'patch', formData);
        
        if (error) throw error;
        
        toast.success(`${formType === 'type' ? 'Type' : 'Nature'} updated successfully`);
      } else {
        // Create new
        const endpoint = formType === 'type' 
          ? allRoutes.master.types_create_or_get
          : allRoutes.master.natures_create_or_get;
          
        const { error } = await apiCall(endpoint, 'post', formData);
        
        if (error) throw error;
        
        toast.success(`${formType === 'type' ? 'Type' : 'Nature'} created successfully`);
      }
      
      // Reset form and refresh data
      resetForm(formType);
      fetchData();
      
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} ${formType}:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} ${formType}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmUpdate = async () => {
    const formData = updateConfirmationDialog.formType === 'type' ? typeForm : natureForm;
    await performSubmit(updateConfirmationDialog.formType, formData, true);
    setUpdateConfirmationDialog({ open: false, formType: null, oldName: '', newName: '', oldStatus: '', newStatus: '' });
  };

  const handleEdit = (item, formType) => {
    setEditingId(item.id);
    if (formType === 'type') {
      setTypeForm({ name: item.name, active: item.active });
    } else {
      setNatureForm({ name: item.name, active: item.active });
    }
  };

  const handleDelete = async (id, formType) => {
    if (!window.confirm(`Are you sure you want to delete this ${formType}?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const endpoint = formType === 'type' 
        ? allRoutes.master.types_update_or_delete(id)
        : allRoutes.master.natures_update_or_delete(id);
        
      const { error } = await apiCall(endpoint, 'delete');
      
      if (error) throw error;
      
      toast.success(`${formType === 'type' ? 'Type' : 'Nature'} deleted successfully`);
      fetchData();
      
    } catch (error) {
      console.error(`Error deleting ${formType}:`, error);
      toast.error(`Failed to delete ${formType}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (formType) => {
    setEditingId(null);
    if (formType === 'type') {
      setTypeForm({ name: '', active: "1" });
    } else {
      setNatureForm({ name: '', active: "1" });
    }
  };

  const handleCancel = (formType) => {
    resetForm(formType);
  };

  const renderForm = (formType) => {
    const form = formType === 'type' ? typeForm : natureForm;
    const setForm = formType === 'type' ? setTypeForm : setNatureForm;
    const isEditing = editingId !== null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? `Edit ${formType === 'type' ? 'Type' : 'Nature'}` : `Create New ${formType === 'type' ? 'Type' : 'Nature'}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, formType)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`${formType}-name`}>Name *</Label>
                <Input
                  id={`${formType}-name`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={`Enter ${formType} name`}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`${formType}-status`}>Status</Label>
                <Select
                  value={form.active}
                  placeholder="Select status"
                  onValueChange={(value) => setForm({ ...form, active: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing...' : (isEditing ? 'Update' : 'Create')}
              </Button>
              
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleCancel(formType)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderTable = (data, formType) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {formType === 'type' ? 'types' : 'natures'} found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <Badge variant={item.active === 1 ? 'default bg-green-600' : 'secondary bg-red-600'}>
                  {item.active === 1 ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item, formType)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id, formType)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Type and Nature Master</h1>
        <p className="text-gray-600 mt-2">Manage project types and natures</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="type">Project Types</TabsTrigger>
          <TabsTrigger value="nature">Project Natures</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-6">
          {renderForm('type')}
          <Card>
            <CardHeader>
              <CardTitle>Project Types</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(types, 'type')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nature" className="space-y-6">
          {renderForm('nature')}
          <Card>
            <CardHeader>
              <CardTitle>Project Natures</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(natures, 'nature')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Confirmation Dialog */}
      <Dialog open={updateConfirmationDialog.open} onOpenChange={(open) => setUpdateConfirmationDialog({ open, formType: null, oldName: '', newName: '', oldStatus: '', newStatus: '' })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Update {updateConfirmationDialog.formType === 'type' ? 'Type' : 'Nature'}
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Changes Summary:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          <span className="text-red-600 line-through">{updateConfirmationDialog.oldName}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">{updateConfirmationDialog.newName}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">
                          <span className="text-red-600 line-through">{updateConfirmationDialog.oldStatus}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">{updateConfirmationDialog.newStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Impact:</strong> All existing projects using this {updateConfirmationDialog.formType} will be updated with the new information.
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setUpdateConfirmationDialog({ open: false, formType: null, oldName: '', newName: '', oldStatus: '', newStatus: '' })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUpdate}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Update {updateConfirmationDialog.formType === 'type' ? 'Type' : 'Nature'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};