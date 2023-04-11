import { type ComponentMeta, type Story } from '@storybook/react'
import { MoreHorizontal } from '@talismn/icons'
import { useCallback, useState } from 'react'

import { IconButton, Identicon, Text } from '../../atoms'
import { Default as NavigationBarStory } from '../NavigationBar/NavigationBar.stories'
import { Default as NavigationDrawerStory } from '../NavigationDrawer/NavigationDrawer.stories'
import { Default as NavigationRailStory } from '../NavigationRail/NavigationRail.stories'
import TopAppBar from '../TopAppBar'
import { Default as TopAppBarStory } from '../TopAppBar/TopAppBar.stories'
import Scaffold from './Scaffold'

export default {
  title: 'Organisms/Scaffold',
  component: Scaffold,

  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Scaffold>

const { open, onRequestDismiss, ...drawerProps } = NavigationDrawerStory.args ?? {}

export const Default: Story = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <Scaffold
      breakpoints={{ topBar: 'narrow', bottomBar: 'narrow', sideBar: 'wide', drawer: 'narrow' }}
      topBar={
        <TopAppBarStory
          {...TopAppBarStory.args}
          actions={
            <TopAppBar.Actions>
              <Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="2.4rem" />
              <IconButton onClick={useCallback(() => setDrawerOpen(true), [])}>
                <MoreHorizontal />
              </IconButton>
            </TopAppBar.Actions>
          }
        />
      }
      bottomBar={<NavigationBarStory {...NavigationBarStory.args} />}
      sideBar={<NavigationRailStory {...NavigationRailStory.args} />}
      drawer={
        <NavigationDrawerStory
          {...drawerProps}
          open={drawerOpen}
          onRequestDismiss={useCallback(() => setDrawerOpen(false), [])}
        />
      }
    >
      {Array.from({ length: 24 }, (_, index) => (
        <Text.Body key={index} as="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </Text.Body>
      ))}
    </Scaffold>
  )
}
