import { strToU8, zlibSync, strFromU8, unzlibSync } from "fflate";
import { Files } from "./PlaygroundContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * 根据文件名判断文件类型
 *
 * 通过检查文件名的后缀来判断文件的语言或格式类型
 * 如果文件名没有后缀，或者后缀不在已知类型列表中，函数默认返回 'javascript'
 *
 * @param name 文件名，包含后缀
 * @returns 文件类型，可能的值为 'javascript', 'typescript', 'json', 或 'css'
 */
export const fileNameLanguage = (name: string) => {
  // 提取文件名的后缀
  const suffix = name.split(".").pop() || "";

  // 判断文件后缀是否为 JavaScript 或 JSX
  if (["js", "jsx"].includes(suffix)) return "javascript";
  // 判断文件后缀是否为 TypeScript 或 TSX
  if (["ts", "tsx"].includes(suffix)) return "typescript";
  // 判断文件后缀是否为 JSON
  if (["json"].includes(suffix)) return "json";
  // 判断文件后缀是否为 CSS
  if (["css"].includes(suffix)) return "css";

  // 默认情况下返回 'javascript'
  return "javascript";
};

export const compress = (data: string): string => {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);
  return btoa(binary);
};

export const uncompress = (base64: string): string => {
  const binary = atob(base64);

  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
};

export const copy = (e: any, content: string) => {
  if (e?.target && (content || e?.target.textContent)) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(content || e?.target.textContent || "")
        .then(() => {
          console.log("复制成功:", `${content || e?.target.textContent || ""}`);
        })
        .catch((err) => {
          console.log("复制失败", err);
        });
    }
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = content || e?.target.textContent || "";
    textArea.style.display = "none";
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      console.log(
        "使用兼容性复制成功:",
        `${content || e?.target.textContent || ""}`
      );
    } else {
      console.log("复制失败");
    }
  }
  return null;
};

export const downloadFiles = async (files: Files) => {
  const zip = new JSZip();

  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].value);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`);
};
