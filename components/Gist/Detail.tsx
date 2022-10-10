import {
  Button,
  Card,
  Code,
  Divider,
  Grid,
  Note,
  Tabs,
  Text,
  Textarea,
} from "@geist-ui/core";
import parse from "html-react-parser";

import { FC, useContext, useState } from "react";
import { GistReactions } from "./Reactions";
import { marked } from "marked";
import { AppwriteService, Comment, Gist } from "../../services/appwrite";
import { Models } from "appwrite";
import AccountContext from "../../contexts/account";

export const GistDetail: FC<{
  gist: Gist;
  comments: Models.DocumentList<Comment>;
}> = ({ gist, comments }) => {
  const [commentValue, setCommentValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, _setAccount] = useContext(AccountContext);

  const onCommentValueChange = (e: any) => {
    setCommentValue(e.target.value);
  };

  function handleSubmit(e: any) {
    e.preventDefault();

    async function onSubmit() {
      setIsSubmitting(true);
      const res = await AppwriteService.createComment(gist.$id, commentValue);
      setIsSubmitting(false);

      if (res) {
        setCommentValue("");
      }
    }

    onSubmit();
  }

  const commentForm =
    account !== null ? (
      <Grid xs={24}>
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
      </Grid>
    ) : (
      <Grid xs={24}>
        <Grid.Container justify="center">
          <Grid>
            <Note type="success">Sign in to write a comment.</Note>
          </Grid>
        </Grid.Container>
      </Grid>
    );

  return (
    <Grid.Container gap={2} style={{ marginBottom: "1rem" }}>
      <Grid xs={24}>
        <Card width="100%">
          <GistReactions reactions={gist.reactions ?? []} />
        </Card>
      </Grid>
      <Grid xs={24}>
        <Card width="100%">
          <Card.Content>
            <Code>{gist.name}</Code>
          </Card.Content>
          <Divider h="1px" my={0} />
          <Card.Content>{parse(marked.parse(gist.content))}</Card.Content>
        </Card>
      </Grid>

      <Grid xs={24}>
        <div style={{ width: "100%", padding: "1rem 0" }}>
          <Divider>
            {comments.total} {comments.total === 1 ? "Comment" : "Comments"}
          </Divider>
        </div>
      </Grid>

      {comments.documents.map((comment) => {
        return (
          <Grid key={comment.$id} xs={24}>
            <Card width="100%">
              <div>{parse(marked.parse(comment.content))}</div>
              <Card.Footer>
                <GistReactions reactions={gist.reactions ?? []} />
              </Card.Footer>
            </Card>
          </Grid>
        );
      })}

      {commentForm}
    </Grid.Container>
  );
};
