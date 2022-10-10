import {
  Button,
  Card,
  Code,
  Divider,
  Grid,
  Note,
  Text,
  Textarea,
} from "@geist-ui/core";
import parse from "html-react-parser";

import { FC, useContext, useState } from "react";
import { GistReactions } from "./Reactions";
import { marked } from "marked";
import { Comment, Gist } from "../../services/appwrite";
import { Models } from "appwrite";
import AccountContext from "../../contexts/account";

marked.use({
  sanitize: true,
});

export const GistDetail: FC<{
  gist: Gist;
  comments: Models.DocumentList<Comment>;
}> = ({ gist, comments }) => {
  const [value, setValue] = useState();
  const [account, _setAccount] = useContext(AccountContext);

  const handler = (e: any) => {
    setValue(e.target.value);
  };

  function handleSubmit(e: any) {
    e.preventDefault();
  }

  const commentForm =
    account !== null ? (
      <Grid xs={24}>
        <Card width="100%">
          <form onSubmit={handleSubmit}>
            <Grid.Container gap={1}>
              <Grid xs={24}>
                <Text h4 my={0}>
                  Write a Comment!
                </Text>
              </Grid>

              <Grid xs={24}>
                <Textarea
                  required={true}
                  width="100%"
                  rows={4}
                  value={value}
                  onChange={handler}
                  placeholder="Leave a comment on this page."
                />
              </Grid>

              <Grid xs={24}>
                <Button htmlType="submit" type="success">
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
          <Grid xs={24}>
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
