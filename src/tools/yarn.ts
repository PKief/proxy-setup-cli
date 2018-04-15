import { execSync } from 'child_process';
import { UserInformation } from '../models';

export const configureYarnProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise((resolve, reject) => {
        if (enableProxy) {
            let proxyURL: string;

            if (u.username.trim().length > 0) {
                proxyURL = `http://${u.username}:${u.password}@${u.host}:${u.port}`;
            } else {
                proxyURL = `http://${u.host}:${u.port}`;
            }

            execSync(`yarn config set proxy ${proxyURL}`);
            execSync(`yarn config set https-proxy ${proxyURL}`);
            resolve();
        } else {
            execSync(`yarn config delete proxy`);
            execSync(`yarn config delete https-proxy`);
            resolve();
        }
    });
};
