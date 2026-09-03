import { isTauri } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import FileSaver from "file-saver";
import { toast } from "@/utils/feedback";

const toBlob = async (source) => {
  if (source instanceof Blob) {
    return source;
  }

  if (typeof source !== "string" || !source) {
    throw new Error("没有可保存的文件内容");
  }

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error("无法读取生成的文件");
  }
  return response.blob();
};

const getExtension = (fileName) => {
  const extension = fileName.split(".").pop();
  return extension && extension !== fileName ? extension.toLowerCase() : "";
};

/**
 * 桌面端使用系统“另存为”并直接写入用户选择的路径；
 * 浏览器端保留原有的下载行为，便于项目继续作为网页运行。
 */
export const saveDownload = async ({ source, fileName, filterName = "文件" }) => {
  const blob = await toBlob(source);

  if (!isTauri()) {
    FileSaver.saveAs(blob, fileName);
    return { saved: true, path: "" };
  }

  const extension = getExtension(fileName);
  const path = await save({
    title: "保存文件",
    defaultPath: fileName,
    filters: extension
      ? [{ name: filterName, extensions: [extension] }]
      : undefined,
  });

  // 用户取消另存为不是异常，不展示失败提示。
  if (!path) {
    return { saved: false, cancelled: true, path: "" };
  }

  const bytes = new Uint8Array(await blob.arrayBuffer());
  await writeFile(path, bytes);
  return { saved: true, path };
};

export const saveDownloadWithFeedback = async (options) => {
  try {
    const result = await saveDownload(options);
    if (result.saved) {
      toast({
        type: "success",
        content: result.path ? `文件已保存：${result.path}` : "文件已开始下载",
      });
    }
    return result;
  } catch (error) {
    console.error("文件保存失败", error);
    toast({
      type: "error",
      content: `文件保存失败：${error?.message || error}`,
      duration: 5,
    });
    return { saved: false, cancelled: false, error };
  }
};
