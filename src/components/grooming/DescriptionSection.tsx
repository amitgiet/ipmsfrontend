
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionSectionProps {
  description: string;
  oldDescription: string;
  setOldDescription: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUpdateDescription: () => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  oldDescription,
  setOldDescription,
  onDescriptionChange,
  onUpdateDescription
}) => {
  console.log("Dasdsadsad, ",description,"SADasdasd", oldDescription);
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add a detailed description for this user story..."
          className="min-h-32 mb-4"
        />
        <Button onClick={onUpdateDescription} disabled={description.length === 0 || description === oldDescription}>
          Update Description
        </Button>
      </CardContent>
    </Card>
  );
};
