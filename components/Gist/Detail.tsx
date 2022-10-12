import {
  Button,
  Card,
  Code,
  Divider,
  Grid,
  Loading,
  Note,
  Tabs,
  Text,
  Textarea,
} from "@geist-ui/core";
import parse from "html-react-parser";

import { FC, useEffect } from "react";
import { GistReactions } from "./Reactions";
import { marked } from "marked";
import { AppwriteClient, AppwriteService, Gist } from "../../services/appwrite";
import { GistComments } from "./Comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const GistDetail: FC<{
  gistId: string;
}> = ({ gistId }) => {
  const queryClient = useQueryClient();

  const gist = useQuery(
    ["gist"],
    async () => await AppwriteService.getGist(gistId)
  );

  // TODO: Unsub if needed?
  useEffect(() => {
    AppwriteClient.subscribe<Gist>(
      "databases.prod.collections.gists.documents." + gist.data?.$id ??
        "unknown",
      (payload) => {
        if (payload.payload.$id === gistId) {
          queryClient.invalidateQueries(["gist"]);
        }
      }
    );
  }, [gist]);

  if (gist.isLoading) {
    return <Loading>Loading gist</Loading>;
  }

  if (gist.isError) {
    return (
      <Note type="error">
        Problem occured during the load: {(gist.error as any).message}
      </Note>
    );
  }

  if (gist.data === null) {
    return <Note type="warning">Gist could not be found.</Note>;
  }

  return (
    <Grid.Container gap={2} style={{ marginBottom: "1rem" }}>
      <Grid xs={24}>
        <Card width="100%">
          <Card.Content>
            <Code>{gist.data.name}</Code>
          </Card.Content>
          <Divider h="1px" my={0} />
          <Card.Content>{parse(marked.parse(gist.data.content))}</Card.Content>
        </Card>
      </Grid>

      <Grid xs={24}>
        <Card width="100%">
          <GistReactions
            resourceId={gist.data.$id}
            resourceType="gists"
            reactions={gist.data.reactions ?? []}
          />
        </Card>
      </Grid>

      <Grid xs={24}>
        <GistComments gistId={gist.data.$id} />
      </Grid>
    </Grid.Container>
  );
};
