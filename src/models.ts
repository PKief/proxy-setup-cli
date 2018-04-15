/**
 * Information that is required from the user.
 */
export interface UserInformation {
    host: string;
    port: string;
    username: string;
    password: string;
}

/**
 * Software tool that uses a proxy.
 */
export interface Tool {
    name: string;
    enableProxy: boolean;
}

export interface Host {
    name: string;
    port: string;
}
