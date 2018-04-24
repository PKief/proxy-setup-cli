import * as fs from 'fs';
import * as path from 'path';
import { checkIfFileExists } from '../helpers';
import { Host } from '../models';

const configFilePath = path.join('proxy-setup-cli.json');

/** If host was used it is stored in the store of this CLI. */
export const storeProxyHost = async (host: Host) => {
    const knownHosts = await getKnownHosts();

    // if host is already stored
    if (knownHosts.some(h => JSON.stringify(h) === JSON.stringify(host))) return;

    // if name is the same but port different then update port
    let updated = false;
    const updatedHosts = knownHosts.map(h => {
        if (h.name.toLowerCase() === host.name.toLowerCase()) {
            updated = true;
            return host;
        } else {
            return h;
        }
    });

    if (!updated) {
        updatedHosts.push(host);
    }

    fs.writeFileSync(configFilePath, JSON.stringify({ 'known-hosts': [...updatedHosts] }, undefined, 2));
};

/** Get known (already used) hosts */
export const getKnownHosts = async () => {
    if (!await checkIfFileExists(configFilePath)) return [];
    const knownHosts = JSON.parse(fs.readFileSync(configFilePath, { encoding: 'utf-8' }));
    if (!('known-hosts' in knownHosts)) return [];
    return knownHosts['known-hosts'] as Host[];
};

export const clearStore = () => {
    // Remove current user
    // store.remove(storeSectionName);
};
