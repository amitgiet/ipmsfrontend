import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, Calendar } from 'lucide-react';
import { CURRENCIES } from '@/constants/projectConstants';

export const MilestoneSection = ({ formData, onInputChange }) => {
  // Get milestones from formData or create default
  const getMilestones = () => {
    if (formData.milestones && formData.milestones.length > 0) {
      return formData.milestones;
    }
    
    return [
      {
        name: '',
        deliverable: '',
        amount: '',
        currency: 'USD',
        client_dependency: '',
        estimated_completion_date: '',
        status: 'pending'
      }
    ];
  };

  // Get milestones_remove_ids from formData or create default
  const getMilestonesRemoveIds = () => {
    return formData.milestones_remove_ids || [];
  };

  const milestones = getMilestones();
  const milestonesRemoveIds = getMilestonesRemoveIds();

  const addMilestone = () => {
    const newMilestones = [
      ...milestones,
      {
        name: '',
        deliverable: '',
        amount: '',
        currency: 'USD',
        client_dependency: '',
        estimated_completion_date: '',
        status: 'pending'
      }
    ];
    onInputChange('milestones', newMilestones);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      const milestoneToRemove = milestones[index];
      
      // If milestone has a database ID (existing milestone), add to remove_ids
      // Check for both 'id' and 'db_id' fields
      const dbId = milestoneToRemove?.id || milestoneToRemove?.db_id;
      
      if (milestoneToRemove && dbId) {
        const newRemoveIds = [...milestonesRemoveIds, dbId];
        onInputChange('milestones_remove_ids', newRemoveIds);
      }
      
      // Remove from milestones array
      const newMilestones = milestones.filter((_, i) => i !== index);
      onInputChange('milestones', newMilestones);
    }
  };

  const calculateTotalAmount = () => {
    return milestones.reduce((total, milestone) => {
      const amount = parseFloat(milestone.amount) || 0;
      return total + amount;
    }, 0);
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = CURRENCIES.find(c => c.value === currencyCode);
    return currency ? currency.symbol : '$';
  };

  const getPrimaryCurrency = () => {
    // Get the most common currency or default to USD
    const currencies = milestones.map(m => m.currency || 'USD');
    const currencyCounts = currencies.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommon = Object.keys(currencyCounts).reduce((a, b) => 
      currencyCounts[a] > currencyCounts[b] ? a : b
    );
    
    return mostCommon || 'USD';
  };

  const hasMultipleCurrencies = () => {
    const currencies = milestones.map(m => m.currency || 'USD');
    return new Set(currencies).size > 1;
  };

  const updateMilestone = (index, field, value) => {
    const newMilestones = milestones.map((m, i) => 
      i === index ? { ...m, [field]: value } : m
    );
    onInputChange('milestones', newMilestones);
  };

  return (
    <div className="space-y-4">
      {/* Summary Section */}
      <div className="bg-blue-50 p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Total Milestones:</span>
            <span className="ml-2 text-blue-600 font-semibold">{milestones.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Amount:</span>
            <span className="ml-2 text-green-600 font-semibold">{getCurrencySymbol(getPrimaryCurrency())}{calculateTotalAmount().toLocaleString()}</span>
            {hasMultipleCurrencies() && (
              <span className="ml-2 text-xs text-orange-600">(Multiple currencies)</span>
            )}
          </div>
          <div>
            <span className="font-medium text-gray-700">Completed:</span>
            <span className="ml-2 text-green-600 font-semibold">{milestones.filter(m => m.status === 'completed').length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">In Progress:</span>
            <span className="ml-2 text-yellow-600 font-semibold">{milestones.filter(m => m.status === 'in_progress').length}</span>
          </div>
        </div>
      </div>

             <div className="flex items-center justify-between">
         <Label className="text-lg font-semibold">Payment Milestone</Label>
         <Button
           type="button"
           variant="outline"
           size="sm"
           onClick={addMilestone}
           className="flex items-center gap-2"
         >
           <Plus className="h-4 w-4" />
           Add Milestone
         </Button>
       </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card key={index} className="border-2 border-gray-100">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Milestone Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-700">Milestone {index + 1}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      milestone.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : milestone.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {milestone.status === 'completed' ? 'Completed' : 
                       milestone.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  {milestones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                                 {/* Milestone Details */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${index}-name`}>Milestone Name</Label>
                     <Input
                       id={`milestone-${index}-name`}
                       value={milestone.name}
                       onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                       placeholder="Enter milestone name"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${index}-deliverable`}>Deliverable</Label>
                     <Input
                       id={`milestone-${index}-deliverable`}
                       value={milestone.deliverable}
                       onChange={(e) => updateMilestone(index, 'deliverable', e.target.value)}
                       placeholder="Enter deliverable description"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${index}-status`}>Status</Label>
                     <Select
                       value={milestone.status || 'pending'}
                       onValueChange={(value) => updateMilestone(index, 'status', value)}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select status" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="pending">Pending</SelectItem>
                         <SelectItem value="in_progress">In Progress</SelectItem>
                         <SelectItem value="completed">Completed</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${index}-amount`}>Amount</Label>
                     <div className="flex gap-2">
                       <Select
                         value={milestone.currency || 'USD'}
                         onValueChange={(value) => updateMilestone(index, 'currency', value)}
                       >
                         <SelectTrigger className="w-20">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           {CURRENCIES.map((currency) => (
                             <SelectItem key={currency.value} value={currency.value}>
                               {currency.symbol}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       <Input
                         id={`milestone-${index}-amount`}
                         value={milestone.amount}
                         onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                         placeholder="Type here"
                         type="number"
                         className="flex-1"
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${index}-client-dependency`}>Client Dependency</Label>
                     <Input
                       id={`milestone-${index}-client-dependency`}
                       value={milestone.client_dependency}
                       onChange={(e) => updateMilestone(index, 'client_dependency', e.target.value)}
                       placeholder="Enter client dependencies"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${index}-completion-date`}>Estimated Completion Date</Label>
                     <div className="relative">
                       <Input
                         id={`milestone-${index}-completion-date`}
                         value={milestone.estimated_completion_date}
                         onChange={(e) => updateMilestone(index, 'estimated_completion_date', e.target.value)}
                         placeholder="dd-mm-yyyy"
                         type="date"
                       />
                       <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     </div>
                   </div>
                 </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

             {/* Notes Section */}
   
    </div>
  );
};
