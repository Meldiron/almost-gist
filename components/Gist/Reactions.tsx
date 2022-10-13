import { Button, Grid, Loading, Note } from "@geist-ui/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import { FC, useEffect, useState } from "react";
import {
  AppwriteClient,
  AppwriteService,
  Reaction,
} from "../../services/appwrite";
import { GistReaction } from "./Reaction";

export const GistReactions: FC<{
  resourceType: "gists" | "comments";
  resourceId: string;
  reactions: number[];
}> = ({ reactions, resourceType, resourceId }) => {
  const account = useQuery<Models.Account<any> | null>(
    ["account"],
    async () => await AppwriteService.getAccount()
  );
  const myReactions = useQuery(
    [
      `myReactions_${resourceType}_${resourceId}`,
      account,
      resourceType,
      resourceId,
    ],
    async () => {
      return await AppwriteService.getMyReactions(
        resourceType,
        resourceId,
        account.data?.$id ?? "unknown"
      );
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    AppwriteClient.subscribe<Reaction>(
      "databases.prod.collections.reactions.documents",
      (payload) => {
        if (
          payload.payload.resourceId === resourceId &&
          payload.payload.resourceType === resourceType
        ) {
          queryClient.invalidateQueries([
            `myReactions_${resourceType}_${resourceId}`,
          ]);
        }
      }
    );
  }, []);

  if (myReactions.isLoading) {
    return <Loading>Loading reactions</Loading>;
  }

  if (myReactions.isError) {
    return (
      <Note type="error">
        Problem occured during the load: {(myReactions.error as any).message}
      </Note>
    );
  }

  const buttons = ["👍", "👎", "🚀", "💝", "👀", "🎉"];

  return (
    <Grid.Container gap={1}>
      {buttons.map((icon, i) => {
        const doc = (myReactions.data?.documents || []).find(
          (d) => d.reactionIndex === i
        );

        return (
          <GistReaction
            key={icon}
            resourceId={resourceId}
            resourceType={resourceType}
            reactionsCount={reactions[i] ?? 0}
            reactionIndex={i}
            icon={icon}
            isReacted={doc ? true : false}
          ></GistReaction>
        );
      })}
    </Grid.Container>
  );
};
