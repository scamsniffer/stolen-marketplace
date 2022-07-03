import { FC } from 'react'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from 'components/FormatEth'
import useCollections from 'hooks/useCollections'
import { paths } from '@reservoir0x/client-sdk'
import { formatNumber } from 'lib/numbers'
import { useRouter } from 'next/router'
import { PercentageChange } from './hero/HeroStats'
import { useMediaQuery } from '@react-hookz/web'
import SortTrendingCollections from 'components/SortTrendingCollections'

type StatProps = {
  totalStolen: number
  totalValue: number | undefined
}

const Stat: FC<{ name: string }> = ({ name, children }) => (
  <div className="flex h-20 flex-col items-center justify-center bg-white dark:bg-black md:h-auto">
    {children}
    <p className="mt-1 text-[#A3A3A3]">{name}</p>
  </div>
)


const SummaryStats: FC<{ stats: StatProps }> = ({ stats }) => {
  return (
    <div className="grid min-w-full grid-cols-2 items-center gap-[1px] overflow-hidden rounded-lg border-[1px] border-gray-300 bg-gray-300 dark:border-[#525252] dark:bg-[#525252] md:m-0 md:h-[82px] md:min-w-[647px] md:grid-cols-4 md:gap-2 md:bg-white dark:md:bg-black">
      <Stat name="Total stolen">
        <h3 className="reservoir-h4 dark:text-white">
          {formatNumber(stats.totalStolen)}
        </h3>
      </Stat>

      <Stat name="Total value">
        <h3 className="reservoir-h4 flex items-center justify-center gap-1 dark:text-white">
          <FormatEth amount={stats.totalValue} maximumFractionDigits={2} />
        </h3>
      </Stat>
    </div>
  )
}

type Props = {
  fallback: any[]
}

type Volumes = '1DayVolume' | '7DayVolume' | '30DayVolume'

