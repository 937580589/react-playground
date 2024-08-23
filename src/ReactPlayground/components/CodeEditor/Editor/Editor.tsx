import MonacoEditor, { EditorProps, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { createATA } from "./ata";

export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

interface Props {
  file: EditorFile;
  onChange?: EditorProps["onChange"];
  options?: editor.IStandaloneEditorConstructionOptions;
}
const Editor = (props: Props) => {
  const { file, onChange, options } = props;
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      // const actions = editor.getSupportedActions().map((a) => a.id);
      // console.log(actions);
      editor.getAction("editor.action.formatDocument")?.run();
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });
    
    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  };
  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="typescript"
      onMount={handleEditorMount}
      path={file.name}
      value={file.value}
      onChange={onChange}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        // wordWrap: "on",
        lineNumbers: "on",
        tabSize: 2,
        insertSpaces: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    />
  );
};

export default Editor;
