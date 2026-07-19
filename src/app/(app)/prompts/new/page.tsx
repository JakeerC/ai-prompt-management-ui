import { CreatePromptForm } from "./create-prompt-form";

export default function NewPromptPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Prompt</h2>
        <p className="text-muted-foreground mt-1">
          Draft a new prompt template to be added to the library.
        </p>
      </div>

      <CreatePromptForm />
    </div>
  );
}
