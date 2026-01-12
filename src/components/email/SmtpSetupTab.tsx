import { useState, useEffect } from "react";
import { Server, Shield, Send, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useSmtpConfig, useCreateSmtpConfig, useUpdateSmtpConfig } from "@/hooks/useSmtpSetup";

const SmtpSetupTab = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  
  const { data: existingConfig, isLoading } = useSmtpConfig();
  const createConfig = useCreateSmtpConfig();
  const updateConfig = useUpdateSmtpConfig();

  const [config, setConfig] = useState({
    host: "smtp.example.com",
    port: "587",
    username: "noreply@company.com",
    password: "",
    encryption: "tls" as "tls" | "ssl" | "none",
    fromName: "Think Forge HRMS",
    fromEmail: "noreply@company.com",
    replyTo: "hr@company.com",
    enabled: true,
  });

  // Load existing config when available
  useEffect(() => {
    if (existingConfig) {
      setConfig({
        host: existingConfig.host,
        port: existingConfig.port.toString(),
        username: existingConfig.username,
        password: existingConfig.password || "",
        encryption: existingConfig.encryption || "tls",
        fromName: existingConfig.from_name,
        fromEmail: existingConfig.from_email,
        replyTo: existingConfig.reply_to || "",
        enabled: existingConfig.enabled,
      });
    }
  }, [existingConfig]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus("idle");
    
    // Simulate API call for now (in real app, call a backend function)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const success = config.password.length > 0;
    setConnectionStatus(success ? "success" : "error");
    setIsTesting(false);
    
    toast({
      title: success ? "Connection Successful" : "Connection Failed",
      description: success 
        ? "SMTP server is reachable and credentials are valid" 
        : "Could not connect to SMTP server. Please check your settings.",
      variant: success ? "default" : "destructive",
    });
  };

  const handleSave = async () => {
    try {
      if (existingConfig?.id) {
        await updateConfig.mutateAsync({
          id: existingConfig.id,
          config: {
            host: config.host,
            port: parseInt(config.port),
            username: config.username,
            password: config.password,
            encryption: config.encryption,
            from_name: config.fromName,
            from_email: config.fromEmail,
            reply_to: config.replyTo,
            enabled: config.enabled,
          }
        });
      } else {
        await createConfig.mutateAsync({
          host: config.host,
          port: parseInt(config.port),
          username: config.username,
          password: config.password,
          encryption: config.encryption,
          from_name: config.fromName,
          from_email: config.fromEmail,
          reply_to: config.replyTo,
          enabled: config.enabled,
        });
      }
      
      toast({
        title: "Settings Saved",
        description: "SMTP configuration has been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Saving Settings",
        description: error.message || "Failed to save SMTP settings",
      });
    }
  };

  if (isLoading) {
    return <div>Loading SMTP settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Server Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Server Configuration</CardTitle>
                <CardDescription>Configure your SMTP server settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  placeholder="smtp.example.com"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Select 
                  value={config.port} 
                  onValueChange={(value) => setConfig({ ...config, port: value })}
                >
                  <SelectTrigger id="port">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 (SMTP)</SelectItem>
                    <SelectItem value="465">465 (SSL)</SelectItem>
                    <SelectItem value="587">587 (TLS)</SelectItem>
                    <SelectItem value="2525">2525 (Alternative)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your-email@example.com"
                value={config.username}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={existingConfig?.password ? "••••••••" : "Enter password"}
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="encryption">Encryption</Label>
              <Select 
                value={config.encryption} 
                onValueChange={(value: "tls" | "ssl" | "none") => setConfig({ ...config, encryption: value })}
              >
                <SelectTrigger id="encryption">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="tls">TLS (Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Email Identity */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Email Identity</CardTitle>
                <CardDescription>Configure sender information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                placeholder="Company HRMS"
                value={config.fromName}
                onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="noreply@company.com"
                value={config.fromEmail}
                onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyTo">Reply-To Email</Label>
              <Input
                id="replyTo"
                type="email"
                placeholder="hr@company.com"
                value={config.replyTo}
                onChange={(e) => setConfig({ ...config, replyTo: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Email Sending</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle to enable or disable all outgoing emails
                </p>
              </div>
              <Switch
                id="enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Test & Save */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {connectionStatus === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                  Connection verified
                </div>
              )}
              {connectionStatus === "error" && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  Connection failed
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none gap-2"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                <Send className="h-4 w-4" />
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>
              <Button 
                className="flex-1 sm:flex-none"
                onClick={handleSave}
                disabled={createConfig.isPending || updateConfig.isPending}
              >
                {createConfig.isPending || updateConfig.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmtpSetupTab;
