"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your security settings and authentication.
        </p>
      </div>
      <Separator />

      <Card className="glass">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Update your password and secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Security settings are managed through your identity provider.</p>
        </CardContent>
      </Card>
    </div>
  );
}
