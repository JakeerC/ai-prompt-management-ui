"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  type MDXEditorMethods,
  type MDXEditorProps
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface EditorProps extends Omit<MDXEditorProps, 'ref'> {
  editorRef?: React.Ref<MDXEditorMethods>;
}

export default function MdxEditorCore({ editorRef, readOnly, ...props }: EditorProps) {
  return (
    <div className={`border rounded-md bg-background/50 overflow-hidden ${readOnly ? "border-transparent" : "border-input"}`}>
      <MDXEditor
        ref={editorRef}
        readOnly={readOnly}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          ...(readOnly ? [] : [
            toolbarPlugin({
              toolbarContents: () => (
                <div className="flex items-center gap-1 w-full bg-muted/50 p-1 border-b border-border/50">
                  <UndoRedo />
                  <div className="w-px h-4 bg-border mx-1" />
                  <BoldItalicUnderlineToggles />
                  <div className="w-px h-4 bg-border mx-1" />
                  <BlockTypeSelect />
                </div>
              )
            })
          ])
        ]}
        {...props}
        className="min-h-[300px] prose dark:prose-invert max-w-none text-foreground"
      />
    </div>
  );
}
