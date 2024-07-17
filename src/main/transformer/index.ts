import { BrowserWindow, ipcMain } from 'electron';
import { handleAccept, handleCache, handleIgnore } from './src/manual';

/**
 * 向渲染进程暴露方法
 * @param window
 */
export const handleTransformer = (window: BrowserWindow) => {
    ipcMain.handle(`handleInput`, (_, data) => handleCache(data, window));
    ipcMain.handle(`handleAccept`, (_, data) => handleAccept(data));
    ipcMain.handle(`handleIgnore`, (_, data) => handleIgnore(data));
};
