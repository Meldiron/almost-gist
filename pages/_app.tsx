import type { AppProps } from "next/app";
import {
  GeistProvider,
  CssBaseline,
  Page,
  Grid,
  Text,
  Image,
  Button,
  Link,
} from "@geist-ui/core";
import { useEffect, useState } from "react";
import { Github, Moon, Sun } from "@geist-ui/icons";

function MyApp({ Component, pageProps }: AppProps) {
  const [themeType, setThemeType] = useState("dark");

  useEffect(() => {
    if (localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "dark");
    }

    setThemeType(localStorage.getItem("theme") ?? "dark");
  });

  function setTheme(theme: string) {
    setThemeType(theme);
    localStorage.setItem("theme", theme);
  }

  const themeButton =
    themeType === "dark" ? (
      <Button
        onClick={() => setTheme("light")}
        iconRight={<Sun />}
        auto
        px={0.6}
      />
    ) : (
      <Button
        onClick={() => setTheme("dark")}
        iconRight={<Moon />}
        auto
        px={0.6}
      />
    );

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />

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
          <Grid.Container alignItems="center" gap={1} justify="space-between">
            <Grid sm>
              <Grid.Container alignItems="center" gap={1}>
                <Grid>
                  <Image
                    alt="Logo"
                    height="40px"
                    src="/logo.svg"
                    width="40px"
                  />
                </Grid>
                <Grid>
                  <Text h4 type="default" style={{ margin: "0" }}>
                    Almost Gist
                  </Text>
                </Grid>
              </Grid.Container>
            </Grid>
            <Grid>
              <Grid.Container alignItems="center" gap={1}>
                <Grid>
                  <Button icon={<Github />} auto type="success">
                    Login with GitHub
                  </Button>
                </Grid>
                <Grid>{themeButton}</Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
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
    </GeistProvider>
  );
}

export default MyApp;
