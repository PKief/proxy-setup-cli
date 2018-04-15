import * as fs from 'fs';
import * as path from 'path';
import { checkIfFileExists, getHomeDirectory } from '../helpers';
import { UserInformation } from '../models';

export const configureBowerProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise(async (resolve, reject) => {
        const filePath = path.join(getHomeDirectory(), '.bowerrc');
        const configfileExists = await checkIfFileExists(filePath);

        const proxySettings = enableProxy ? {
            'proxy': `http://${u.username}:${u.password}@${u.host}:${u.port}`,
            'https-proxy': `http://${u.username}:${u.password}@${u.host}:${u.port}`
        } : {};

        if (configfileExists === true) {
            const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (enableProxy) {
                config['proxy'] = proxySettings['proxy'];
                config['https-proxy'] = proxySettings['https-proxy'];
            } else {
                delete config['proxy'];
                delete config['https-proxy'];
            }
            fs.writeFileSync(filePath, JSON.stringify(config, undefined, 2));
            resolve();
        } else {
            if (enableProxy) {
                fs.writeFileSync(filePath, JSON.stringify(proxySettings, undefined, 2));
            }
            resolve();
        }
    });
};
