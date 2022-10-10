import { Client, Account, Databases, Models, Query, ID } from 'appwrite';

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

export const AppwriteClient = new Client()
    .setEndpoint(endpoint)
    .setProject('almostGist');

const account = new Account(AppwriteClient);
const database = new Databases(AppwriteClient);

const showError = (err: any) => {
    console.error(err);
    // TODO: Open toast
}

export const AppwriteService = {
    signIn: () => {
        const redirectUrl = window.location.href;
        account.createOAuth2Session("github", redirectUrl);
    },
    getAccount: async () => {
        try {
            return await account.get();
        } catch (err) {
            return null;
        }
    },
    signOut: async () => {
        try {
            return await account.deleteSession('current');
        } catch (err) {
            showError(err);
            return null;
        }
    },
    getGist: async (gistId: string) => {
        try {
            return await database.getDocument<Gist>("prod", "gists", gistId);
        } catch (err) {
            showError(err);
            return null;
        }
    },
    getComments: async (gistId: string) => {
        try {
            return await database.listDocuments<Comment>("prod", "comments", [
                Query.equal("gistId", gistId),
                Query.orderDesc("$createdAt")
            ]);
        } catch (err) {
            showError(err);
            return null;
        }
    },
    createComment: async (gistId: string, content: string) => {
        try {
            return await database.createDocument<Comment>("prod", "comments", ID.unique(), {
                gistId,
                content
            });
        } catch (err) {
            showError(err);
            return null;
        }
    }
}