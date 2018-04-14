import * as inquirer from 'inquirer';
import { printInfo } from './helpers';
import { Platform, UserInformation } from './models';
import { configureBowerProxy, configureGitProxy, configureNPMProxy, configureYarnProxy } from './platforms';

console.log('\n---------------------------\n- DEVELOPMENT PROXY SETUP -\n---------------------------\n');

const supportedplatforms = ['NPM', 'Yarn', 'Bower', 'Git', 'Maven', 'Gradle'];

const selectplatforms = () => {
    inquirer.prompt([{
        type: 'checkbox',
        name: 'platforms',
        message: 'Mark platform to enable / unmark to disable proxy settings',
        choices: supportedplatforms,
    }]).then(async (answers: { platforms: string[] }) => {
        let platforms: Platform[] = answers.platforms.map(p => ({ name: p, enabled: true }));
        const disabled: Platform[] = supportedplatforms.filter(p => answers.platforms.indexOf(p) === -1).map(p => ({ name: p, enabled: false }));
        platforms = [...platforms, ...disabled];

        let userInformation: UserInformation;

        if (answers.platforms.length > 0) {
            userInformation = <UserInformation>await getUserInformation();
        }

        try {
            await toggleplatformsProxy(platforms, userInformation);
        } catch (err) {
            console.error(err);
        }

        console.log('\nPress any key to exit...');

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    });
};

const toggleplatformsProxy = async (platforms: Platform[], userInformation: UserInformation) => {
    for (let p of platforms) {
        switch (p.name) {
            case 'NPM':
                await configureNPMProxy(p.enabled, userInformation);
                printInfo(p);
                break;

            case 'Yarn':
                await configureYarnProxy(p.enabled, userInformation);
                printInfo(p);
                break;

            case 'Git':
                await configureGitProxy(p.enabled, userInformation);
                printInfo(p);
                break;

            case 'Bower':
                await configureBowerProxy(p.enabled, userInformation);
                printInfo(p);
                break;

            default:
                console.warn(`Proxy settings for platform '${p.name}' not yet implemented!`);
                break;
        }
    }
};

const getUserInformation = () => {
    const questions: inquirer.Questions = [{
        type: 'input',
        name: 'host',
        message: 'Proxy host:',
        validate: inputValidation
    },
    {
        type: 'input',
        name: 'port',
        message: 'Proxy port:',
        validate: inputValidation
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

const inputValidation = (value: string) => {
    if (value.trim().length > 0) {
        return true;
    }

    return 'This field must not be empty!';
};

selectplatforms();
