import { Client, Account, ID } from 'appwrite';

const endpoint = 'https://demo.appwrite.io/v1';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject('almostGist');

const account = new Account(client);

export const AppwriteService = {
    signIn: () => {
        const redirectUrl = window.location.href;
        account.createOAuth2Session("github", redirectUrl);
    },
    getAccount: async () => {
        try {
            return await account.get();
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    signOut: async () => {
        try {
            return await account.deleteSession('current');
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}