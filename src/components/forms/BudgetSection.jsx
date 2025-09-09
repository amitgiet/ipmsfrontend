import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BudgetSection = ({ formData, onInputChange, errors = {} }) => {
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
            min="0"
            max="999999999.99"
            value={formData.estimatedBudget || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow numeric input with reasonable budget limits
              if (value === '' || (/^\d{0,9}(\.\d{0,2})?$/.test(value) && parseFloat(value) <= 999999999.99)) {
                onInputChange('estimatedBudget', value);
              }
            }}
            onKeyPress={(e) => {
              // Allow numbers, decimal point, and navigation keys
              if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
              }
              // Prevent multiple decimal points
              if (e.key === '.' && e.target.value.includes('.')) {
                e.preventDefault();
              }
            }}
            placeholder="0.00"
            className="rounded-l-none"
          />
        </div>
        {errors.estimatedBudget && (
          <p className="text-xs text-red-500">{errors.estimatedBudget}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Budgeted Hours</Label>
          <div className="flex">
            <Input
              type="number"
              step="0.5"
              min="0"
              max="9999"
              value={formData.budgetedHours || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numeric input with max 4 digits
                if (value === '' || (/^\d{0,4}$/.test(value) && parseFloat(value) <= 9999)) {
                  onInputChange('budgetedHours', value);
                }
              }}
              onKeyPress={(e) => {
                // Prevent non-numeric characters except backspace, delete, arrow keys
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="0"
              className="rounded-r-none"
            />
            <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
              h
            </div>
          </div>
          {errors.budgetedHours && (
            <p className="text-xs text-red-500">{errors.budgetedHours}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Logged Hours</Label>
          <div className="flex">
            <Input
              type="number"
              step="0.5"
              min="0"
              max="9999"
              value={formData.loggedHours || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numeric input with max 4 digits
                if (value === '' || (/^\d{0,4}$/.test(value) && parseFloat(value) <= 9999)) {
                  onInputChange('loggedHours', value);
                }
              }}
              onKeyPress={(e) => {
                // Prevent non-numeric characters except backspace, delete, arrow keys
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="0"
              className="rounded-r-none"
            />
            <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
              h
            </div>
          </div>
          {errors.loggedHours && (
            <p className="text-xs text-red-500">{errors.loggedHours}</p>
          )}
          <p className="text-xs text-gray-500">Max: 9999 hours</p>
        </div>
      </div>
    </div>
  );
}; 