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
        id: 1,
        name: '',
        deliverable: '',
        amount: '',
        currency: 'USD',
        client_dependency: '',
        estimated_completion_date: ''
      }
    ];
  };

  const milestones = getMilestones();

  const addMilestone = () => {
    const newId = Math.max(...milestones.map(m => m.id), 0) + 1;
    const newMilestones = [
      ...milestones,
      {
        id: newId,
        name: '',
        deliverable: '',
        amount: '',
        currency: 'USD',
        client_dependency: '',
        estimated_completion_date: ''
      }
    ];
    onInputChange('milestones', newMilestones);
  };

  const removeMilestone = (id) => {
    if (milestones.length > 1) {
      const newMilestones = milestones.filter(m => m.id !== id);
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

  const updateMilestone = (id, field, value) => {
    const newMilestones = milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    onInputChange('milestones', newMilestones);
  };

  return (
    <div className="space-y-4">
      {/* Summary Section */}
      <div className="bg-blue-50 p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
          <Card key={milestone.id} className="border-2 border-gray-100">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Milestone Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Milestone {index + 1}</h4>
                  {milestones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(milestone.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                                 {/* Milestone Details */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${milestone.id}-name`}>Milestone Name</Label>
                     <Input
                       id={`milestone-${milestone.id}-name`}
                       value={milestone.name}
                       onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                       placeholder="Enter milestone name"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${milestone.id}-deliverable`}>Deliverable</Label>
                     <Input
                       id={`milestone-${milestone.id}-deliverable`}
                       value={milestone.deliverable}
                       onChange={(e) => updateMilestone(milestone.id, 'deliverable', e.target.value)}
                       placeholder="Enter deliverable description"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${milestone.id}-amount`}>Amount</Label>
                     <div className="flex gap-2">
                       <Select
                         value={milestone.currency || 'USD'}
                         onValueChange={(value) => updateMilestone(milestone.id, 'currency', value)}
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
                         id={`milestone-${milestone.id}-amount`}
                         value={milestone.amount}
                         onChange={(e) => updateMilestone(milestone.id, 'amount', e.target.value)}
                         placeholder="Type here"
                         type="number"
                         className="flex-1"
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${milestone.id}-client-dependency`}>Client Dependency</Label>
                     <Input
                       id={`milestone-${milestone.id}-client-dependency`}
                       value={milestone.client_dependency}
                       onChange={(e) => updateMilestone(milestone.id, 'client_dependency', e.target.value)}
                       placeholder="Enter client dependencies"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor={`milestone-${milestone.id}-completion-date`}>Estimated Completion Date</Label>
                     <div className="relative">
                       <Input
                         id={`milestone-${milestone.id}-completion-date`}
                         value={milestone.estimated_completion_date}
                         onChange={(e) => updateMilestone(milestone.id, 'estimated_completion_date', e.target.value)}
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
       <div className="space-y-2">
         <Label className="text-lg font-semibold">Notes</Label>
         <Input
           value={formData.milestoneNotes || ''}
           onChange={(e) => onInputChange('milestoneNotes', e.target.value)}
           placeholder="Add any additional notes about milestones..."
         />
       </div>
    </div>
  );
};
