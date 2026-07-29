"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  // Toolbar components
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  ListsToggle,
  CodeToggle,
  DiffSourceToggleWrapper,
  Separator,
  InsertFrontmatter,
  type MDXEditorMethods,
  type MDXEditorProps
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { useTheme } from "next-themes";

interface EditorProps extends Omit<MDXEditorProps, 'ref'> {
  editorRef?: React.Ref<MDXEditorMethods>;
}

export default function MdxEditorCore({ editorRef, readOnly, ...props }: EditorProps) {
  const { resolvedTheme } = useTheme();

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
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin(),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
          frontmatterPlugin(),
          ...(readOnly ? [] : [
            toolbarPlugin({
              toolbarContents: () => (
                <DiffSourceToggleWrapper>
                  <div className="flex flex-wrap items-center gap-1 w-full p-1">
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <CreateLink />
                    <InsertImage />
                    <InsertTable />
                    <InsertThematicBreak />
                    <InsertCodeBlock />
                    <InsertFrontmatter />
                  </div>
                </DiffSourceToggleWrapper>
              )
            })
          ])
        ]}
        {...props}
        className={`min-h-[300px] prose dark:prose-invert max-w-none text-foreground ${resolvedTheme === 'dark' ? 'dark-theme dark-editor' : ''}`}
      />
    </div>
  );
}
