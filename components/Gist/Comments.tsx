import { Card, Divider, Grid, Loading, Note } from "@geist-ui/core";
import parse from "html-react-parser";

import { FC, useEffect } from "react";
import { marked } from "marked";
import {
  AppwriteClient,
  AppwriteService,
  Comment,
} from "../../services/appwrite";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GistReactions } from "./Reactions";
import { GistNewComment } from "./NewComment";

export const GistComments: FC<{
  gistId: string;
}> = ({ gistId }) => {
  const comments = useQuery(
    ["comments"],
    async () => await AppwriteService.getComments(gistId)
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    AppwriteClient.subscribe<Comment>(
      "databases.prod.collections.comments.documents",
      (payload) => {
        if (payload.payload.gistId === gistId) {
          queryClient.invalidateQueries(["comments"]);
        }
      }
    );
  }, []);

  if (comments.isLoading) {
    return <Loading>Loading comments</Loading>;
  }

  if (comments.isError) {
    return (
      <Note width="100%" type="error">
        Problem occured during the load: {(comments.error as any).message}
      </Note>
    );
  }

  if (comments.data === null) {
    return (
      <Note width="100%" type="warning">
        Comments could not be found.
      </Note>
    );
  }

  return (
    <Grid.Container gap={2} style={{ marginBottom: "1rem" }}>
      <Grid xs={24}>
        <div style={{ width: "100%", padding: "1rem 0" }}>
          <Divider>
            {comments.data.total >= 5000 ? "5000+" : comments.data.total}{" "}
            {comments.data.total === 1 ? "Comment" : "Comments"}
          </Divider>
        </div>
      </Grid>

      {comments.data.documents.map((comment) => {
        return (
          <Grid key={comment.$id} xs={24}>
            <Card width="100%">
              <div>{parse(marked.parse(comment.content))}</div>
              <Card.Footer>
                <GistReactions
                  resourceId={comment.$id}
                  resourceType="comments"
                  reactions={comment.reactions ?? []}
                />
              </Card.Footer>
            </Card>
          </Grid>
        );
      })}

      <Grid xs={24}>
        <GistNewComment gistId={gistId} />
      </Grid>
    </Grid.Container>
  );
};
