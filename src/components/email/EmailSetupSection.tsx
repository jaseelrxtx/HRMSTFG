import { Mail, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTemplatesTab from "./EmailTemplatesTab";
import SmtpSetupTab from "./SmtpSetupTab";

const EmailSetupSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Email Setup
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage email templates and configure SMTP settings for your organization
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-card">
            <Mail className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="smtp" className="gap-2 data-[state=active]:bg-card">
            <Settings2 className="h-4 w-4" />
            SMTP Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="mt-6">
          <EmailTemplatesTab />
        </TabsContent>
        <TabsContent value="smtp" className="mt-6">
          <SmtpSetupTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSetupSection;
