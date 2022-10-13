import { Button, Grid, Loading, Note } from "@geist-ui/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import { FC, useEffect, useState } from "react";
import {
  AppwriteClient,
  AppwriteService,
  Reaction,
} from "../../services/appwrite";

export const GistReaction: FC<{
  resourceType: "gists" | "comments";
  resourceId: string;

  reactionIndex: number;
  icon: string;
  reactionsCount: number;
  isReacted: boolean;
}> = ({
  reactionsCount,
  resourceType,
  resourceId,
  reactionIndex,
  icon,
  isReacted,
}) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  function onReactionClick() {
    async function toggleReaction() {
      setIsSubmitting(true);
      await AppwriteService.toggleReaction(
        resourceType,
        resourceId,
        reactionIndex
      );
      setIsSubmitting(false);
    }

    toggleReaction();
  }

  return (
    <Grid key={reactionIndex}>
      <Button
        type={isReacted ? "secondary" : "default"}
        ghost={isReacted}
        onClick={onReactionClick}
        onMouseDown={(e) => e.preventDefault()}
        loading={isSubmitting}
        icon={<p>{icon}</p>}
        auto
      >
        {reactionsCount}
      </Button>
    </Grid>
  );
};
