"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FieldControl } from "@/components/ui/field-control";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      message: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, role } = useAuth();
  
  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    bio: "I manage AI prompts.",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit() {
    toast.success("Profile updated", {
      description: "Your profile has been updated successfully.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the platform.
        </p>
      </div>
      <Separator />
      
      <Card className="glass">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            Current Role: <span className="font-semibold text-primary">{role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FieldControl
                control={form.control}
                name="username"
                label="Username"
                type="input"
                placeholder="johndoe"
                description="This is your public display name. It can be your real name or a pseudonym."
              />
              
              <FieldControl
                control={form.control}
                name="email"
                label="Email"
                type="input"
                placeholder="m@example.com"
                description="Your verified email address used for login."
                disabled
              />
              
              <FieldControl
                control={form.control}
                name="bio"
                label="Bio"
                type="input"
                placeholder="Tell us a little bit about yourself"
                description="A brief description of your role or responsibilities."
              />
              <Button type="submit" className="bg-gradient-to-r from-primary to-accent border-0 text-white shadow-md">
                Update profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
