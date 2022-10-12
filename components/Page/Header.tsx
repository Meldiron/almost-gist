import { Grid, Text, Image, Button } from "@geist-ui/core";
import { Github, Moon, Sun } from "@geist-ui/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import { FC, useContext, useState } from "react";
import ThemeContext from "../../contexts/theme";
import { AppwriteService } from "../../services/appwrite";

export const PageHeader: FC = () => {
  const account = useQuery<Models.Account<any> | null>(
    ["account"],
    async () => await AppwriteService.getAccount()
  );

  const [theme, setTheme] = useContext(ThemeContext);

  const queryClient = useQueryClient();

  const themeButton = theme ? (
    <Button
      onClick={() => {
        setTheme(false);
      }}
      iconRight={<Sun />}
      auto
      px={0.6}
    />
  ) : (
    <Button
      onClick={() => {
        setTheme(true);
      }}
      iconRight={<Moon />}
      auto
      px={0.6}
    />
  );

  const authButton =
    account.data === null ? (
      <Button
        loading={false}
        onClick={() => {
          AppwriteService.signIn();
        }}
        icon={<Github />}
        auto
        type="success"
      >
        Login with GitHub
      </Button>
    ) : (
      <Button
        loading={account.isLoading}
        onClick={async () => {
          await AppwriteService.signOut();
          queryClient.invalidateQueries(["account"]);
        }}
        auto
        type="default"
      >
        Sign Out
      </Button>
    );

  return (
    <Grid.Container alignItems="center" gap={1} justify="space-between">
      <Grid sm>
        <Grid.Container alignItems="center" gap={1}>
          <Grid>
            <Image alt="Logo" height="40px" src="/logo.svg" width="40px" />
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
          <Grid>{authButton}</Grid>
          <Grid>{themeButton}</Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
};
