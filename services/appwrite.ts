import { Client, Account, Databases, Models, Query } from 'appwrite';

export type Gist = {
    name: string;
    content: string;
    reactions?: number[];
} & Models.Document;

export type Comment = {
    gistId: string;
    content: string;
    reactions?: number[];
} & Models.Document;

const endpoint = 'https://appwrite.almost-gist.matejbaco.eu/v1';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject('almostGist');

const account = new Account(client);
const database = new Databases(client);

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
    },
    getGist: async (gistId: string) => {
        try {
            return await database.getDocument<Gist>("prod", "gists", gistId);
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    getComments: async (gistId: string) => {
        try {
            return await database.listDocuments<Comment>("prod", "comments", [
                Query.equal("gistId", gistId)
            ]);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}