import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { skillsService } from "@/services/skillsService";
import { toast } from "react-toastify";

export const AdminSkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills(1);
  }, []);

  const fetchSkills = async (page = 1) => {
    setLoading(true);
    console.log("🔄 Fetching skills...");

    const result = await skillsService.getSkills({ page });

    if (result.success) {
      console.log("✅ Skills fetched successfully:", result.data);
      const skillsData = result.data.data || result.data || [];
      const meta = result.data.meta || {};
      
      setSkills(skillsData);
      setPagination({
        current_page: meta.current_page || 1,
        last_page: meta.last_page || 1,
        per_page: meta.per_page || 10,
        total: meta.total || 0
      });
    } else {
      console.error("❌ Failed to fetch skills:", result.error);
      toast.error("Failed to fetch skills. Please try again.");
    }

    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchSkills(newPage);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    if (skills.some(skill => skill.name === newSkill.trim())) {
      toast({
        title: "Error",
        description: "Skill already exists",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    console.log("🔄 Adding new skill:", newSkill.trim());

    const addResult = await skillsService.createSkill({
      name: newSkill.trim(),
    });

    if (addResult.success) {
      console.log("✅ Skill added successfully:", addResult.data);
      toast.success("Skill added successfully");
      // Add the new skill to the local state
      fetchSkills(); // Re-fetch skills to update pagination and list
      setNewSkill(''); 
    } 
    setIsAdding(false);
  };

  const removeSkill = async (skillToRemove) => {
    const deleteResult = await skillsService.deleteSkill(skillToRemove.id || skillToRemove);

    if (deleteResult.success) {
      // Remove the skill from local state
      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill.id !== (skillToRemove.id || skillToRemove))
      );

        toast.success("Skill removed successfully");
    } else {
      console.error("❌ Failed to remove skill:", deleteResult.error);
      toast({
        title: "Error",
        description: deleteResult.error?.message || "Failed to remove skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Skills Master</h2>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full p-6">
      <h2 className="text-2xl font-bold">Skills Master ({pagination.total})</h2>

      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter skill name"
                onKeyPress={handleKeyPress}
                disabled={isAdding}
              />
            </div>
            <Button
              onClick={addSkill}
              className="mt-6"
              disabled={isAdding || !newSkill.trim()}
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
                // onClick={() => removeSkill(skill)}
              >
                {skill.name} 
              </Badge>
            ))}
          </div>
          {skills.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No skills added yet
            </p>
          )}
          
          {/* Pagination */}
          {/* {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.last_page}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
};
