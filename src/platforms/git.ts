import { execSync } from 'child_process';
import * as path from 'path';
import * as properties from 'properties';
import { checkIfFileExists, getHomeDirectory } from '../helpers';
import { UserInformation } from '../models';

export const configureGitProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise(async (resolve, reject) => {
        if (enableProxy) {
            execSync(`git config --global http.proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            execSync(`git config --global https.proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            resolve();
        } else {
            const options = {
                path: true,
                sections: true,
            };
            const filePath = path.join(getHomeDirectory(), '.gitconfig');
            const configfileExists = await checkIfFileExists(filePath);
            if (configfileExists === true) {
                properties.parse(filePath, options, (error, obj) => {
                    if ('http' in obj) execSync(`git config --global --remove-section http`);
                    if ('https' in obj) execSync(`git config --global --remove-section https`);
                });
            }
            resolve();
        }
    });
};
