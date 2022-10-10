import { Grid, Link } from "@geist-ui/core";
import { FC } from "react";

export const PageFooter: FC = () => {
  return (
    <Grid.Container justify="center">
      <Grid>
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
  );
};
