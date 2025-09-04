import { findAssetSignerPda } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { useUmi } from '../metaplex/use-umi'
import { WalletButton } from '../solana/solana-provider'
import { WalletDetails } from './wallet-ui'

export default function WalletDetailFeature() {
  const params = useParams() as { assetId: string }
  const assetId = useMemo(() => {
    if (!params.assetId) {
      return null
    }
    try {
      return umiPublicKey(params.assetId)
    } catch (e) {
      console.log(`Invalid asset ID`, e)
    }
  }, [params])
  const { publicKey } = useWallet()
  const umi = useUmi()
  const assetSignerPda = assetId ? findAssetSignerPda(umi, { asset: assetId }) : null

  if (!publicKey) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    )
  }

  if (!assetId || !assetSignerPda) {
    return <div>Error loading NFT</div>
  }

  return <WalletDetails assetId={assetId} assetSigner={assetSignerPda[0]} authority={umiPublicKey(publicKey)} />
}
