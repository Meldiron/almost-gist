import { Button, Grid, Loading, Note } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import { FC, useState } from "react";
import { AppwriteService, Reaction } from "../../services/appwrite";

export const GistReactions: FC<{
  resourceType: "gists" | "comments";
  resourceId: string;
  reactions: number[];
}> = ({ reactions, resourceType, resourceId }) => {
  const account = useQuery<Models.Account<any> | null>(["account"]);

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  function onReactionClick(reactionIndex: number) {
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
          <Grid key={i}>
            <Button
              type={doc ? "secondary" : "default"}
              ghost={doc ? true : false}
              onClick={() => onReactionClick(i)}
              loading={isSubmitting}
              icon={<p>{icon}</p>}
              auto
            >
              {reactions[i] ?? 0}
            </Button>
          </Grid>
        );
      })}
    </Grid.Container>
  );
};
