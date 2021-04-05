import React from 'react'
import { css } from 'twin.macro'

type AppLinkProps = {
  index: number
  app: {
    name: string
    desc?: string
    img: string
    url: string
  }
}

const offsetStyle = css`
  margin-top: 20px;
  grid-row: span 4 / span 4 !important;
`

const AppLink = ({ index, app }: AppLinkProps): React.ReactElement => {
  const { name, img, url } = app

  const cleanUrl = new URL(url).hostname

  return (
    <div
      tw="shadow-lg rounded-xl p-4 bg-gray-900 relative overflow-hidden "
      css={[
        index === 0 && offsetStyle,
        index % 2 === 0 ? 'grid-row: span 4 / span 4; min-width: 250px;' : 'grid-row: span 3 / span 4; min-width: 250px;',
      ]}
    >
      <a href={url} rel="noopener noreferer" target="_blank" tw="flex h-full justify-between items-center">
        <div tw="h-full flex flex-col justify-between">
          <p tw="text-white text-2xl font-thin mb-4">{name}</p>
          <p tw="text-newtelco-700 text-xs">{cleanUrl}</p>
        </div>
        <img alt="moto" src={`/icons/${img}`} tw="h-16 w-16" />
      </a>
    </div>
  )
}

export default AppLink
