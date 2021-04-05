import React from 'react'
import { styled } from 'twin.macro'
import Tabs from '@/components/Tabs'
import Gdrive from '@/components/Gdrive'
// import Gdirectory from '@/components/Gdirectory'
// import Trello? from '@/components/Trello'

type TabProps = {
  label: string
}

const Tab = styled.div<TabProps>`
  margin: 0 10px;
`

const GoogleWorkspace = (): React.ReactElement => {
  return (
    <Tabs>
      <Tab label="Google Drive">
        <Gdrive />
      </Tab>
      <Tab label="Directory">
        After 'while, <em>Crocodile</em>!
      </Tab>
      {/* <div label="Sarcosuchus">
        Nothing to see here, this tab is <em>extinct</em>!
      </div> */}
    </Tabs>
  )
}

export default GoogleWorkspace
