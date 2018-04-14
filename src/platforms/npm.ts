import { execSync } from 'child_process';
import { UserInformation } from '../models';

export const configureNPMProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise((resolve, reject) => {
        if (enableProxy) {
            execSync(`npm config set proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            execSync(`npm config set https-proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
            resolve();
        } else {
            execSync(`npm config rm proxy`);
            execSync(`npm config rm https-proxy`);
            resolve();
        }
    });
};
