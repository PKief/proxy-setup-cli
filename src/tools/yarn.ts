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

            try {
                execSync(`yarn config --offline set proxy ${proxyURL}`);
                execSync(`yarn config --offline set https-proxy ${proxyURL}`);
            } catch {
                console.error('Error: Proxy for yarn could not be set properly!');
            }
        } else {
            try {
                execSync(`yarn config --offline delete proxy`);
                execSync(`yarn config --offline delete https-proxy`);
            } catch {
                console.error('Error: Proxy for yarn could not be set properly!');
            }
        }
        resolve();
    });
};
