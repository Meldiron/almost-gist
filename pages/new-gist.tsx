import {
  Button,
  Card,
  Grid,
  Input,
  Link,
  Loading,
  Note,
  Tabs,
  Text,
  Textarea,
  useToasts,
} from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import type { NextPage } from "next";
import { useState } from "react";
import { AppwriteService } from "../services/appwrite";
import parse from "html-react-parser";
import { marked } from "marked";
import { useRouter } from "next/router";
import NextLink from "next/link";

const Home: NextPage = () => {
  const { setToast } = useToasts();

  const account = useQuery<Models.Account<any> | null>(
    ["account"],
    async () => await AppwriteService.getAccount()
  );

  const router = useRouter();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: any) {
    e.preventDefault();

    async function onSubmit() {
      setIsSubmitting(true);
      try {
        const res = await AppwriteService.createGist(
          title,
          content,
          account.data?.$id ?? "unknown"
        );

        setToast({
          text: "Gist was successfully created.",
          type: "success",
        });

        router.push("/gists/" + res.$id);
      } catch (err: any) {
        setToast({
          text: err.message,
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }

    onSubmit();
  }

  if (account.isLoading) {
    return <Loading>Loading account</Loading>;
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
        Please sign in before creating a gist.
      </Note>
    );
  }

  return (
    <Grid.Container gap={1}>
      <Grid xs={24}>
        <Note type="default" filled width="100%">
          You can find your existing gists{" "}
          <NextLink href="/my-gists">
            <Link block color>
              Here
            </Link>
          </NextLink>
          .
        </Note>
      </Grid>
      <Grid xs={24}>
        <Card width="100%">
          <form onSubmit={handleSubmit}>
            <Grid.Container gap={2}>
              <Grid xs={24}>
                <Text h4 my={0}>
                  Create New Gist!
                </Text>
              </Grid>

              <Grid xs={24}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required={true}
                  placeholder="README.md"
                >
                  File Name
                </Input>
              </Grid>

              <Grid xs={24}>
                <Tabs hideDivider initialValue="1" width={"100%"}>
                  <Tabs.Item label="Edit" value="1">
                    <Textarea
                      required={true}
                      width="100%"
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Leave a comment on this page."
                    />
                  </Tabs.Item>
                  <Tabs.Item label="Preview" value="2">
                    {parse(marked.parse(content))}
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
    </Grid.Container>
  );
};

export default Home;
