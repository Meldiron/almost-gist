import type { AppProps } from "next/app";
import { Page, Grid, Link } from "@geist-ui/core";
import { AccountProvider } from "../contexts/account";
import { PageHeader } from "../components/Page/Header";
import { ThemeProvider } from "../contexts/theme";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <title>Almost Gist</title>
        <meta
          name="description"
          content="Platform to share your markdowns with anyone."
        />

        <meta property="og:url" content="https://almost-gist.matejbaco.eu/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Almost Gist" />
        <meta
          property="og:description"
          content="Platform to share your markdowns with anyone."
        />
        <meta
          property="og:image"
          content="https://almost-gist.matejbaco.eu/cover.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="almost-gist.matejbaco.eu" />
        <meta
          property="twitter:url"
          content="https://almost-gist.matejbaco.eu/"
        />
        <meta name="twitter:title" content="Almost Gist" />
        <meta
          name="twitter:description"
          content="Platform to share your markdowns with anyone."
        />
        <meta
          name="twitter:image"
          content="https://almost-gist.matejbaco.eu/cover.png"
        />
      </Head>
      <AccountProvider>
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
          <Page.Content>
            <Component {...pageProps} />
          </Page.Content>
          <Page.Footer>
            <Grid.Container justify="center">
              <Grid>
                Made with 💙 and{" "}
                <Link href="https://appwrite.io/" block>
                  Appwrite
                </Link>{" "}
                by{" "}
                <Link href="https://github.com/meldiron" block>
                  Matej &quot;Meldiron&quot; Bačo
                </Link>
                .
              </Grid>
            </Grid.Container>
          </Page.Footer>
        </Page>
      </AccountProvider>
    </ThemeProvider>
  );
}

export default MyApp;
