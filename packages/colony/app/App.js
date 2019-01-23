import React from 'react'
import { AragonApp, Button, Text, PublicUrl, BaseStyles, AppView, AppBar, NavigationBar, EmptyStateCard, IconHome, theme, observe } from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import OrganismScreen from './screens/Organism'

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

import emptyIcon from './assets/empty-card.svg'

const Main = styled.div`
  height: 100vh;
`
const EmptyIcon = <img src={emptyIcon} alt="" />

const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
  grid-gap: 2rem;
`

const OrganismsListCointainer = styled.div`
  width: 100%;
  max-width: 980px;
  margin: auto;
`

const OrganismTitle = styled.h2`
  color: ${theme.accent};
`
const OrganismDescription = styled.div`
  color: ${theme.textSecondary};
`

const OrganismItemContainer = styled.div`
  border-bottom: 1px solid ${theme.contentBorder};
  padding: 2em 0;
  cursor: pointer;
`

function OrganismItem(props) {
  const { organism, onClick } = props

  return (
    <OrganismItemContainer onClick={() => onClick(organism)}>
      <OrganismTitle>{organism.address}</OrganismTitle>
      <OrganismDescription>Description feature coming soon ...</OrganismDescription>
    </OrganismItemContainer>
  )
}

function OrganismsList(props) {
  const { organisms, onClick } = props
  const items = organisms.map((organism, idx) => <OrganismItem key={idx} organism={organism} onClick={onClick} />)
  return <OrganismsListCointainer>{items}</OrganismsListCointainer>
}

function OrganismsGrid(props) {
  const organisms = props.organisms
  const onActivate = props.onActivate

  const items = organisms.map((organism, idx) => {
    return (
      <EmptyStateCard
        key={idx}
        icon={IconHome}
        title={organism.address.substring(0, 7) + '...'}
        actionText="View organism"
        onActivate={() => onActivate(organism)}
      />
    )
  })

  return <ItemContainer>{items}</ItemContainer>
}

export default class App extends React.Component {
  static defaultProps = {
    account: '',
    organisms: [],
  }

  state = {
    panelOpen: false,
    organism: '',
    navItems: ['Colony'],
  }

  forward = organism => {
    this.setState(({ navItems }) => ({
      navItems: [...navItems, organism.address],
      organism: organism,
    }))
  }

  backward = () => {
    if (this.state.navItems.length <= 1) {
      return
    }
    this.setState(({ navItems }) => ({ navItems: navItems.slice(0, -1) }))
  }

  render() {
    console.log('Props')

    console.log(this.props)

    const { organisms } = this.props
    // const organisms = [
    //   { address: '0xDdc22AB3150910844Ac5220B5B3a207363607a4e', message: 'My first individuation', tree: 'QmQ8Ges9tXtNA59Ej6atkpbBdJE3xizckeZtZiXnRFxPrn' },
    //   { address: '0xDdc22AB3150910844Ac5220B5B3a207363607a4e', message: 'My first individuation', tree: undefined },
    // ]
    const { organism, panelOpen, navItems, selectedOrganism } = this.state

    return (
      <PublicUrl.Provider url="./aragon-ui/">
        <BaseStyles />
        <Main>
          <AppView
            appBar={
              <AppBar
                endContent={
                  navItems.length < 2 && (
                    <Button mode="strong" onClick={this.toggleSidebar}>
                      New organism
                    </Button>
                  )
                }
              >
                <NavigationBar items={navItems} onBack={this.backward} />
              </AppBar>
            }
          >
            {navItems.length < 2 && !organisms.length && (
              <EmptyContainer>
                <EmptyStateCard
                  icon={EmptyIcon}
                  title="Deploy an organism"
                  text="Get started now by deploying a new organism"
                  actionText="New organism"
                  onActivate={this.toggleSidebar}
                />
              </EmptyContainer>
            )}
            {navItems.length < 2 && !!organisms.length && <OrganismsList organisms={organisms} onClick={this.forward} />}
            {navItems.length > 1 && <OrganismScreen organism={organism} />}
          </AppView>
        </Main>
      </PublicUrl.Provider>
    )
  }
}
