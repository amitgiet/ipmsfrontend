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
import { projectService } from "@/services/ProjectService/projectService";


const ProjectDashboardPage = () => {
  const params = useParams();
  const projectId = params?.projectId;
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  const fetchProjectDetails = async () => {
    const result = await projectService.getProjectDetails(projectId);
    setProject(result.data.data);
  };
  
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>The requested project could not be found.</CardDescription>
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
  return <ProjectDashboard project={project} onBack={handleBack} />;
}

export default ProjectDashboardPage;
