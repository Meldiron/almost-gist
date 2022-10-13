import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GistDetail } from "../../components/Gist/Detail";

const Home: NextPage = () => {
  const router = useRouter();
  const { gistId } = router.query;

  return <GistDetail gistId={gistId?.toString() ?? "unknown"} />;
};

export default Home;