const TrendingCollectionTable: FC<Props> = ({ fallback }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  // Reference: https://swr.vercel.app/examples/infinite-loading
  const { collections, ref } = useCollections(router, fallback)
  const mappedCollections = collections.data
    ? collections.data.flatMap((_) => _)
    : []

  const columns = isSmallDevice
    ? ['Collection', 'Value', ]
    : ['Collection', 'Value',]

  const countColumns = ['Collection', 'Count']

  const totalSummary = mappedCollections?.map((collection: any, index, arr) => {
    return processCollection(collection)
  }).reduce((all, item) => {
    all.totalValue += item.valueInETH
    all.totalStolen += item.stolen
    return all;
  }, {

    totalValue: 0,
    totalStolen: 0
  })

  return (
    <div className="mb-11 overflow-x-auto">
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="reservoir-h4 dark:text-gray-400">Overview</div>
      </div>
      <div className="mb-11">
        <SummaryStats stats={totalSummary} />
      </div>

      <div className="mb-6 flex w-full items-center justify-between">
        <div className="reservoir-h4 dark:text-gray-400">By Value</div>
      </div>

      <article className="col-span-full rounded-2xl border-[1px] border-gray-300 bg-white p-6 dark:border-neutral-600 dark:bg-black">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {columns.map((item, index) => (
                <th
                  key={item}
                  scope="col"
                  className={
                    'reservoir-subtitle px-6 py-3 text-left dark:text-white'
                  }
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedCollections
              ?.map((collection: any, index, arr) => {
                return processCollection(collection)
              })
              .sort((a, b) => {
                return b.valueInETH - a.valueInETH
              })
              .slice(0, 10)
              .map((parsed: any, index, arr) => {
                const {
                  contract,
                  tokenHref,
                  image,
                  name,
                  valueInETH,
                  stolen,
                  days1,
                  days30,
                  days7,
                  days1Change,
                  days7Change,
                  days30Change,
                  floorSaleChange1Days,
                  floorSaleChange7Days,
                  floorSaleChange30Days,
                  floorPrice,
                  supply,
                } = parsed

                return (
                  <tr
                    key={`${contract}-${index}`}
                    // ref={index === arr.length - 5 ? ref : null}
                    className={
                      index === 9
                        ? 'group h-[88px]  border-neutral-300 dark:border-neutral-600 dark:text-white'
                        : 'group h-[88px] border-b border-neutral-300 dark:border-neutral-600 dark:text-white'
                    }
                  >
                    {/* COLLECTION */}
                    <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-4 dark:text-white">
                      <div className="reservoir-h6 mr-6 dark:text-white">
                        {index + 1}
                      </div>
                      <Link href={tokenHref}>
                        <a className="flex items-center gap-2">
                          <img
                            src={optimizeImage(image, 140)}
                            className="h-[56px] w-[56px] rounded-full object-cover"
                          />
                          <div
                            className={`reservoir-h6 overflow-hidden truncate whitespace-nowrap dark:text-white ${
                              isSmallDevice ? 'max-w-[140px]' : ''
                            }`}
                          >
                            {name}
                          </div>
                        </a>
                      </Link>
                    </td>

                    {/* FLOOR PRICE */}
                    <td className="reservoir-h5 whitespace-nowrap px-6 py-4 dark:text-white">
                      <FormatEth
                        amount={valueInETH}
                        maximumFractionDigits={2}
                      />
                    </td>

                    {/* SUPPLY */}
                    {/* {
                    <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                      {stolen ? formatNumber(+stolen) : '-'}
                    </td>
                  } */}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </article>
      <div className="mb-6 mt-12 flex w-full items-center justify-between">
        <div className="reservoir-h4 dark:text-gray-400">By Count</div>
      </div>
      <article className="col-span-full rounded-2xl border-[1px] border-gray-300 bg-white p-6 dark:border-neutral-600 dark:bg-black">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {countColumns.map((item) => (
                <th
                  key={item}
                  scope="col"
                  className="reservoir-subtitle px-6 py-3 text-left dark:text-white"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedCollections
              ?.map((collection: any, index, arr) => {
                return processCollection(collection)
              })
              .sort((a, b) => {
                return b.stolen - a.stolen
              })
              .slice(0, 10)
              .map((parsed: any, index, arr) => {
                const {
                  contract,
                  tokenHref,
                  image,
                  name,
                  valueInETH,
                  stolen,
                  days1,
                  days30,
                  days7,
                  days1Change,
                  days7Change,
                  days30Change,
                  floorSaleChange1Days,
                  floorSaleChange7Days,
                  floorSaleChange30Days,
                  floorPrice,
                  supply,
                } = parsed

                return (
                  <tr
                    key={`${contract}-${index}`}
                    // ref={index === arr.length - 5 ? ref : null}
                    className={
                      index === 9
                        ? 'group h-[88px]  border-neutral-300 dark:border-neutral-600 dark:text-white'
                        : 'group h-[88px] border-b border-neutral-300 dark:border-neutral-600 dark:text-white'
                    }
                  >
                    {/* COLLECTION */}
                    <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-4 dark:text-white">
                      <div className="reservoir-h6 mr-6 dark:text-white">
                        {index + 1}
                      </div>
                      <Link href={tokenHref}>
                        <a className="flex items-center gap-2">
                          <img
                            src={optimizeImage(image, 140)}
                            className="h-[56px] w-[56px] rounded-full object-cover"
                          />
                          <div
                            className={`reservoir-h6 overflow-hidden truncate whitespace-nowrap dark:text-white ${
                              isSmallDevice ? 'max-w-[140px]' : ''
                            }`}
                          >
                            {name}
                          </div>
                        </a>
                      </Link>
                    </td>

                    {/* FLOOR PRICE */}
                    {/* <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                    <FormatEth amount={valueInETH} maximumFractionDigits={2} />
                  </td> */}

                    {/* SUPPLY */}
                    {
                      <td className="reservoir-h5 whitespace-nowrap px-6 py-4 dark:text-white">
                        {stolen ? formatNumber(+stolen) : '-'}
                      </td>
                    }
                  </tr>
                )
              })}
          </tbody>
        </table>
      </article>
    </div>
  )
}

export default TrendingCollectionTable

function getFloorDelta(
  currentFloor: number | undefined,
  previousFloor: number | undefined
) {
  if (!currentFloor || !previousFloor) return 0

  return (currentFloor - previousFloor) / previousFloor
}

function processCollection(
  collection: any
) {
  const data = {
    contract: collection?.primaryContract,
    id: collection?.id,
    image: collection?.imageUrl,
    stolen: collection?.total,
    valueInETH: collection.floorPrice
      ? (parseFloat(collection.floorPrice) * collection?.total)
      : 0,
    contract_address: collection?.contract_address,
    name: collection?.name,
    days1: collection?.volume?.['1day'],
    days7: collection?.volume?.['7day'],
    days30: collection?.volume?.['30day'],
    days1Change: collection?.volumeChange?.['1day'],
    days7Change: collection?.volumeChange?.['7day'],
    days30Change: collection?.volumeChange?.['30day'],
    floor1Days: collection?.floorSale?.['1day'],
    floor7Days: collection?.floorSale?.['7day'],
    floor30Days: collection?.floorSale?.['30day'],
    floorSaleChange1Days: collection?.floorSaleChange?.['1day'],
    floorSaleChange7Days: collection?.floorSaleChange?.['7day'],
    floorSaleChange30Days: collection?.floorSaleChange?.['30day'],
    floorPrice: collection?.floorAskPrice,
    supply: collection?.tokenCount,
  }

  const tokenHref = `/collections/${data.contract_address}`

  return { ...data, tokenHref }
}
