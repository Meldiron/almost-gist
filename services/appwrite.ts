import { Client, Account, Databases, Models, Query, ID, Functions, AppwriteException } from 'appwrite';

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

export type Reaction = {
    userId: string;
    reactionIndex: number;
    resourceId: string;
    resourceType: 'comments' | 'gists';
} & Models.Document;

const endpoint = 'https://appwrite.almost-gist.matejbaco.eu/v1';

export const AppwriteClient = new Client()
    .setEndpoint(endpoint)
    .setProject('almostGist');

const account = new Account(AppwriteClient);
const database = new Databases(AppwriteClient);
const functions = new Functions(AppwriteClient);

export const AppwriteService = {
    signIn: () => {
        const redirectUrl = window.location.href;
        account.createOAuth2Session("github", redirectUrl);
    },
    getAccount: async () => {
        try {
            return await account.get<any>();
        } catch (err) {
            return null;
        }
    },
    getGist: async (gistId: string) => {
        try {
            return await database.getDocument<Gist>("prod", "gists", gistId);
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getComments: async (gistId: string) => {
        try {
            return await database.listDocuments<Comment>("prod", "comments", [
                Query.equal("gistId", gistId),
                Query.orderDesc("$createdAt"),
                Query.limit(100)
            ]);
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getMyGists: async (userId: string) => {
        try {
            return await database.listDocuments<Gist>("prod", "gists", [
                Query.equal("createdBy", userId),
                Query.orderDesc("$createdAt"),
                Query.limit(100)
            ]);
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getMyReactions: async (resourceType: 'gists' | 'comments', resourceId: string, userId: string) => {
        try {
            return await database.listDocuments<Reaction>("prod", "reactions", [
                Query.equal("resourceType", resourceType),
                Query.equal("resourceId", resourceId),
                Query.equal("userId", userId),
                Query.limit(6) // max amount of emojis
            ]);
        } catch (err) {
            return null;
        }
    },

    signOut: async () => {
        return await account.deleteSession('current');
    },
    createComment: async (gistId: string, content: string) => {
        try {
            return await database.createDocument<Comment>("prod", "comments", ID.unique(), {
                gistId,
                content
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    createGist: async (name: string, content: string) => {
        return await database.createDocument<Gist>("prod", "gists", ID.unique(), {
            name, content
        });
    },
    toggleReaction: async (resourceType: 'gists' | 'comments', resourceId: string, reactionIndex: number) => {
        const execution = await functions.createExecution("toggleReaction", JSON.stringify({
            resourceType,
            resourceId,
            reactionIndex
        }));

        if (execution.response) {
            const response = JSON.parse(execution.response);

            if (!response.success) {
                throw new AppwriteException(response.message);
            }

            return response;
        } else {
            console.log(execution);
            throw new AppwriteException("Could not execute function.");
        }
    }
}