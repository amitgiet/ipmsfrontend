
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { ExcelTeamMember } from './ExcelValidation';

interface ExcelImportPreviewProps {
  data: ExcelTeamMember[];
  hasErrors: boolean;
}

export const ExcelImportPreview: React.FC<ExcelImportPreviewProps> = ({ data, hasErrors }) => {
  if (data.length === 0 || hasErrors) return null;

  return (
    <Alert>
      <CheckCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-2">Preview: {data.length} team members ready to import</div>
        <div className="max-h-40 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1">Name</th>
                <th className="text-left p-1">Email</th>
                <th className="text-left p-1">Role</th>
                <th className="text-left p-1">Skills</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((member, index) => (
                <tr key={index} className="border-b">
                  <td className="p-1">{member.name}</td>
                  <td className="p-1">{member.email}</td>
                  <td className="p-1">{member.role}</td>
                  <td className="p-1">{member.skills.join(', ') || 'None'}</td>
                </tr>
              ))}
              {data.length > 5 && (
                <tr>
                  <td colSpan={4} className="p-1 text-gray-500 italic">
                    ... and {data.length - 5} more
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AlertDescription>
    </Alert>
  );
};
