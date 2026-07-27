"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

const Editor = dynamic(() => import("./mdx-editor-core"), {
  ssr: false,
  loading: () => <Skeleton className="w-full min-h-[300px]" />
});

export const MdxEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => {
  return <Editor {...props} editorRef={ref} />;
});

MdxEditor.displayName = "MdxEditor";

