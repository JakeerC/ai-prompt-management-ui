"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePrompt } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldControl } from "@/components/ui/field-control";
import { MdxEditor } from "@/components/shared/mdx-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, TerminalSquare, LayoutGrid } from "lucide-react";
import type { CreatePromptRequest } from "@/types/prompt";

const promptSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  businessImpact: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  categoryId: z.string().optional(),
  modelHint: z.string().optional(),
});

type PromptFormValues = z.infer<typeof promptSchema>;

export function CreatePromptForm() {
  const router = useRouter();
  const createPrompt = useCreatePrompt();
  const { data: categories } = useCategories();
  
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
      businessImpact: "MEDIUM",
      categoryId: "",
      modelHint: "",
    },
  });

  const onSubmit = async (data: PromptFormValues) => {
    try {
      const payload: CreatePromptRequest = {
        name: data.name,
        description: data.description,
        content: data.content,
        businessImpact: data.businessImpact,
        categoryId: data.categoryId || undefined,
        modelHint: data.modelHint || undefined,
      };

      const result = await createPrompt.mutateAsync(payload);
      toast.success("Prompt created successfully");
      router.push(`/prompts/${result.id}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create prompt");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area - Top Left */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TerminalSquare className="w-5 h-5 text-primary" />
                  Core Details
                </CardTitle>
                <CardDescription>
                  The foundational information for this prompt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldControl
                  control={form.control}
                  name="name"
                  label="Name"
                  type="input"
                  placeholder="e.g. Extract Entities JSON"
                  description="A clear, descriptive name for this prompt."
                />
                <FieldControl
                  control={form.control}
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="What does this prompt do?"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area - Top Right */}
          <div className="space-y-8">
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldControl
                  control={form.control}
                  name="businessImpact"
                  label="Business Impact"
                  type="select"
                  placeholder="Select impact level"
                  options={[
                    { label: "Low", value: "LOW" },
                    { label: "Medium", value: "MEDIUM" },
                    { label: "High", value: "HIGH" },
                    { label: "Critical", value: "CRITICAL" }
                  ]}
                  description="Determines the required approval level."
                />

                <FieldControl
                  control={form.control}
                  name="categoryId"
                  label="Category"
                  type="select"
                  placeholder="Select a category"
                  options={[
                    { label: "None", value: "" },
                    ...(categories?.map(cat => ({ label: cat.name, value: cat.id })) || [])
                  ]}
                />
                
                <FieldControl
                  control={form.control}
                  name="modelHint"
                  label="Model Hint"
                  type="input"
                  placeholder="e.g. gpt-4, claude-3"
                  description="Suggested model family for execution."
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Prompt Content */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Prompt Content
            </CardTitle>
            <CardDescription>
              Write your prompt template. Use {"{{variable}}"} syntax for variables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MdxEditor 
                      markdown={field.value || ""} 
                      onChange={field.onChange} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-32 glass"
            onClick={() => router.back()}
            disabled={createPrompt.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-40 bg-gradient-to-r from-primary to-accent text-white border-0"
            disabled={createPrompt.isPending}
          >
            {createPrompt.isPending ? "Creating..." : "Create Prompt"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
