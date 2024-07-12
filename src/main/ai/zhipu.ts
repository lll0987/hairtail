import dayjs from 'dayjs';
import { Conf } from 'electron-conf/main';
import { request } from '../net';
import { Logger } from '../logger';
import { services } from '../database';
import { IRequest } from '@t/interface';

const conf = new Conf();
const logger = new Logger('zhipu');

const base_url = 'https://chatglm.cn/chatglm/assistant-api/v1';

const api_key = import.meta.env.MAIN_VITE_ZP_API_KEY;
const api_secret = import.meta.env.MAIN_VITE_ZP_API_SECRET;

const assistant_id = import.meta.env.MAIN_VITE_ZP_ASSISTANT_ID;
// const conversation_id = '';

const refreshToken = async () => {
    const { result } = (await request({
        method: 'POST',
        url: `${base_url}/get_token`,
        body: { api_key, api_secret }
    })) as { result: { access_token: string; expires_in: number } };

    conf.set('zp.token', result.access_token);
    conf.set('zp.expires', dayjs().add(result.expires_in, 'minute').valueOf());
};

const getToken = async () => {
    const now = dayjs().valueOf();
    const { token, expires } = conf.get('zp') as { token: string; expires: number };

    if (token && expires && now < expires) return token;
    await refreshToken();
    return conf.get('zp.token');
};

type ZPStatus = 'init' | 'processing' | 'finish' | 'error';

interface ZPText {
    type: 'text';
    text: string;
}

interface ZPPart {
    content: ZPText | ZPText[];
    status: ZPStatus;
}

interface ZPResult {
    conversation_id: string;
    output: ZPPart[];
    status: ZPStatus;
}

export const sendAssistant = async (text: string) => {
    // 今天的日期
    const today = dayjs().format('YYYY/MM/DD');
    // 所有主题
    const [msg, data] = await services.topic.list();
    const topic = data.map(item => item.name);
    // 最终提示文本
    const prompt = JSON.stringify({ text, today, topic } as IRequest);

    const access_token = await getToken();

    return new Promise<string>((resolve, reject) => {
        if (msg) return reject(msg);
        logger.info('prompt', prompt);
        request({
            method: 'POST',
            url: `${base_url}/stream_sync`,
            headers: { Authorization: `Bearer ${access_token}` },
            body: { assistant_id, prompt }
        })
            .then(res => {
                const { result } = res as { result: ZPResult };
                const { content } = result.output.find(part => part.status === 'finish')!;
                const { text } = Array.isArray(content) ? content[0] : content;
                resolve(text);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};
