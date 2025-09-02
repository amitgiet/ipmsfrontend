import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, User } from 'lucide-react';

export const ClientInfoSection = ({ formData, errors, onInputChange }) => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: formData.clientName || '',
      email: formData.clientEmail || '',
      phone: formData.clientPhone || '',
      backupContact: formData.backupContact || ''
    }
  ]);

  const addClient = () => {
    const newClient = {
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      backupContact: ''
    };
    setClients([...clients, newClient]);
  };

  const removeClient = (clientId) => {
    if (clients.length > 1) {
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      updateFormData(updatedClients);
    }
  };

  const updateClient = (clientId, field, value) => {
    const updatedClients = clients.map(client => 
      client.id === clientId ? { ...client, [field]: value } : client
    );
    setClients(updatedClients);
    updateFormData(updatedClients);
  };

  const updateFormData = (clientsList) => {
    // Update the main form data with the first client as primary
    const primaryClient = clientsList[0] || {};
    onInputChange('clientName', primaryClient.name || '');
    onInputChange('clientEmail', primaryClient.email || '');
    onInputChange('clientPhone', primaryClient.phone || '');
    onInputChange('backupContact', primaryClient.backupContact || '');
    
    // Store all clients in formData for API submission
    onInputChange('allClients', clientsList);
  };

  const formatPhoneNumber = (value) => {
    const length = value.length;
    if (length > 13) {
      return value.substring(0, 13);
    }
    if (!value.startsWith('+91')) {
      return '+91' + value;
    }
    return value.replace(/[^0-9+]/g, '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Client Information</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addClient}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {clients.map((client, index) => (
        <Card key={client.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                {index === 0 ? 'Primary Client' : `Additional Client ${index}`}
                {index === 0 && <Badge variant="secondary">Primary</Badge>}
              </CardTitle>
              {clients.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClient(client.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`clientName-${client.id}`}>
                  Client Name {index === 0 ? '*' : ''}
                </Label>
                <Input
                  id={`clientName-${client.id}`}
                  value={client.name}
                  onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                  placeholder="Enter client name"
                  className={index === 0 && errors.clientName ? 'border-red-500' : ''}
                />
                {index === 0 && errors.clientName && (
                  <p className="text-sm text-red-500">{errors.clientName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`clientEmail-${client.id}`}>
                  Client Email {index === 0 ? '*' : ''}
                </Label>
                <Input
                  id={`clientEmail-${client.id}`}
                  type="email"
                  value={client.email}
                  onChange={(e) => updateClient(client.id, 'email', e.target.value)}
                  placeholder="Enter client email"
                  className={index === 0 && errors.clientEmail ? 'border-red-500' : ''}
                />
                {index === 0 && errors.clientEmail && (
                  <p className="text-sm text-red-500">{errors.clientEmail}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`clientPhone-${client.id}`}>Client Phone</Label>
                <Input
                  id={`clientPhone-${client.id}`}
                  type="text"
                  value={client.phone}
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);
                    updateClient(client.id, 'phone', formattedValue);
                  }}
                  placeholder="Enter client phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`backupContact-${client.id}`}>Backup Contact</Label>
                <Input
                  id={`backupContact-${client.id}`}
                  type="text"
                  value={client.backupContact}
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);
                    updateClient(client.id, 'backupContact', formattedValue);
                  }}
                  placeholder="Enter backup contact"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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

      {clients.length > 1 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The first client will be set as the primary client. 
            All clients will be included in the project details.
          </p>
        </div>
      )}
    </div>
  );
}; 