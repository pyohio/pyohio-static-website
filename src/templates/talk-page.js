/** @jsx jsx */

import Layout from "gatsby-theme-catalyst-core/src/components/layout"
import { graphql, Link } from "gatsby"
import { jsx, Themed } from "theme-ui"

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
      <h1>{talk.title}</h1>
      <p>
        <em>{talk.type} (schedule TBD)</em>
      </p>
      <div dangerouslySetInnerHTML={{ __html: talk.description }} />
      <h2>Presented by</h2>
      <p>{speakers}</p>
    </Layout>
  )
}

export const talkPageQuery = graphql`
  query TalkPage($id: String!) {
    talksYaml(id: { eq: $id }) {
      title
      description
      type
      speakers {
        name
        slug
      }
    }
  }
`
