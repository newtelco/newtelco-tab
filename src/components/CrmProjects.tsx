import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import CrmProject from '@/components/CrmProject'
import Loader from '@/components/Loader'
import RequireLogin from '@/components/RequireLogin'

const CrmProjects: React.FC = (): React.ReactElement => {
  const [session] = useSession()
  const [projects, setProjects] = useState({
    data: [],
    loading: false,
    loginRequired: false,
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setProjects({ ...projects, loading: false, loginRequired: true })
        return true
      }

      setProjects({ ...projects, loading: true, loginRequired: false })
      try {
        const response = await fetch(`https://api.crm.newtelco.de/dashboard/list?user=${session.user.name}`)

        if (!response.ok) {
          throw new Error(`${response.status} - ${response.statusText}`)
        }

        const data = await response.json()

        setProjects({ ...projects, data: data.results, loading: false, loginRequired: false })
      } catch (e) {
        setProjects({ ...projects, loading: false, loginRequired: true, error: e.message })
      }
    }

    void fetchData()
  }, [session])

  return (
    <div tw="shadow-lg rounded-xl p-4 bg-gray-900 relative overflow-hidden h-full w-full">
      <div tw="w-full flex items-center justify-between mb-4 p-4">
        <div tw="text-white text-xl font-normal flex align-middle justify-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            height="36"
            width="36"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span tw="leading-9 ml-2">Open Projects</span>
        </div>
      </div>
      {projects.loading ? (
        <Loader />
      ) : (
        <div tw="flex flex-col justify-between p-4">
          {projects.data.length > 0 ? (
            projects.data.map((project) => <CrmProject key={project.id} project={project} />)
          ) : (
            <div tw="flex flex-col justify-center align-middle space-y-4 h-48 text-center font-thin">
              {projects.loginRequired ? (
                <>
                  <p>Login to view open projects</p>
                  <RequireLogin />
                </>
              ) : (
                <p>No open projects</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CrmProjects
