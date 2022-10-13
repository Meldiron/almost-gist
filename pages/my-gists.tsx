import {
  Button,
  Code,
  Fieldset,
  Grid,
  Loading,
  Note,
  useToasts,
} from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import type { NextPage } from "next";
import { AppwriteService } from "../services/appwrite";
import Link from "next/link";

const Home: NextPage = () => {
  const { setToast } = useToasts();

  const account = useQuery<Models.Account<any> | null>(
    ["account"],
    async () => await AppwriteService.getAccount()
  );

  const gists = useQuery(
    ["gists", account],
    async () => await AppwriteService.getMyGists(account.data?.$id ?? "unknown")
  );

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
        Please sign in before looking at your gists.
      </Note>
    );
  }

  if (gists.isLoading) {
    return <Loading>Loading gists</Loading>;
  }

  if (gists.isError) {
    return (
      <Note width="100%" type="error">
        Problem occured during the load: {(gists.error as any).message}
      </Note>
    );
  }

  if (gists.data === null) {
    return (
      <Note width="100%" type="warning">
        Gists could not be found.
      </Note>
    );
  }

  if (gists.data.documents.length <= 0) {
    return (
      <Note width="100%" type="success">
        You have not created any gists yet.
      </Note>
    );
  }

  return (
    <Grid.Container gap={1}>
      {gists.data.documents.map((gist) => (
        <Grid xs={24} key={gist.$id}>
          <Fieldset width="100%">
            <Fieldset.Title>
              <Code>{gist.name}</Code>
            </Fieldset.Title>
            <Fieldset.Footer>
              Created on {new Date(gist.$createdAt).toLocaleString()}
              <Link href={"/gists/" + gist.$id}>
                <Button auto scale={1 / 3} font="12px">
                  View Details
                </Button>
              </Link>
            </Fieldset.Footer>
          </Fieldset>
        </Grid>
      ))}
    </Grid.Container>
  );
};

export default Home;
