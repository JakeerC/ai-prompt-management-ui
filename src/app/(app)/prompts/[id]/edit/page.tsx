"use client";

import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePrompt, useUpdatePrompt } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdxEditor } from "@/components/shared/mdx-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TerminalSquare, LayoutGrid } from "lucide-react";
import type { UpdatePromptRequest } from "@/types/prompt";

const promptSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  businessImpact: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  categoryId: z.string().optional(),
  modelHint: z.string().optional(),
});

type PromptFormValues = z.infer<typeof promptSchema>;

export default function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: prompt, isLoading: loadingPrompt } = usePrompt(id);
  const { data: categories } = useCategories();
  const updatePrompt = useUpdatePrompt(id);
  
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    values: prompt ? {
      name: prompt.name,
      description: prompt.description || "",
      content: prompt.content,
      businessImpact: prompt.businessImpact,
      categoryId: prompt.category?.id || "",
      modelHint: prompt.modelHint || "",
    } : undefined,
    defaultValues: {
      name: "",
      description: "",
      content: "",
      businessImpact: "MEDIUM",
      categoryId: "",
      modelHint: "",
    },
  });

  if (loadingPrompt) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold">Prompt not found</h2>
        <Button onClick={() => router.push("/prompts")} className="mt-4" variant="outline">
          Back to Library
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: PromptFormValues) => {
    try {
      const payload: UpdatePromptRequest = {
        name: data.name,
        description: data.description,
        content: data.content,
        businessImpact: data.businessImpact,
        categoryId: data.categoryId || undefined,
        modelHint: data.modelHint || undefined,
      };

      await updatePrompt.mutateAsync(payload);
      toast.success("Prompt updated successfully");
      router.push(`/prompts/${id}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update prompt");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Prompt</h2>
        <p className="text-muted-foreground mt-1">
          Modify the prompt template. Changes will trigger a new version depending on the lifecycle engine.
        </p>
      </div>

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
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Extract Entities JSON" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What does this prompt do?" 
                            className="resize-none bg-background/50" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                  <FormField
                    control={form.control}
                    name="businessImpact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Impact</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select impact level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="modelHint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Hint</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. gpt-4, claude-3" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MdxEditor 
                        markdown={prompt.content} 
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
              disabled={updatePrompt.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-40 bg-gradient-to-r from-primary to-accent text-white border-0"
              disabled={updatePrompt.isPending}
            >
              {updatePrompt.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
