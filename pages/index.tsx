import type { NextPage } from "next";
import { GistDetail } from "../components/Gist/Detail";

const Home: NextPage = () => {
  return <GistDetail gistId="homepage" />;
};

export default Home;
