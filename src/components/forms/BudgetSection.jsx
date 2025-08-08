import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BudgetSection = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Budget & Hours</h3>
      
      <div className="space-y-2">
        <Label>Estimated Budget</Label>
        <div className="flex">
          <Select value={formData.budgetCurrency || 'USD'} onValueChange={(value) => onInputChange('budgetCurrency', value)}>
            <SelectTrigger className="w-20 rounded-r-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">$</SelectItem>
              <SelectItem value="EUR">€</SelectItem>
              <SelectItem value="GBP">£</SelectItem>
              <SelectItem value="CAD">C$</SelectItem>
              <SelectItem value="AUD">A$</SelectItem>
              <SelectItem value="JPY">¥</SelectItem>
              <SelectItem value="INR">₹</SelectItem>
              <SelectItem value="CNY">¥</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="0.01"
            value={formData.estimatedBudget || ''}
            onChange={(e) => onInputChange('estimatedBudget', e.target.value)}
            placeholder="0.00"
            className="rounded-l-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Budgeted Hours</Label>
          <div className="flex">
            <Input
              type="number"
              step="0.5"
              value={formData.budgetedHours || ''}
              onChange={(e) => onInputChange('budgetedHours', e.target.value)}
              placeholder="0"
              className="rounded-r-none"
            />
            <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
              h
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Logged Hours</Label>
          <div className="flex">
            <Input
              type="number"
              step="0.5"
              value={formData.loggedHours || ''}
              onChange={(e) => onInputChange('loggedHours', e.target.value)}
              placeholder="0"
              className="rounded-r-none"
            />
            <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
              h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 