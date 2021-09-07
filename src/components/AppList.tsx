import React, { useState, useEffect } from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { AppLink } from '@/components/index'

type AppListProps = {
  category: string
}

const list = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const AppList: React.FC<AppListProps> = ({ category }): React.ReactElement => {
  const [activeApps, setActiveApps] = useState([])

  useEffect(() => {
    fetch(`/api/apps/${category}`)
      .then((res) => res.json())
      .then((data) => {
        const apps = data.apps
        // setActiveApps(apps)
        const dummyArray = new Array(9 - apps.length).fill({ name: '', url: '', img: ''})
        setActiveApps([...apps, ...dummyArray])
      })
      .catch((err) => console.error(err))
  }, [category])

  return (
    <div tw="px-4 max-h-full overflow-y-scroll w-full md:w-1/2">
      <AnimateSharedLayout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={list}
          key={category}
          tw="grid gap-6 grid-cols-1 xl:grid-cols-2 py-2"
          css="grid-template-rows: repeat(12, 20px)"
        >
          {activeApps?.map((app, index) => (
            <AppLink index={index} key={index} app={app} />
          ))}
        </motion.div>
      </AnimateSharedLayout>
    </div>
  )
}

export default AppList
