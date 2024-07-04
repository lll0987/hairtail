import { ipcMain } from 'electron';
import { services } from '../database';
import { IRecord } from '@t/interface';

const match = (str: string, key: string) => {
    const regex = new RegExp(`^${key}([:：]?\\s+)(\\S+)$`);
    const match = str.match(regex);
    return (match && match[2]) || '';
};

const handleInput = async (str: string) => {
    const out: Omit<IRecord, 'in' | 'out'> = {};

    for (const serviceName of ['tag', 'topic']) {
        const name = match(str, serviceName);
        if (!name) continue;
        const service = services[serviceName];
        const [msg, res] = await service.create({ name, color: '#000000' });
        if (msg) console.log(msg);
        if (res) out[serviceName] = [res];
        break;
    }

    return services.record.create({ in: str, out: '<(＿　＿)>', ...out });
};

export const handleNLP = () => {
    ipcMain.handle(`handleInput`, (_, data) => handleInput(data));
};
