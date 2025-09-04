import { AssetV1, execute, fetchAsset, fetchAssetsByOwner, transfer } from '@metaplex-foundation/mpl-core'
import {
  createTokenIfMissing,
  fetchAllTokenByOwner,
  fetchMint,
  findAssociatedTokenPda,
  transferSol,
  transferTokensChecked,
} from '@metaplex-foundation/mpl-toolbox'
import { createNoopSigner, PublicKey, publicKey, sol, SolAmount, WrappedInstruction } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUmi } from '../metaplex/use-umi'

export interface NftMetadata {
  name: string
  description: string
  image: string
  symbol: string
  attributes: { trait_type: string; value: string }[]
}

export interface AssetWithMetadata extends AssetV1 {
  metadata: NftMetadata
}

export function useGetBalance({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const umi = useUmi()

  return useQuery({
    queryKey: ['get-balance', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
    queryFn: () => umi.rpc.getBalance(assetSigner),
  })
}

export function useGetSignatures({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const { connection } = useConnection()
  const umi = useUmi()

  return useQuery({
    queryKey: ['get-signatures', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
    queryFn: () => connection.getSignaturesForAddress(new SolanaPublicKey(assetSigner)),
  })
}

export function useGetTokenAccounts({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const umi = useUmi()

  return useQuery({
    queryKey: ['get-token-accounts', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
    queryFn: async () => {
      const tokens = await fetchAllTokenByOwner(umi, assetSigner)
      const mints = await Promise.all(tokens.map((token) => fetchMint(umi, token.mint)))

      return tokens.map((token, index) => ({ data: token, mint: mints[index] }))
    },
  })
}

export function useGetCoreNfts({ assetOwner }: { assetOwner: PublicKey }) {
  const umi = useUmi()

  return useQuery({
    queryKey: ['get-core-nfts', { endpoint: umi.rpc.getEndpoint(), address: assetOwner }],
    queryFn: async (): Promise<AssetWithMetadata[] | null> => {
      try {
        const assetsByOwner = await fetchAssetsByOwner(umi, assetOwner, { skipDerivePlugins: false })

        const assetsWithMetadata = await Promise.all(
          assetsByOwner.map(async (asset) => {
            try {
              // Fetch metadata if URI exists
              if (asset.uri) {
                const response = await fetch(asset.uri)
                if (!response.ok) {
                  throw new Error(`Failed to fetch metadata for asset ${asset.publicKey}`)
                }
                const metadata: NftMetadata = await response.json()
                return { ...asset, metadata }
              }

              // Return asset with null metadata if no URI
              return { ...asset, metadata: null }
            } catch (error) {
              console.error(`Error processing asset ${asset.publicKey}:`, error)
              return null
            }
          }),
        )

        // Filter out null results and assets without metadata
        return assetsWithMetadata.filter(
          (assetWithMetadata): assetWithMetadata is AssetWithMetadata =>
            assetWithMetadata !== null && assetWithMetadata.metadata !== null,
        )
      } catch (error) {
        console.error(`Error fetching assets for address ${assetOwner[0]}:`, error)
        return []
      }
    },
  })
}

export function useGetCoreNft({ assetId }: { assetId: PublicKey }) {
  const umi = useUmi()

  return useQuery({
    queryKey: ['get-core-nft', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
    queryFn: async (): Promise<AssetWithMetadata | null> => {
      try {
        const asset = await fetchAsset(umi, assetId)

        if (asset.uri) {
          const response = await fetch(asset.uri)
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for asset ${asset.publicKey}`)
          }
          const metadata: NftMetadata = await response.json()
          return { ...asset, metadata }
        }

        return null
      } catch (error) {
        console.error(`Error fetching asset ${assetId}:`, error)
        return null
      }
    },
  })
}

export function useTransferCoreNft({ assetId, authority }: { assetId: PublicKey; authority: PublicKey }) {
  const client = useQueryClient()
  const umi = useUmi()

  return useMutation({
    mutationKey: ['transfer-core-nft'],
    mutationFn: async (input: { destination: PublicKey }) => {
      const asset = await fetchAsset(umi, assetId)
      const res = await transfer(umi, {
        asset,
        newOwner: input.destination,
      }).sendAndConfirm(umi)

      return base58.deserialize(res.signature)[0]
    },
    onSuccess: async (signature) => {
      console.log('NFT Transfer Transaction sent', signature)
      await Promise.all([
        client.invalidateQueries({
          queryKey: ['get-core-nfts', { endpoint: umi.rpc.getEndpoint(), address: authority }],
        }),
        client.invalidateQueries({
          queryKey: ['get-core-nft', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
      ])
    },
    onError: (error) => {
      console.error(`NFT Transfer failed! ${error}`)
    },
  })
}

export function useRequestAirdrop({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const client = useQueryClient()
  const umi = useUmi()

  return useMutation({
    mutationKey: ['airdrop'],
    mutationFn: async (amount: number = 1) => umi.rpc.airdrop(assetSigner, sol(amount)),
    onSuccess: async () => {
      console.log('Airdrop Transaction sent')
      await Promise.all([
        client.invalidateQueries({
          queryKey: ['get-balance', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
        client.invalidateQueries({
          queryKey: ['get-signatures', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
      ])
    },
    onError: (error) => {
      console.error(`Transaction failed! ${error}`)
    },
  })
}

export function useExecuteTransferSol({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const client = useQueryClient()
  const umi = useUmi()

  return useMutation({
    mutationKey: ['execute-transfer-sol'],
    mutationFn: async (input: { destination: PublicKey; amount: SolAmount }) => {
      const asset = await fetchAsset(umi, assetId)

      const res = await execute(umi, {
        asset,
        instructions: transferSol(umi, {
          source: createNoopSigner(assetSigner),
          destination: input.destination,
          amount: input.amount,
        }),
      }).sendAndConfirm(umi)

      return base58.deserialize(res.signature)[0]
    },
    onSuccess: async (signature) => {
      console.log('SOL Transaction sent', signature)
      await Promise.all([
        client.invalidateQueries({
          queryKey: ['get-balance', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
        client.invalidateQueries({
          queryKey: ['get-signatures', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
      ])
    },
    onError: (error) => {
      console.error(`Transaction failed! ${error}`)
    },
  })
}

export function useExecuteTransferSpl({
  assetId,
  assetSigner,
  mint,
  source,
  decimals,
}: {
  assetId: PublicKey
  assetSigner: PublicKey
  mint: PublicKey
  source: PublicKey
  decimals: number
}) {
  const client = useQueryClient()
  const umi = useUmi()

  return useMutation({
    mutationKey: ['execute-transfer-spl'],
    mutationFn: async (input: { destination: PublicKey; amount: number }) => {
      const asset = await fetchAsset(umi, assetId)
      const destinationAta = findAssociatedTokenPda(umi, {
        mint: mint,
        owner: input.destination,
      })

      // Add a noop with a readonly publickey to be able to filter transactions
      const noOpInstruction: WrappedInstruction = {
        instruction: {
          programId: publicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
          keys: [
            {
              pubkey: input.destination,
              isSigner: false,
              isWritable: false,
            },
          ],
          data: Buffer.from([]),
        },
        signers: [],
        bytesCreatedOnChain: 0,
      }

      const transferSpl = transferTokensChecked(umi, {
        authority: createNoopSigner(assetSigner),
        source,
        destination: destinationAta,
        mint,
        amount: input.amount,
        decimals,
      })
        .prepend(
          createTokenIfMissing(umi, {
            mint: mint,
            owner: input.destination,
            payer: createNoopSigner(assetSigner),
          }),
        )
        .append(noOpInstruction)

      const res = await execute(umi, {
        asset,
        instructions: transferSpl,
      }).sendAndConfirm(umi)

      return base58.deserialize(res.signature)[0]
    },
    onSuccess: async (signature) => {
      console.log('SPL Token Transaction sent', signature)
      await Promise.all([
        client.invalidateQueries({
          queryKey: ['get-balance', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
        client.invalidateQueries({
          queryKey: ['get-signatures', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
        client.invalidateQueries({
          queryKey: ['get-token-accounts', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
        }),
      ])
    },
    onError: (error) => {
      console.error(`SPL Token Transaction failed! ${error}`)
    },
  })
}
