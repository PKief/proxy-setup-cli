import { execSync } from 'child_process';
import * as path from 'path';
import * as properties from 'properties';
import { checkIfFileExists, getHomeDirectory } from '../helpers';
import { UserInformation } from '../models';

export const configureGitProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise(async (resolve, reject) => {
        if (enableProxy) {
            let proxyURL: string;

            if (u.username.trim().length > 0) {
                proxyURL = `http://${u.username}:${u.password}@${u.host}:${u.port}`;
            } else {
                proxyURL = `http://${u.host}:${u.port}`;
            }

            try {
                execSync(`git config --global http.proxy ${proxyURL}`);
                execSync(`git config --global https.proxy ${proxyURL}`);
            } catch {
                console.error('Error: Proxy for Git could not be set properly!');
            }
        } else {
            const options = {
                path: true,
                sections: true,
            };
            const filePath = path.join(getHomeDirectory(), '.gitconfig');
            const configfileExists = await checkIfFileExists(filePath);
            if (configfileExists === true) {
                properties.parse(filePath, options, (error, obj) => {
                    try {
                        if ('http' in obj) execSync(`git config --global --remove-section http`);
                        if ('https' in obj) execSync(`git config --global --remove-section https`);
                    } catch {
                        console.error('Error: Proxy for Git could not be set properly!');
                    }
                });
            }
        }
        resolve();
    });
};
