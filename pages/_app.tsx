import type { AppProps } from "next/app";
import { Page } from "@geist-ui/core";
import { PageHeader } from "../components/Page/Header";
import { ThemeProvider } from "../contexts/theme";
import Head from "next/head";
import { PageFooter } from "../components/Page/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Head>
          <title>Almost Gist</title>
          <meta
            name="description"
            content="Share your markdowns files with anyone."
          />

          <meta property="og:url" content="https://gist.almostapps.eu/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Almost Gist" />
          <meta
            property="og:description"
            content="Share your markdowns files with anyone."
          />
          <meta
            property="og:image"
            content="https://gist.almostapps.eu/cover.png"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="gist.almostapps.eu" />
          <meta
            property="twitter:url"
            content="https://gist.almostapps.eu/"
          />
          <meta name="twitter:title" content="Almost Gist" />
          <meta
            name="twitter:description"
            content="Share your markdowns files with anyone."
          />
          <meta
            name="twitter:image"
            content="https://gist.almostapps.eu/cover.png"
          />
        </Head>
        <Page
          style={{
            paddingTop: "2rem",
            marginBottom: "2rem",
            maxWidth: "1000px",
            width: "100%",
            height: "100%",
          }}
        >
          <Page.Header center>
            <PageHeader />
          </Page.Header>
          <Page.Content paddingBottom={0}>
            <Component {...pageProps} />
          </Page.Content>
          <Page.Content paddingTop={0}>
            <PageFooter />
          </Page.Content>
        </Page>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
