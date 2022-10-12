import type { NextPage } from "next";
import { GistDetail } from "../components/Gist/Detail";
import {
  AppwriteClient,
  AppwriteService,
  Comment,
  Gist,
  Reaction,
} from "../services/appwrite";
import { Note } from "@geist-ui/core";
import { useContext, useEffect, useState } from "react";
import AccountContext from "../contexts/account";
import { Models } from "appwrite";

const Home: NextPage = () => {
  const [account] = useContext(AccountContext);
  const [realtimeGist, setRealtimeGist] = useState<Gist | null>(null);
  const [realtimeComments, setRealtimeComments] =
    useState<Models.DocumentList<Comment> | null>(null);
  const [realtimeMyReactions, setRealtimeMyReactions] = useState<boolean[]>([]);

  const subscriptions: (() => void)[] = [];

  useEffect(() => {
    async function prepare() {
      const [gist, comments, reactions] = await Promise.all([
        AppwriteService.getGist("homepage"),
        AppwriteService.getComments("homepage"),
        AppwriteService.getMyReactions(
          "gists",
          "homepage",
          account?.$id ?? "unknown"
        ),
      ]);

      setRealtimeGist(gist);
      setRealtimeComments(comments);

      if (reactions) {
        const arr = [];

        for (const reaction of reactions.documents) {
          arr[reaction.reactionIndex] = true;
        }

        setRealtimeMyReactions(arr);
      }

      for (const unsub of subscriptions) {
        unsub();
      }

      // TODO: Realtime for myReactions

      subscriptions.push(
        AppwriteClient.subscribe<Gist>(
          "databases.prod.collections.gists.documents." + realtimeGist?.$id ??
            "unknown",
          (payload) => {
            setRealtimeGist(payload.payload);
          }
        )
      );

      subscriptions.push(
        AppwriteClient.subscribe<Comment>(
          "databases.prod.collections.comments.documents",
          (payload) => {
            const updateEvent = payload.events.find((e) =>
              e.endsWith("update")
            );
            const createEvent = payload.events.find((e) =>
              e.endsWith("create")
            );
            const deleteEvent = payload.events.find((e) =>
              e.endsWith("delete")
            );

            if (createEvent) {
              setRealtimeComments({
                ...realtimeComments,
                total: (realtimeComments?.total ?? 0) + 1,
                documents: [
                  payload.payload,
                  ...(realtimeComments?.documents ?? []),
                ],
              });
            } else if (deleteEvent) {
              const commentVisible = (realtimeComments?.documents ?? []).find(
                (c) => c.$id === payload.payload.$id
              );
              if (commentVisible) {
                setRealtimeComments({
                  ...realtimeComments,
                  total: (realtimeComments?.total ?? 0) - 1,
                  documents: (realtimeComments?.documents ?? []).filter(
                    (c) => c.$id !== payload.payload.$id
                  ),
                });
              }
            } else if (updateEvent) {
              const commentVisible = (realtimeComments?.documents ?? []).find(
                (c) => c.$id === payload.payload.$id
              );
              if (commentVisible) {
                setRealtimeComments({
                  ...realtimeComments,
                  total: realtimeComments?.total ?? 0,
                  documents: (realtimeComments?.documents ?? []).map((c) => {
                    if (c.$id === payload.payload.$id) {
                      return payload.payload;
                    }

                    return c;
                  }),
                });
              }
            }
          }
        )
      );
    }

    prepare();

    return () => {
      for (const unsub of subscriptions) {
        unsub();
      }
    };
  }, [account]);

  if (realtimeGist === null || realtimeComments === null) {
    return <Note type="warning">Gist not loaded yet.</Note>;
  }

  return (
    <GistDetail
      myReactions={realtimeMyReactions}
      gist={realtimeGist}
      comments={realtimeComments}
    />
  );
};

export default Home;
