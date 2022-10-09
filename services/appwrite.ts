import { Client, Account, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://demo.appwrite.io/v1')
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