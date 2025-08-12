import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectDashboard from "./ProjectDashboard.tsx";

// // Demo project data
const demoProject = {
  id: "1",
  project_name: "E-Commerce Platform Redesign",
  project_id: "ECOM-2024-001",
  client_name: "TechCorp Solutions",
  project_status: "in_progress",
  start_date: "2024-01-15",
  end_date: "2024-06-30",
  estimated_budget: 75000,
  budget_currency: "USD",
  progress_percent: 65,
  priority: "high",
  created_at: "2024-01-10T10:00:00Z",
  project_type: "web development",
  client_email: "contact@techcorp.com",
  client_phone: "+1-555-0123",
  backup_contact: "Sarah Johnson",
  allow_client_access: true,
  actual_budget_used: 48750,
  logged_hours: 320,
  duration: "5 months",
  documents: [
    { name: "Project Requirements.pdf", url: "#" },
    { name: "Design Mockups.zip", url: "#" },
    { name: "API Documentation.docx", url: "#" },
  ],
  milestones: [
    { name: "Design Phase", completed: true, due_date: "2024-02-15" },
    { name: "Development Phase", completed: false, due_date: "2024-04-30" },
    { name: "Testing Phase", completed: false, due_date: "2024-05-31" },
    { name: "Launch", completed: false, due_date: "2024-06-30" },
  ],
  client_dependencies: [
    "Content approval for homepage",
    "Product catalog data",
    "Payment gateway credentials",
  ],
  tags_labels: ["redesign", "e-commerce", "responsive", "payment-integration"],
  created_by: "admin@company.com",
};

const ProjectDashboardPage = () => {
  const params = useParams();
  const projectId = params?.projectId;
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    navigate("/dashboard");
  };
  try {
    const safeProject = {
      ...demoProject,
    };
    return <ProjectDashboard project={safeProject} onBack={handleBack} />;
  } catch (err) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Error Rendering Project</CardTitle>
            <CardDescription>error</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default ProjectDashboardPage;
