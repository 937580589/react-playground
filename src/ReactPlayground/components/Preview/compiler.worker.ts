import { transform } from "@babel/standalone";
import { Files, File } from "../../PlaygroundContext";
import { ENTRY_FILE_NAME } from "../../files";
import { PluginObj } from "@babel/core";

export const beforeTransformCode = (filename: string, code: string) => {
  let _code = code;
  const regexReact = /import\s+React/g;
  // 检查文件名以".jsx"或者".tsx"结尾并且代码中不包含"React"导入，则在最顶端增加"React"导入
  if (
    filename.endsWith(".jsx") ||
    (filename.endsWith(".tsx") && !regexReact.test(code))
  ) {
    _code = `import React from 'react';\n${code}`;
  }
  return _code;
};

export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  const _code = beforeTransformCode(filename, code);
  let result = "";
  try {
    result = transform(_code, {
      presets: ["react", "typescript"],
      filename,
      plugins: [customResolver(files)],
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error("编译出错", e);
  }
  return result;
};

const getModuleFile = (files: Files, modulePath: string) => {
  // 以"./"分割字符串，得到数组，然后从数组中取出最后一个元素，即模块路径的文件名
  let moduleName = modulePath.split("./").pop() || "";
  // 如果模块路径中没有"."，则从所有文件名(过滤出以".ts",".tsx",".js","jsx"结尾的文件)中查找包含该模块名的文件名
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return (
          key.endsWith(".ts") ||
          key.endsWith(".tsx") ||
          key.endsWith(".js") ||
          key.endsWith(".jsx")
        );
      })
      .find((key) => {
        return key.split(".").includes(moduleName);
      });
    if (realModuleName) {
      moduleName = realModuleName;
    }
  }
  return files[moduleName];
};

const cssToJs = (file: File) => {
  const randomId = new Date().getTime();
  const js = `(()=> {
    const stylesheet = document.createElement('style');
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}');
    document.head.appendChild(stylesheet);

    const styles = document.createTextNode(\`${file.value}\`);
    stylesheet.innerHTML = '';
    stylesheet.appendChild(styles);
})()`;
  return URL.createObjectURL(
    new Blob([js], {
      type: "application/javascript",
    })
  );
};

const jsonToJs = (file: File) => {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(
    new Blob([js], {
      type: "application/javascript",
    })
  );
};

const customResolver = (files: Files): PluginObj => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath);
          if (!file) return;
          if (file.name.endsWith(".css")) {
            path.node.source.value = cssToJs(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = jsonToJs(file);
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: "application/javascript",
              })
            );
          }
        }
      },
    },
  };
};

export const compile = (files: Files) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

self.addEventListener("message", async ({ data }) => {
  try {
    self.postMessage({
      type: "COMPILED_CODE",
      data: compile(data),
    });
  } catch (e) {
    self.postMessage({
      type: "ERROR",
      error: e,
    });
  }
});
