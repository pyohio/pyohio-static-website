/** @jsx jsx */

import { Layout, Seo } from "gatsby-theme-catalyst-core"
import { graphql, Link } from "gatsby"
import { jsx, BaseStyles, Themed } from "theme-ui"
import { format } from "date-fns"

export default function TalkPage({ data }) {
  const talk = data.talksYaml
  const speakers = talk.speakers
    .map((s) => (
      <Themed.a as={Link} to={`/program/speakers/${s.slug}`}>
        {s.name}
      </Themed.a>
    ))
    .reduce((prev, curr) => [prev, ", ", curr])

  return (
    <Layout>
      <Seo title={`PyOhio 2021 Talk: ${talk.title}`} />
      <BaseStyles>
        <h1>{talk.title}</h1>
        <p>
          <em>
            {talk.type} at {format(new Date(talk.start_time), "hh:mma")} EDT
          </em>
        </p>
        <div dangerouslySetInnerHTML={{ __html: talk.description }} />
        {talk.type !== "Break" && (
          <div>
            <h2>Presented by</h2>
            <p>{speakers}</p>
          </div>
        )}
      </BaseStyles>
    </Layout>
  )
}

export const talkPageQuery = graphql`
  query TalkPage($id: String!) {
    talksYaml(id: { eq: $id }) {
      title
      description
      type
      start_time
      speakers {
        name
        slug
      }
    }
  }
`
