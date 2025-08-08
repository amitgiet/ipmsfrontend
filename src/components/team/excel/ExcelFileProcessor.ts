
import * as XLSX from 'xlsx';
import { ExcelTeamMember, validateTeamMember, validateRole, validateSkills, validateIsActive } from './ExcelValidation';
import { UserRole } from '@/types/auth';

export interface ProcessResult {
  errors: string[];
  processedData: ExcelTeamMember[];
}

export const processExcelFile = (file: File): Promise<ProcessResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '', // Use empty string as default for missing values
          raw: false // Convert all values to strings first
        });

        console.log('Raw Excel data:', jsonData);

        const errors: string[] = [];
        const processedData: ExcelTeamMember[] = [];

        if (jsonData.length === 0) {
          errors.push('Excel file appears to be empty or has no data rows');
        }

        jsonData.forEach((row: any, index) => {
          const rowErrors = validateTeamMember(row, index);
          errors.push(...rowErrors);

          if (rowErrors.length === 0) {
            const teamMember: ExcelTeamMember = {
              name: row.name.toString().trim(),
              email: row.email.toString().trim().toLowerCase(),
              mobile_no: row.mobile_no ? row.mobile_no.toString().trim() : undefined,
              emergency_contact: row.emergency_contact ? row.emergency_contact.toString().trim() : undefined,
              password: row.password.toString(),
              role: validateRole(row.role) as UserRole,
              skills: validateSkills(row.skills),
              is_active: validateIsActive(row.is_active)
            };
            
            console.log(`Processed member ${index + 1}:`, teamMember);
            processedData.push(teamMember);
          }
        });

        console.log('Validation errors:', errors);
        console.log('Successfully processed members:', processedData.length);

        resolve({ errors, processedData });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(new Error('Failed to process Excel file. Please check the file format.'));
      }
    };
    
    reader.readAsArrayBuffer(file);
  });
};
