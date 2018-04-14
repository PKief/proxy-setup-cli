import { execSync } from 'child_process';
import { UserInformation } from '../models';

export const configureYarnProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise((resolve, reject) => {
        if (enableProxy) {
            execSync(`yarn config set proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            execSync(`yarn config set https-proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            resolve();
        } else {
            execSync(`yarn config delete proxy`);
            execSync(`yarn config delete https-proxy`);
            resolve();
        }
    });
};
