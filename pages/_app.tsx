import type { AppProps } from "next/app";
import { Page, Grid, Link } from "@geist-ui/core";
import { AccountProvider } from "../contexts/account";
import { PageHeader } from "../components/Page/Header";
import { ThemeProvider } from "../contexts/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
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
                  Matej "Meldiron" Bačo
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
