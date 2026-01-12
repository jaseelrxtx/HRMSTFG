import { Mail, Eye, Edit, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmailTemplateCardProps {
  template: {
    id: string;
    name: string;
    subject: string;
    category: string;
    lastModified: string;
    status: "active" | "draft";
  };
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const EmailTemplateCard = ({ template, onPreview, onEdit, onDuplicate }: EmailTemplateCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-card-foreground truncate">{template.name}</h3>
                <Badge 
                  variant={template.status === "active" ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {template.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">{template.subject}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-secondary">{template.category}</span>
                <span>Modified {template.lastModified}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onPreview(template.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onEdit(template.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onDuplicate(template.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTemplateCard;
