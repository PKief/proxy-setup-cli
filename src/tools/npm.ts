import { execSync } from 'child_process';
import { UserInformation } from '../models';

export const configureNPMProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise((resolve, reject) => {
        if (enableProxy) {
            let proxyURL: string;

            if (u.username.trim().length > 0) {
                proxyURL = `http://${u.username}:${u.password}@${u.host}:${u.port}`;
            } else {
                proxyURL = `http://${u.host}:${u.port}`;
            }

            try {
                execSync(`npm config set proxy ${proxyURL}`);
                execSync(`npm config set https-proxy ${proxyURL}`);
            } catch {
                console.error('Error: Proxy for npm could not be set properly!');
            }
        } else {
            try {
                execSync(`npm config rm proxy`);
                execSync(`npm config rm https-proxy`);
            } catch {
                console.error('Error: Proxy for npm could not be set properly!');
            }
        }
        resolve();
    });
};
