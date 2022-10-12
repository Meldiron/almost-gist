import {
  Button,
  Card,
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

export const GistNewComment: FC<{
  gistId: string;
}> = ({ gistId }) => {
  const account = useQuery<Models.Account<any> | null>(
    ["account"],
    async () => await AppwriteService.getAccount()
  );

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

  if (account.isLoading) {
    return <Loading>Loading new comment</Loading>;
  }

  if (account.isError) {
    return (
      <Note width="100%" type="error">
        Problem occured during the load: {(account.error as any).message}
      </Note>
    );
  }

  if (account.data === null) {
    return (
      <Note width="100%" type="warning">
        Please sign in before writing a comment.
      </Note>
    );
  }

  return (
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
  );
};
