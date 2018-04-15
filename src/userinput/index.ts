import * as fuzzy from 'fuzzy';
import * as inquirer from 'inquirer';
import { Host, Tool, UserInformation } from '../models';
import { getKnownHosts } from '../store';
import { supportedtools } from '../tools';

// Load autocomplete plugin of inquirer
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * The user has to select for which tool the proxy should be enabled / disabled.
 */
export const initUserInteraction = () => {
    return new Promise<{ tools: Tool[], userInformation: UserInformation }>
        ((resolve, reject) => {
            inquirer.prompt([{
                type: 'checkbox',
                name: 'tools',
                pageSize: 10,
                message: 'Mark tool to enable / unmark to disable proxy settings',
                choices: [
                    new inquirer.Separator('\nSupported tools:'),
                    ...supportedtools,
                ],
            }]).then(async (answers: { tools: string[] }) => {
                let tools: Tool[] = answers.tools.map(p => ({ name: p, enableProxy: true }));
                const disabled: Tool[] = supportedtools.filter(p => answers.tools.indexOf(p) === -1).map(p => ({ name: p, enableProxy: false }));
                tools = [...tools, ...disabled];

                let userInformation: UserInformation;

                if (answers.tools.length > 0) {
                    userInformation = <UserInformation>await getUserInformation();
                }

                resolve({ tools, userInformation });
            }).catch(e => {
                reject(e);
            });
        });
};

/**
 * Ask the user to give some information how the proxy should be configured.
 */
const getUserInformation = () => {
    const questions = [
        {
            type: 'autocomplete',
            name: 'host',
            message: 'Proxy host:',
            validate: inputValidation,
            source: searchHosts,
            suggestOnly: true,
            pageSize: 4,
        },
        {
            type: 'autocomplete',
            name: 'port',
            message: 'Proxy port:',
            validate: inputValidation,
            source: searchPorts,
            suggestOnly: true,
            pageSize: 4,
        },
        {
            type: 'input',
            name: 'username',
            message: 'Username:',
        },
        {
            type: 'password',
            message: 'Password:',
            name: 'password',
        }];
    return inquirer.prompt(questions);
};

/**
 * Validates user input.
 */
const inputValidation = (value: string) => {
    if (value.trim().length > 0) {
        return true;
    }

    return 'This field must not be empty!';
};

const searchHosts = (answersSoFar, input: string) => {
    input = input || '';
    return new Promise(async (resolve, reject) => {
        const knownHosts: Host[] = await getKnownHosts();
        const proposals = fuzzy.filter(input, knownHosts.map(h => h.name)).map(el => el.string);
        resolve(proposals);
    });
};

const searchPorts = (answersSoFar: { host: string }, input: string) => {
    input = input || '';
    return new Promise(async (resolve, reject) => {
        const knownHosts: Host[] = await getKnownHosts();
        const currentHost = knownHosts.find(h => h.name === answersSoFar.host);
        const proposals = fuzzy.filter(input, currentHost ? [currentHost.port] : []).map(el => el.string);
        resolve(proposals);
    });
};
