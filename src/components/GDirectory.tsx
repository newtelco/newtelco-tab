import React, { useEffect, useState } from 'react'
import { Loader, UserCard, RequireLogin } from '@/components/index'
import { useSession, signIn } from 'next-auth/client'
import { motion } from 'framer-motion'

const item = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
}

const GDirectory: React.FC = () => {
  const [session] = useSession()
  const [people, setPeople] = useState({
    data: [],
    filteredPeople: [],
    loading: false,
    loginRequired: false,
    error: '',
  })

  const fetchData = async () => {
    if (!session) {
      setPeople({ ...people, loading: false, loginRequired: true })
      return true
    }

    setPeople({ ...people, loading: true, loginRequired: false })
    try {
      const response = await fetch('/api/directory')

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      const filteredPeople = data.people
        .reduce((acc, person) => {
          if (person?.phoneNumbers) {
            acc.push({
              name: person.names[0].displayName,
              phones:
                person.phoneNumbers?.map((phone) => phone.canonicalForm) ?? [],
              email: person.emailAddresses?.[0].value,
              position: person.organizations?.[0].title,
              department: person.organizations?.[0].department,
              img: person.photos?.[0].url,
            })
          }
          return acc
        }, [])
        .sort((a, b) => {
          if (a.name > b.name) {
            return 1
          }
          return -1
        })

      setPeople({
        ...people,
        filteredPeople,
        data: filteredPeople,
        loading: false,
        loginRequired: false,
      })
    } catch (e) {
      void signIn('google')
      setPeople({
        ...people,
        loading: false,
        loginRequired: true,
        error: e.message,
      })
    }
  }

  useEffect(() => {
    void fetchData()
  }, [session])

  const handleSearch = (input) => {
    const value = input.target.value.toLowerCase()

    if (value) {
      const filteredPeople = people.data.filter((person) =>
        person.name.toLowerCase().includes(value),
      )
      setPeople({
        loading: false,
        loginRequired: false,
        data: [...people.data],
        filteredPeople,
        error: '',
      })
    } else {
      setPeople({
        loading: false,
        loginRequired: false,
        data: [...people.data],
        filteredPeople: people.data,
        error: '',
      })
    }
  }

  return (
    <motion.div
      tw="relative p-4 w-full bg-gray-900 rounded-xl shadow-lg overflow-hidden"
      css="height: auto;max-height: 650px"
      variants={item}
    >
      <div tw="flex items-center justify-between mb-4 p-4 w-full">
        <div tw="flex justify-center align-middle text-center text-white text-xl font-normal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span tw="ml-2 leading-9">Contact Info</span>
        </div>
      </div>
      <div tw="focus-within:(ring-4 ring-opacity-20) relative flex mx-8 rounded-lg transition-shadow duration-300 ease-in-out ring-newtelco-500">
        <span tw="inline-flex items-center px-3 text-gray-500 text-sm bg-gray-800 border-b border-l border-t border-gray-800 rounded-l-lg shadow-sm">
          <svg
            height="15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          id="searchUsers"
          onChange={(input) => handleSearch(input)}
          tw="placeholder-gray-400 flex-1 px-4 py-2 w-full text-gray-200 text-base bg-gray-800 border border-gray-800 focus:border-transparent rounded-r-lg focus:outline-none shadow-sm appearance-none"
          name="search"
          placeholder="Search"
        />
      </div>
      {people.loading ? (
        <Loader />
      ) : (
        <div
          tw="flex flex-col justify-start m-4 p-4 overflow-y-scroll space-y-4"
          css="height: calc(100vh - 450px);max-height:550px;"
        >
          {people.filteredPeople.length > 0 ? (
            people.filteredPeople.map((person) => (
              <UserCard key={person.name} person={person} />
            ))
          ) : (
            <div tw="flex flex-col justify-center align-middle h-48 text-center font-thin space-y-4">
              {people.loginRequired ? (
                <div tw="flex flex-col justify-center align-middle h-48 text-center font-thin space-y-4">
                  <p>Login to view contact directory</p>
                  <RequireLogin />
                </div>
              ) : (
                <p>No colleagues found</p>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default GDirectory