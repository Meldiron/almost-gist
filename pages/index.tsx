import type { NextPage } from "next";
import { GistDetail } from "../components/Gist/Detail";

import { GetServerSideProps } from "next";
import {
  AppwriteClient,
  AppwriteService,
  Comment,
  Gist,
} from "../services/appwrite";
import { Note } from "@geist-ui/core";
import { Models } from "appwrite";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [gist, comments] = await Promise.all([
    AppwriteService.getGist("homepage"),
    AppwriteService.getComments("homepage"),
  ]);

  return {
    props: {
      gist,
      comments: comments,
    },
  };
};

const Home: NextPage<{
  gist: Gist | null;
  comments: Models.DocumentList<Comment> | null;
}> = ({ gist, comments }) => {
  const [realtimeGist, setRealtimeGist] = useState(gist);
  const [realtimeComments, setRealtimeComments] = useState(comments);

  const subscriptions: (() => void)[] = [];

  useEffect(() => {
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
          setRealtimeComments({
            ...realtimeComments,
            total: (realtimeComments?.total ?? 0) + 1,
            documents: [
              payload.payload,
              ...(realtimeComments?.documents ?? []),
            ],
          });
        }
      )
    );

    return () => {
      for (const unsub of subscriptions) {
        unsub();
      }
    };
  });

  if (realtimeGist === null || realtimeComments === null) {
    return <Note type="warning">Gist could not be loaded.</Note>;
  }

  return <GistDetail gist={realtimeGist} comments={realtimeComments} />;
};

export default Home;
