import dayjs from 'dayjs';
import { Conf } from 'electron-conf/main';
import { request } from '../../net';
import { Logger } from '../../logger';
import { services } from '../../database';
import { IRequest, ITopic } from '@contracts/interface';
import { TApiResponse } from '@contracts/type';
import { TopicService } from '../../database/services/topic.service';

const conf = new Conf();
const logger = new Logger('zhipu');

const service = services.topic as TopicService;

const base_url = 'https://chatglm.cn/chatglm/assistant-api/v1';

const api_key = import.meta.env.MAIN_VITE_ZP_API_KEY;
const api_secret = import.meta.env.MAIN_VITE_ZP_API_SECRET;

const assistant_id = import.meta.env.MAIN_VITE_ZP_ASSISTANT_ID;
// const conversation_id = '';

/**
 * 刷新 token，设置 token 和过期时间
 */
const refreshToken = async () => {
    const { result } = (await request({
        method: 'POST',
        url: `${base_url}/get_token`,
        body: { api_key, api_secret }
    })) as { result: { access_token: string; expires_in: number } };

    conf.set('zp.token', result.access_token);
    conf.set('zp.expires', Date.now() + result.expires_in * 1000);

    logger.info('refreshToken', conf.get('zp'));
};

/**
 * 获取 token，如果 token 过期刷新 token
 * @returns token
 */
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

interface ZPResponse {
    result: ZPResult;
    status: number;
    code: number;
    message: string;
}

/**
 *
 * @param text 输入文本
 * @returns ai 处理结果
 */
export const getFormattedText = async (text: string) => {
    // 今天的日期
    const today = dayjs().format('YYYY/MM/DD');
    // 所有主题
    const [msg, data] = (await service.list()) as [string | null, ITopic[]];
    const topic = data.map(item => item.name);
    // 最终提示文本
    const prompt = JSON.stringify({ text, today, topic } as IRequest);

    const access_token = await getToken();

    return new Promise<TApiResponse<string>>(resolve => {
        if (msg) return resolve([msg, null]);
        // 记录提示文本
        logger.info('prompt', prompt);

        request({
            method: 'POST',
            url: `${base_url}/stream_sync`,
            headers: { Authorization: `Bearer ${access_token}` },
            body: { assistant_id, prompt }
        })
            .then(res => {
                const { result, status, code, message } = res as ZPResponse;
                if (status !== 0) {
                    logger.error('fail', code, message);
                    return resolve(['请求遇到问题', null]);
                }
                const { content } = result.output.find(part => part.status === 'finish')!;
                // PERF 校验返回格式是否为 ZPText
                const { text } = Array.isArray(content) ? content[0] : content;
                logger.info('success', content);
                resolve([null, text]);
            })
            .catch(err => {
                logger.error('fail', err);
                resolve(['请求遇到问题', null]);
            });
    });
};
