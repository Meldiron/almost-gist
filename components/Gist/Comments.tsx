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

import { FC, useEffect, useState } from "react";
import { marked } from "marked";
import { AppwriteClient, AppwriteService } from "../../services/appwrite";
import { Models } from "appwrite";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GistReactions } from "./Reactions";

export const GistComments: FC<{
  gistId: string;
}> = ({ gistId }) => {
  const account = useQuery<Models.Account<any> | null>(["account"]);
  const comments = useQuery(
    ["comments"],
    async () => await AppwriteService.getComments(gistId)
  );

  const queryClient = useQueryClient();

  const [commentValue, setCommentValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCommentValueChange = (e: any) => {
    setCommentValue(e.target.value);
  };

  function handleSubmit(e: any) {
    e.preventDefault();

    async function onSubmit() {
      setIsSubmitting(true);
      const res = await AppwriteService.createComment(gistId, commentValue);
      setIsSubmitting(false);

      if (res) {
        setCommentValue("");
      }
    }

    onSubmit();
  }

  let commentSub = () => {};
  useEffect(() => {
    commentSub();
    commentSub = AppwriteClient.subscribe<Comment>(
      "databases.prod.collections.comments.documents",
      (_payload) => {
        queryClient.invalidateQueries(["comments"]);
      }
    );
  }, [comments]);

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

  // TODO: component for commeitng, warning that you must sign in before commenting

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
      <Card width="100%">
        <form onSubmit={handleSubmit}>
          <Grid.Container gap={2}>
            <Grid xs={24}>
              <Text h4 my={0}>
                Write a Comment!
              </Text>
            </Grid>

            <Grid xs={24}>
              <Tabs hideDivider initialValue="1" width={"100%"}>
                <Tabs.Item label="Edit" value="1">
                  <Textarea
                    required={true}
                    width="100%"
                    rows={4}
                    value={commentValue}
                    onChange={onCommentValueChange}
                    placeholder="Leave a comment on this page."
                  />
                </Tabs.Item>
                <Tabs.Item label="Preview" value="2">
                  {parse(marked.parse(commentValue))}
                </Tabs.Item>
              </Tabs>
            </Grid>

            <Grid xs={24}>
              <Button loading={isSubmitting} htmlType="submit" type="success">
                Submit
              </Button>
            </Grid>
          </Grid.Container>
        </form>
      </Card>
    </Grid.Container>
  );
};
