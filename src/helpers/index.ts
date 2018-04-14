import { Platform } from '../models';
import * as fs from 'fs';
import * as os from 'os';

export const getHomeDirectory = () => os.homedir();

export const checkIfFileExists = (path: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (!err) {
                resolve(true);
            } else if (err.code === 'ENOENT') {
                resolve(false);
            }
        });
    });
};

export const printInfo = (p: Platform) => {
    console.log(`${p.enabled ? '+' : '-'} ${p.name} proxy ${p.enabled ? 'enabled' : 'disabled'}!`);
};
