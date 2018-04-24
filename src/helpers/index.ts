import * as fs from 'fs';
import * as os from 'os';
import { Tool } from '../models';

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

export const printInfo = (p: Tool) => {
    if (p.enableProxy) {
        console.log('\x1b[32m%s\x1b[0m', `> ${p.name} proxy enabled!`);
    } else {
        console.log('\x1b[31m%s\x1b[0m', `> ${p.name} proxy disabled!`);
    }
};
