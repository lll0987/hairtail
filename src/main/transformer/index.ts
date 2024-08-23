import { BrowserWindow, ipcMain } from 'electron';
import { handleAccept, handleCache, handleIgnore } from './src/manual';

/**
 * 向渲染进程暴露方法
 * @param window
 */
export const handleTransformer = (window: BrowserWindow) => {
    ipcMain.handle(`ai:input`, (_, data) => handleCache(data, window));
    ipcMain.handle(`ai:accept`, (_, data) => handleAccept(data));
    ipcMain.handle(`ai:ignore`, (_, data) => handleIgnore(data));
};
