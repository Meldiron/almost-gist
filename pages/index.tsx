import type { NextPage } from "next";
import {
  Divider,
  Card,
  Code,
  Grid,
  Button,
  Text,
  Link,
  Textarea,
} from "@geist-ui/core";
import { marked } from "marked";
import { useState } from "react";

marked.use({
  sanitize: true,
});

const Home: NextPage = () => {
  const [value, setValue] = useState();

  const handler = (e: any) => {
    setValue(e.target.value);
  };

  function handleSubmit(e: any) {
    e.preventDefault();
  }

  const markdown = `# Welcome 👋
Hope you are doing well! This is example

### Subsub title

And a:
- list
- list2

---

my \`code\`:

\`\`\`
console.log("Works!");
\`\`\`

> Hey`;

  const html = marked.parse(markdown);

  return (
    <Grid.Container gap={2} style={{ marginBottom: "1rem" }}>
      <Grid xs={24}>
        <Card width="100%">
          <Grid.Container gap={1}>
            <Grid>
              <Button icon={<p>👍</p>} auto>
                12
              </Button>
            </Grid>

            <Grid>
              <Button icon={<p>👎</p>} auto>
                0
              </Button>
            </Grid>

            <Grid>
              <Button type="secondary" ghost icon={<p>🚀</p>} auto>
                0
              </Button>
            </Grid>

            <Grid>
              <Button type="secondary" ghost icon={<p>💝</p>} auto>
                4
              </Button>
            </Grid>

            <Grid>
              <Button icon={<p>👀</p>} auto>
                2
              </Button>
            </Grid>

            <Grid>
              <Button icon={<p>🎉</p>} auto>
                441
              </Button>
            </Grid>
          </Grid.Container>
        </Card>
      </Grid>
      <Grid xs={24}>
        <Card width="100%">
          <Card.Content>
            <Code>README.md</Code>
          </Card.Content>
          <Divider h="1px" my={0} />
          <Card.Content>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Card.Content>
        </Card>
      </Grid>

      <Grid xs={24}>
        <div style={{ width: "100%", padding: "1rem 0" }}>
          <Divider>3 Comments</Divider>
        </div>
      </Grid>

      <Grid xs={24}>
        <Card width="100%">
          <Text>
            This is <code>cool()</code>!
          </Text>
          <Card.Footer>
            <Grid.Container gap={1}>
              <Grid>
                <Button icon={<p>👍</p>} auto>
                  12
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>👎</p>} auto>
                  0
                </Button>
              </Grid>

              <Grid>
                <Button type="secondary" ghost icon={<p>🚀</p>} auto>
                  0
                </Button>
              </Grid>

              <Grid>
                <Button type="secondary" ghost icon={<p>💝</p>} auto>
                  4
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>👀</p>} auto>
                  2
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>🎉</p>} auto>
                  441
                </Button>
              </Grid>
            </Grid.Container>
          </Card.Footer>
        </Card>
      </Grid>

      <Grid xs={24}>
        <Card width="100%">
          <Text>
            This is <code>cool()</code>!
          </Text>
          <Card.Footer>
            <Grid.Container gap={1}>
              <Grid>
                <Button icon={<p>👍</p>} auto>
                  12
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>👎</p>} auto>
                  0
                </Button>
              </Grid>

              <Grid>
                <Button type="secondary" ghost icon={<p>🚀</p>} auto>
                  0
                </Button>
              </Grid>

              <Grid>
                <Button type="secondary" ghost icon={<p>💝</p>} auto>
                  4
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>👀</p>} auto>
                  2
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>🎉</p>} auto>
                  441
                </Button>
              </Grid>
            </Grid.Container>
          </Card.Footer>
        </Card>
      </Grid>

      <Grid xs={24}>
        <Card width="100%">
          <Text>
            This is <code>cool()</code>!
          </Text>
          <Card.Footer>
            <Grid.Container gap={1}>
              <Grid>
                <Button icon={<p>👍</p>} auto>
                  12
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>👎</p>} auto>
                  0
                </Button>
              </Grid>

              <Grid>
                <Button type="secondary" ghost icon={<p>🚀</p>} auto>
                  0
                </Button>
              </Grid>

              <Grid>
                <Button type="secondary" ghost icon={<p>💝</p>} auto>
                  4
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>👀</p>} auto>
                  2
                </Button>
              </Grid>

              <Grid>
                <Button icon={<p>🎉</p>} auto>
                  441
                </Button>
              </Grid>
            </Grid.Container>
          </Card.Footer>
        </Card>
      </Grid>
      <Grid xs={24}>
        <Card width="100%">
          <form onSubmit={handleSubmit}>
            <Grid.Container gap={1}>
              <Grid xs={24}>
                <Text h4 my={0}>
                  Write a Comment!
                </Text>
              </Grid>

              <Grid xs={24}>
                <Textarea
                  required={true}
                  width="100%"
                  rows={4}
                  value={value}
                  onChange={handler}
                  placeholder="Leave a comment on this page."
                />
              </Grid>

              <Grid xs={24}>
                <Button htmlType="submit" type="success">
                  Submit
                </Button>
              </Grid>
            </Grid.Container>
          </form>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

export default Home;
