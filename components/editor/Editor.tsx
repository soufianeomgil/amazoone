"use client";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  ConditionalContents,
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  imagePlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";

import "@mdxeditor/editor/style.css";
import "./editor.css";

interface Props {
  value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  disabled: boolean;
}

const Editor = ({ value, editorRef, disabled, fieldChange, ...props }: Props) => {
  const { resolvedTheme } = useTheme();

  const editorClassName =
    resolvedTheme === "dark"
      ? "mdx-editor-tall markdown-editor !bg-[rgb(49,49,49)] dark-editor w-full border !text-white"
      : "mdx-editor-tall markdown-editor light-editor  shadow-sm w-full ";

  return (
    <MDXEditor 
      placeholder="Describe your product benefits, materials, use cases…"
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      className={editorClassName}
      readOnly={disabled}
      onChange={fieldChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
            
              options={[
                {
                  fallback: () => (
                    <div className="flex flex-wrap gap-2 items-center">
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CreateLink />
                      
                      <Separator />
                      
                      <InsertThematicBreak />
                    </div>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
    />
  );
};

export default Editor;
