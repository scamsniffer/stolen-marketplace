import useCollection from 'hooks/useCollection'
import useDetails from 'hooks/useDetails'
import { optimizeImage } from 'lib/optmizeImage'
import Link from 'next/link'
import React, { FC } from 'react'
import { truncateAddress } from 'lib/truncateText'
import { FiExternalLink, FiRefreshCcw } from 'react-icons/fi'

type Props = {
  collection: any
  details: any
}

const ScamInfo: FC<Props> = ({ collection, details }) => {
  const token = details

  const chain_activity = token.chain_activity
  const timeDis = new Date(chain_activity.firstTime).toISOString().split('T')[0]

  return (
    <article className="col-span-full rounded-2xl border border-gray-300 bg-white p-6 dark:border-neutral-600 dark:bg-black">
      <div className="mb-4 flex items-center justify-between">
        <div className="reservoir-h5 font-headings dark:text-white">
          Scam Activity
        </div>
        <div className="flex items-center gap-2"></div>
      </div>
      {token?.asset_contract && (
        <div className="mb-4 flex items-center justify-between">
          <div className="reservoir-subtitle dark:text-white">Time</div>
          <div className="reservoir-h6 max-w-[200px] truncate font-headings dark:text-white">
            {timeDis}
          </div>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <div className="reservoir-subtitle dark:text-white">Attackers</div>
        <div className="reservoir-h6 font-headings dark:text-white">
          {chain_activity?.receivers.map((receiver: any) => {
            return (
              <a
                className="reservoir-h6 flex items-center gap-2 font-headings text-primary-700 dark:text-primary-100"
                target="_blank"
                rel="noopener noreferrer"
                key={receiver}
                href={`https://etherscan.io/token/${details.asset_contract.address}?a=${receiver}`}
              >
                {truncateAddress(receiver)}
                <FiExternalLink className="h-4 w-4" />
              </a>
            )
          })}
        </div>
      </div>
    </article>
  )
}

export default ScamInfo
