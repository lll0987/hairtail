/* eslint-disable @typescript-eslint/no-var-requires */

export const request = (options: {
    method: 'GET' | 'POST';
    url: string;
    headers?: Record<string, string | string[]>;
    body?: Record<string, unknown>;
}) => {
    const { net } = require('electron');
    const { method, url, headers, body } = options;
    return new Promise((resolve, reject) => {
        const request = net.request({
            method,
            url,
            headers: { 'Content-Type': 'application/json', ...(headers || {}) }
        });
        if (body) request.write(JSON.stringify(body));

        request.on('response', response => {
            response.on('data', chunk => {
                resolve(JSON.parse(chunk.toString()));
            });
        });

        request.on('error', error => {
            reject(error);
        });

        request.end();
    });
};
