import { ref } from 'vue';

const ipcRenderer = window.electron.ipcRenderer;

export const useChatApi = (handleSuccess: () => Promise<void>) => {
    const sendLoading = ref(false);

    const send = (text: string) => {
        sendLoading.value = true;
        return ipcRenderer.invoke('ai:input', text);
    };
    ipcRenderer.on('insert-record-success', async () => {
        await handleSuccess();
        sendLoading.value = false;
    });

    const accept = (id: string) => {
        return ipcRenderer.invoke('ai:accept', id);
    };
    const ignore = (id: string) => {
        return ipcRenderer.invoke('ai:ignore', id);
    };

    return { sendLoading, send, accept, ignore };
};
