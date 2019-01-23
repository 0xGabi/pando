import React, { useState } from 'react'
import styled from 'styled-components'
import { EmptyStateCard, IconHome, Text } from '@aragon/ui'
import Browser from '../components/Browser'

import data from '../data'

const Container = styled.div`
  margin: 0 auto;
  padding: 2rem;
  max-width: 980px;
  width: 100%;
`

const ActiveText = styled.span`
  font-weight: 500;
`

const LinkBold = styled(ActiveText)`
  color: #0366d6;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const Link = styled.span`
  color: #0366d6;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const Seperator = styled.span`
  color: #586069;
  margin: 0 0.25rem;
`

const Message = styled.div`
  margin-bottom: 10px;
`

export default class Organism extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    nav: [{ depth: 1, parent: '' }],
  }

  render() {
    const { organism } = this.props
    const { nav } = this.state

    let browser

    const content = nav.map((item, idx) => {
      if (nav.length < 2) {
        return (
          <Message>
            <Text size="xxlarge" key={idx}>
              {organism.message}
            </Text>
          </Message>
        )
      } else {
        if (idx === 0) {
          return (
            <LinkBold key={idx} onClick={() => setState([state[0]])}>
              {organism.address}
            </LinkBold>
          )
        }
        if (nav.length - 1 === idx) {
          return (
            <span>
              <Seperator key={idx}>/</Seperator>
              <ActiveText key={idx}>{item.parent}</ActiveText>
            </span>
          )
        }
        return (
          <span>
            <Seperator>/</Seperator>
            <Link onClick={() => setState(state.splice(0, nave.length - idx))}>{item.parent}</Link>
          </span>
        )
      }
    })

    if (typeof organism.tree === 'undefined') {
      browser = <EmptyStateCard text="No individuation yet" icon={() => <IconHome color="blue" />} />
    } else {
      browser = <Browser tree={organism.tree} />
    }
    return (
      <Container>
        {content}
        {browser}
      </Container>
    )
  }
}
