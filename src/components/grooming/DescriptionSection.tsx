
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onUpdateDescription: () => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  onDescriptionChange,
  onUpdateDescription
}) => {
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
        <Button onClick={onUpdateDescription}>
          Update Description
        </Button>
      </CardContent>
    </Card>
  );
};
