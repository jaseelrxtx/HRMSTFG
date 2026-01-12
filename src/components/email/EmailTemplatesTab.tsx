import { useState } from "react";
import { Search, Plus, Filter, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmailTemplateCard from "./EmailTemplateCard";
import TemplateEditorModal from "./TemplateEditorModal";
import { toast } from "@/hooks/use-toast";
import { 
  useEmailTemplates, 
  useCreateEmailTemplate, 
  useUpdateEmailTemplate, 
  useDeleteEmailTemplate,
  EmailTemplate 
} from "@/hooks/useEmailTemplates";
import { formatDistanceToNow } from "date-fns";

const EmailTemplatesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates = [], isLoading } = useEmailTemplates();
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  // const deleteTemplate = useDeleteEmailTemplate();

  const categories = ["all", "Onboarding", "Leave Management", "Security", "Celebrations", "Offboarding", "General"];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setEditingTemplate(template);
      setEditorOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setEditingTemplate(template);
      setEditorOpen(true);
    }
  };

  const handleDuplicate = async (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      try {
        await createTemplate.mutateAsync({
          name: `${template.name} (Copy)`,
          subject: template.subject,
          body: template.body,
          category: template.category,
          status: "draft",
        });
        toast({
          title: "Template Duplicated",
          description: "A copy of the template has been created",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to duplicate template",
        });
      }
    }
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setEditorOpen(true);
  };

  const handleSaveTemplate = async (templateData: {
    id?: string;
    name: string;
    subject: string;
    category: string;
    status: "active" | "draft";
    body: string;
  }) => {
    try {
      if (templateData.id) {
        await updateTemplate.mutateAsync({
          id: templateData.id,
          name: templateData.name,
          subject: templateData.subject,
          category: templateData.category,
          status: templateData.status,
          body: templateData.body,
        });
      } else {
        await createTemplate.mutateAsync({
          name: templateData.name,
          subject: templateData.subject,
          category: templateData.category,
          status: templateData.status,
          body: templateData.body,
        });
      }
      toast({
        title: "Success",
        description: `Template has been ${templateData.id ? 'updated' : 'created'} successfully`,
      });
      setEditorOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${templateData.id ? 'update' : 'create'} template`,
      });
    }
  };

  // Helper to adapt database model to UI model expected by Card
  const adaptTemplateForCard = (template: EmailTemplate) => ({
    id: template.id,
    name: template.name,
    subject: template.subject,
    category: template.category,
    lastModified: template.updated_at 
      ? formatDistanceToNow(new Date(template.updated_at), { addSuffix: true }) 
      : "Unknown",
    status: template.status,
    body: template.body
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="gap-2 shrink-0" onClick={handleNewTemplate}>
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <TemplateEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />

      <div className="grid gap-4">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <EmailTemplateCard
              key={template.id}
              template={adaptTemplateForCard(template)}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No templates found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTemplatesTab;
