import Layout from 'components/Layout'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { paths } from '@reservoir0x/client-sdk/dist/types/api'
import setParams from 'lib/params'
import Head from 'next/head'
import TrendingCollectionReport from 'components/TrendingCollectionReport'
import SortTrendingCollections from 'components/SortTrendingCollections'
import { useMediaQuery } from '@react-hookz/web'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Environment variables
// For more information about these variables
// refer to the README.md file on this repository
// Reference: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// REQUIRED
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const RESERVOIR_API_BASE =
  process.env.NEXT_PUBLIC_LIST_DATA_BASE || process.env.NEXT_PUBLIC_DATA_BASE

// OPTIONAL
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY
const REDIRECT_HOMEPAGE = process.env.NEXT_PUBLIC_REDIRECT_HOMEPAGE
const META_TITLE = process.env.NEXT_PUBLIC_META_TITLE
const META_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION
const META_IMAGE = process.env.NEXT_PUBLIC_META_OG_IMAGE
const TAGLINE = process.env.NEXT_PUBLIC_TAGLINE
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID

type Props = InferGetStaticPropsType<typeof getStaticProps>

const metadata = {
  title: (title: string) => <title>{title} - Stolen NFTs Explorer</title>,
  description: (description: string) => (
    <meta name="description" content={description} />
  ),
  tagline: (tagline: string | undefined) => (
    <>{tagline || 'Discover, stolen NFTs'}</>
  ),
  image: (image?: string) => {
    if (image) {
      return (
        <>
          <meta name="twitter:image" content={image} />
          <meta name="og:image" content={image} />
        </>
      )
    }
    return null
  },
}

const Home: NextPage<Props> = ({ fallback }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()

 
  const description = META_DESCRIPTION && metadata.description(META_DESCRIPTION)
  const image = metadata.image(META_IMAGE)
  const tagline = metadata.tagline(TAGLINE)

  const timeDis = new Date().toISOString().split('T')[0]

  const title = META_TITLE && metadata.title(META_TITLE + ' '+timeDis)
  // useEffect(() => {
  //   if (REDIRECT_HOMEPAGE && COLLECTION) {
  //     router.push(`/collections/${COLLECTION}`)
  //   }
  // }, [COLLECTION, REDIRECT_HOMEPAGE])

  // Return error page if the API base url or the environment's
  // chain ID are missing
  if (!CHAIN_ID) {
    console.debug({ CHAIN_ID })
    return <div>There was an error</div>
  }

  if (REDIRECT_HOMEPAGE && COLLECTION) return null

  return (
    <div>
      <Head>
        {title}
        {description}
        {image}
      </Head>
      <header className="col-span-full mb-2 mt-24 px-6 md:px-16">
        <div>
          <img src="/logo-light.png" className={'mx-auto h-10 w-auto'} />
        </div>
        {/* <p className="mb-12">
          <img src="/logo-light.png" className={'mx-auto h-10 w-auto'} />
        </p> */}
        <h1 className="reservoir-h1 mt-12 mb-16 text-center dark:text-gray-300 ">
          Stolen NFTs Report
        </h1>
        <div className="flex w-full items-center justify-between">
          <div></div>
          <SortTrendingCollections />
        </div>
      </header>
      <div className="col-span-full px-6 md:px-16">
        {/* <div className="mb-9 flex w-full items-center justify-between">
          <div className="reservoir-h4 dark:text-white">By Value</div>
          {!isSmallDevice && <SortTrendingCollections />}
        </div> */}
        <TrendingCollectionReport fallback={fallback} />
      </div>
      <div className="mb-12 text-center opacity-80">
        <p className="mt-4 text-xs">explorer.scamsniffer.io</p>
        <p className="mt-4 text-xs">{timeDis}</p>
        <img src="/logo-light.png" className={'mx-auto mt-10 h-5 w-auto'} />
      </div>
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps<{
  fallback: any[]
}> = async () => {
  const options: RequestInit | undefined = {}

  const res = await fetch(`${RESERVOIR_API_BASE}/v1/summary.json`, options)
  const collections = await res.json()

  return {
    props: {
      fallback: collections,
    },
  }
}
