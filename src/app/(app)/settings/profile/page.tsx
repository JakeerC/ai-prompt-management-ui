"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormDescription>
                      This is your public display name. It can be your real name or a pseudonym.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} className="bg-background/50" disabled />
                    </FormControl>
                    <FormDescription>
                      Your verified email address used for login.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Tell us a little bit about yourself" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormDescription>
                      A brief description of your role or responsibilities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
