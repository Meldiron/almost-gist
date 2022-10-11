import { Button, Grid } from "@geist-ui/core";
import { FC, useState } from "react";
import { AppwriteService } from "../../services/appwrite";

export const GistReactions: FC<{
  resourceType: "gists" | "comments";
  resourceId: string;
  reactions: number[];
}> = ({ reactions, resourceType, resourceId }) => {
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

  // TODO: type="secondary" and ghost if already reacted

  return (
    <Grid.Container gap={1}>
      <Grid>
        <Button
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
