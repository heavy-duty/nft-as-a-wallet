import { mplCore } from '@metaplex-foundation/mpl-core'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export function useUmi() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return useMemo(
    () =>
      createUmi(connection.rpcEndpoint, 'confirmed')
        .use(mplCore())
        .use(mplToolbox())
        .use(walletAdapterIdentity(wallet)),
    [connection.rpcEndpoint, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions],
  )
}
