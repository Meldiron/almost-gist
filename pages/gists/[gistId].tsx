import { Loading } from "@geist-ui/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GistDetail } from "../../components/Gist/Detail";

const Home: NextPage = () => {
  const router = useRouter();
  const { gistId } = router.query;

  if (!gistId) {
    return <Loading>Loading route</Loading>;
  }

  return <GistDetail gistId={gistId.toString()} />;
};

export default Home;
