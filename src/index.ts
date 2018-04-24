import { storeProxyHost } from './store';
import { toggletoolsProxy } from './tools';
import { initUserInteraction } from './userinput';

class ProxySetup {
    public static async init() {
        console.log('\n-----------------------\n|   PROXY SETUP CLI   |\n-----------------------\n');

        try {
            const { tools, userInformation } = await initUserInteraction();
            console.log('\n');
            await toggletoolsProxy(tools, userInformation);

            if (userInformation) {
                await storeProxyHost({ name: userInformation.host, port: userInformation.port });
            }
        } catch (err) {
            console.error(err);
        }

        this.stopBeforeExit();
    }

    private static stopBeforeExit() {
        console.log('\nPress any key to exit...');

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    }
}

ProxySetup.init();
