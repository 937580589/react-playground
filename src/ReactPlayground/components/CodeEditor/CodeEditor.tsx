import { useContext } from "react";
import MainEditor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "@/ReactPlayground/PlaygroundContext";
import { debounce } from "lodash-es";
const CodeEditor = () => {
  const { theme, files, setFiles, selectedFileName } =
    useContext(PlaygroundContext);

  const file = files[selectedFileName];
  const onEditorChange = (value?: string) => {
    files[file.name].value = value!;
    setFiles({ ...files });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <FileNameList />
      <MainEditor
        file={file}
        onChange={debounce(onEditorChange, 500)}
        options={{
          theme: `vs-${theme}`,
        }}
      />
    </div>
  );
};

export default CodeEditor;
