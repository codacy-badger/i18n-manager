import * as path from 'path';
import { ParsedFile } from '../common/types';
import getPlugins, { Plugin } from './plugins';


export const getAvailablePlugins = (): Plugin[] => getPlugins();
export const getSupportedExtensions = (): string[] =>
  getAvailablePlugins().map(p => p.fileExtension);

export const getParsedFiles = async (files: string[]): Promise<ParsedFile[]> => {
  const parsedFiles: ParsedFile[] = [];
  for (let i = 0; i < files.length; ++i) {
    const parsedFile = await openFile(files[i]);
    if (parsedFile) {
      parsedFiles.push(parsedFile);
    }
  }

  return parsedFiles;
};

export const openFile = async (filePath: string): Promise<ParsedFile> => {
  const plugin = getPluginForFile(filePath);
  if (!plugin) {
    return null;
  }

  const fileName = path.basename(filePath);
  const extension = path.extname(filePath);
  const language = fileName.replace(extension, '');
  if (!language) {
    return null;
  }

  const data = await plugin.parse(filePath);
  if (!data) {
    return null;
  }

  return {
    fileName,
    language,
    extension,
    filePath,
    data,
  };
};

export const saveFile = async (parsedFile: ParsedFile): Promise<boolean> => {
  const plugin = getPluginForFile(parsedFile.filePath);
  return await plugin.save(parsedFile.filePath, parsedFile.data);
};

const getPluginForFile = (path: string) =>
  getPlugins()
    .filter(plugin => path.endsWith(plugin.fileExtension))[0];
