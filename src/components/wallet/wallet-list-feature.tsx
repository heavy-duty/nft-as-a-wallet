import { publicKey as umiPublicKey } from '@metaplex-foundation/umi'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { WalletList } from './wallet-ui'

export default function WalletListFeature() {
  const { publicKey } = useWallet()

  if (!publicKey) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div>
      <WalletList assetOwner={umiPublicKey(publicKey)} />
    </div>
  )
}
