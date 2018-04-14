import { execSync } from 'child_process';
import { UserInformation } from '../models';

export const configureGitProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise((resolve, reject) => {
        if (enableProxy) {
            execSync(`git config --global http.proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            execSync(`git config --global https.proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            resolve();
        } else {
            try {
                execSync(`git config --global --unset http.proxy`);
                execSync(`git config --global --unset https.proxy`);
            } catch { } finally {
                resolve();
            }
        }
    });
};
