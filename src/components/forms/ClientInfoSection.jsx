import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ClientInfoSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Client Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={formData.clientName || ''}
            onChange={(e) => onInputChange('clientName', e.target.value)}
            placeholder="Enter client name"
            className={errors.clientName ? 'border-red-500' : ''}
          />
          {errors.clientName && <p className="text-sm text-red-500">{errors.clientName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail || ''}
            onChange={(e) => onInputChange('clientEmail', e.target.value)}
            placeholder="Enter client email"
            className={errors.clientEmail ? 'border-red-500' : ''}
          />
          {errors.clientEmail && <p className="text-sm text-red-500">{errors.clientEmail}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientPhone">Client Phone</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={formData.clientPhone || ''}
            onChange={(e) => onInputChange('clientPhone', e.target.value)}
            placeholder="Enter client phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="backupContact">Backup Contact</Label>
          <Input
            id="backupContact"
            value={formData.backupContact || ''}
            onChange={(e) => onInputChange('backupContact', e.target.value)}
            placeholder="Enter backup contact"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="allowClientAccess"
          checked={formData.allowClientAccess || false}
          onChange={(e) => onInputChange('allowClientAccess', e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="allowClientAccess">Allow Client Access</Label>
        {formData.allowClientAccess && (
          <span className="text-sm text-gray-600">(Password: Dots123)</span>
        )}
      </div>
    </div>
  );
}; 