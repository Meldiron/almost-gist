import type { NextPage } from "next";
import { GistDetail } from "../components/Gist/Detail";

import { GetServerSideProps } from "next";
import { AppwriteService, Comment, Gist } from "../services/appwrite";
import { Note } from "@geist-ui/core";
import { Models } from "appwrite";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [gist, comments] = await Promise.all([
    AppwriteService.getGist("homepage"),
    AppwriteService.getComments("homepage"),
  ]);

  return {
    props: {
      gist,
      comments: comments,
    },
  };
};

const Home: NextPage<{
  gist: Gist | null;
  comments: Models.DocumentList<Comment> | null;
}> = ({ gist, comments }) => {
  if (gist === null || comments === null) {
    return <Note type="warning">Gist could not be loaded.</Note>;
  }

  return <GistDetail gist={gist} comments={comments} />;
};

export default Home;
