import { Button, Grid, Link } from "@geist-ui/core";
import { Star } from "@geist-ui/icons";
import { FC } from "react";

export const PageFooter: FC = () => {
  return (
    <Grid.Container justify="center" gap={2} style={{ marginTop: "1rem" }}>
      <Grid xs={24}>
        <Grid.Container justify="center">
          <Grid style={{ textAlign: "center" }}>
            Made with 💙 and{" "}
            <Link href="https://appwrite.io/" block>
              Appwrite
            </Link>{" "}
            by{" "}
            <Link href="https://github.com/meldiron" block>
              Matej &quot;Meldiron&quot; Bačo
            </Link>
            .
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid xs={24}>
        <Grid.Container justify="center">
          <Grid>
            <a
              href="https://github.com/Meldiron/almost-gist"
              target="_blank"
              rel="noreferrer"
            >
              <Button type="secondary" icon={<Star />} auto>
                Star on GitHub
              </Button>
            </a>
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
};
