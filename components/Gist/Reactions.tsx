import { Button, Grid } from "@geist-ui/core";
import { FC, useState } from "react";
import { AppwriteService } from "../../services/appwrite";

export const GistReactions: FC<{
  resourceType: "gists" | "comments";
  resourceId: string;
  reactions: number[];
  myReactions: boolean[];
}> = ({ reactions, resourceType, resourceId, myReactions }) => {
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

  return (
    <Grid.Container gap={1}>
      <Grid>
        <Button
          type={myReactions[0] ? "secondary" : "default"}
          ghost={myReactions[0]}
          onClick={() => onReactionClick(0)}
          loading={isSubmitting}
          icon={<p>👍</p>}
          auto
        >
          {reactions[0] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button
          type={myReactions[1] ? "secondary" : "default"}
          ghost={myReactions[1]}
          onClick={() => onReactionClick(1)}
          loading={isSubmitting}
          icon={<p>👎</p>}
          auto
        >
          {reactions[1] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button
          type={myReactions[2] ? "secondary" : "default"}
          ghost={myReactions[2]}
          onClick={() => onReactionClick(2)}
          loading={isSubmitting}
          icon={<p>🚀</p>}
          auto
        >
          {reactions[2] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button
          type={myReactions[3] ? "secondary" : "default"}
          ghost={myReactions[3]}
          onClick={() => onReactionClick(3)}
          loading={isSubmitting}
          icon={<p>💝</p>}
          auto
        >
          {reactions[3] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button
          type={myReactions[4] ? "secondary" : "default"}
          ghost={myReactions[4]}
          onClick={() => onReactionClick(4)}
          loading={isSubmitting}
          icon={<p>👀</p>}
          auto
        >
          {reactions[4] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button
          type={myReactions[5] ? "secondary" : "default"}
          ghost={myReactions[5]}
          onClick={() => onReactionClick(5)}
          loading={isSubmitting}
          icon={<p>🎉</p>}
          auto
        >
          {reactions[5] ?? 0}
        </Button>
      </Grid>
    </Grid.Container>
  );
};
