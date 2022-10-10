import { Button, Grid } from "@geist-ui/core";
import { FC } from "react";

export const GistReactions: FC<{ reactions: number[] }> = ({ reactions }) => {
  return (
    <Grid.Container gap={1}>
      <Grid>
        <Button icon={<p>👍</p>} auto>
          {reactions[0] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button icon={<p>👎</p>} auto>
          {reactions[1] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button type="secondary" ghost icon={<p>🚀</p>} auto>
          {reactions[2] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button icon={<p>💝</p>} auto>
          {reactions[3] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button icon={<p>👀</p>} auto>
          {reactions[4] ?? 0}
        </Button>
      </Grid>

      <Grid>
        <Button icon={<p>🎉</p>} auto>
          {reactions[5] ?? 0}
        </Button>
      </Grid>
    </Grid.Container>
  );
};
