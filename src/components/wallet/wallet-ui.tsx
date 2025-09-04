import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ellipsify } from '@/lib/utils'
import { amountToString, createAmount, publicKey, PublicKey, sol } from '@metaplex-foundation/umi'
import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AppModal } from '../app-modal'
import { useCluster } from '../cluster/cluster-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useUmi } from '../metaplex/use-umi'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  AssetWithMetadata,
  useExecuteTransferSol,
  useExecuteTransferSpl,
  useGetBalance,
  useGetCoreNft,
  useGetCoreNfts,
  useGetSignatures,
  useGetTokenAccounts,
  useRequestAirdrop,
  useTransferCoreNft,
} from './wallet-data-access'

function ModalReceive({ assetSigner }: { assetSigner: PublicKey }) {
  return (
    <AppModal title="Receive">
      <p>Receive assets by sending them to your public key:</p>
      <code>{assetSigner.toString()}</code>
    </AppModal>
  )
}

function ModalAirdrop({
  assetId,
  assetSigner,
  assetOwner,
  authority,
}: {
  assetId: PublicKey
  assetSigner: PublicKey
  assetOwner: PublicKey
  authority: PublicKey
}) {
  const [amount, setAmount] = useState('2')
  const [isOpen, setIsOpen] = useState(false)

  const mutation = useRequestAirdrop({
    assetId,
    assetSigner,
  })

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(parseFloat(amount))
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || mutation.isPending}
      submitLabel="Request Airdrop"
      submit={handleSubmit}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={assetOwner !== authority}
    >
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}

function ModalSendSol({
  assetId,
  assetSigner,
  assetOwner,
  authority,
}: {
  assetId: PublicKey
  assetSigner: PublicKey
  assetOwner: PublicKey
  authority: PublicKey
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  const mutation = useExecuteTransferSol({
    assetId,
    assetSigner,
  })

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        destination: publicKey(destination),
        amount: sol(parseFloat(amount)),
      })
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <AppModal
      title="Send"
      submitDisabled={!destination || !amount || mutation.isPending}
      submitLabel="Send"
      submit={handleSubmit}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={assetOwner !== authority}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        disabled={mutation.isPending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        type="text"
        value={destination}
      />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}

export function ModalSendSpl({
  assetId,
  assetSigner,
  assetOwner,
  authority,
  mint,
  source,
  decimals,
}: {
  assetId: PublicKey
  assetSigner: PublicKey
  assetOwner: PublicKey
  authority: PublicKey
  mint: PublicKey
  source: PublicKey
  decimals: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  const mutation = useExecuteTransferSpl({
    assetId,
    assetSigner,
    mint,
    source,
    decimals,
  })

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        destination: publicKey(destination),
        amount: parseFloat(amount) * Math.pow(10, decimals),
      })
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <AppModal
      title="Send"
      submitDisabled={!destination || !amount || mutation.isPending}
      submitLabel="Send"
      submit={handleSubmit}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={assetOwner !== authority}
    >
      <Label htmlFor="destination">Destination Address</Label>
      <Input
        disabled={mutation.isPending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter destination address"
        type="text"
        value={destination}
      />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="0"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}

export function ModalTransferCoreNft({
  assetId,
  assetOwner,
  authority,
}: {
  assetId: PublicKey
  assetOwner: PublicKey
  authority: PublicKey
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [destination, setDestination] = useState('')

  const mutation = useTransferCoreNft({
    assetId,
    authority,
  })

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        destination: publicKey(destination),
      })
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <AppModal
      title="Transfer ownership"
      submitDisabled={!destination || mutation.isPending}
      submitLabel="Transfer ownership"
      submit={handleSubmit}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={assetOwner !== authority}
    >
      <Label htmlFor="destination">Destination Address</Label>
      <Input
        disabled={mutation.isPending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter destination address"
        type="text"
        value={destination}
      />
    </AppModal>
  )
}

export function WalletButtons({
  assetId,
  assetSigner,
  assetOwner,
  authority,
}: {
  assetId: PublicKey
  assetSigner: PublicKey
  assetOwner: PublicKey
  authority: PublicKey
}) {
  const { cluster } = useCluster()
  return (
    <div>
      <div className="space-x-2">
        <ModalReceive assetSigner={assetSigner} />
        {cluster.network?.includes('mainnet') ? null : (
          <ModalAirdrop assetId={assetId} assetSigner={assetSigner} assetOwner={assetOwner} authority={authority} />
        )}
        <ModalSendSol assetId={assetId} assetSigner={assetSigner} assetOwner={assetOwner} authority={authority} />
        <ModalTransferCoreNft assetId={assetId} assetOwner={assetOwner} authority={authority} />
      </div>
    </div>
  )
}

export function WalletBalance({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const query = useGetBalance({ assetId, assetSigner })

  return (
    <h1 className="text-2xl font-bold cursor-pointer" onClick={() => query.refetch()}>
      <span className="font-medium text-muted-foreground">Balance: </span>

      <span>{query.data !== undefined ? amountToString(query.data, 6) : '...'} SOL</span>
    </h1>
  )
}

export function WalletList({ assetOwner }: { assetOwner: PublicKey }) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetCoreNfts({ assetOwner })
  const umi = useUmi()
  const client = useQueryClient()
  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 6)
  }, [query.data, showAll])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">NFT Wallets</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={async () => {
              await query.refetch()
              await client.invalidateQueries({
                queryKey: ['get-core-nfts', { endpoint: umi.rpc.getEndpoint(), address: assetOwner }],
              })
            }}
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {!query.isFetching && query.isError && (
        <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>
      )}
      {!query.isFetching && query.isSuccess && (
        <div>
          {query.data?.length === 0 ? (
            <div className="text-center py-8">No NFTs found.</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items?.map((nft) => (
                  <Link to={`/wallet/${nft.publicKey}`} aria-label={nft.name} key={nft.publicKey}>
                    <div className="border rounded-lg p-4 bg-card hover:shadow-lg transition-shadow">
                      <img
                        src={nft.metadata.image}
                        alt={nft.name}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                      <h3 className="text-lg font-semibold">{nft.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{nft.metadata.description}</p>
                      <div className="mt-2">
                        <span className="text-xs font-medium text-muted-foreground">Symbol: {nft.metadata.symbol}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {(query.data?.length ?? 0) > 6 && (
                <div className="text-center mt-6">
                  <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Show All'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function WalletDetails({
  assetId,
  assetSigner,
  authority,
}: {
  assetId: PublicKey
  assetSigner: PublicKey
  authority: PublicKey
}) {
  const query = useGetCoreNft({ assetId })
  const client = useQueryClient()
  const umi = useUmi()

  return (
    <div className="space-y-8">
      {/* Wallet Details Section */}
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      {query.isSuccess && (
        <div>
          {query.data === null ? (
            <div className="text-center py-6">NFT not found or metadata unavailable.</div>
          ) : (
            <div className="bg-card border rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row relative">
                <div className="md:w-1/3">
                  <img
                    src={query.data.metadata.image}
                    alt={query.data.metadata.name}
                    className="h-48 md:h-64 object-cover mx-auto"
                  />
                </div>
                <div className="p-4 md:w-2/3 space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold md:text-2xl">{query.data.metadata.name}</h2>
                    {query.isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          await query.refetch()
                          await client.invalidateQueries({
                            queryKey: ['get-core-nft', { endpoint: umi.rpc.getEndpoint(), assetId }],
                          })
                          await client.invalidateQueries({
                            queryKey: ['get-balance', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
                          })
                          await client.invalidateQueries({
                            queryKey: ['get-signatures', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
                          })
                          await client.invalidateQueries({
                            queryKey: ['get-token-accounts', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
                          })
                          await client.invalidateQueries({
                            queryKey: ['get-signatures', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
                          })
                          await client.invalidateQueries({
                            queryKey: ['get-token-accounts', { endpoint: umi.rpc.getEndpoint(), address: assetId }],
                          })
                        }}
                      >
                        <RefreshCw size={14} />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{query.data.metadata.description}</p>
                  <div className="space-y-1">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Symbol: </span>
                      <span className="text-xs">{query.data.metadata.symbol}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Owner: </span>
                      <span className="text-xs font-mono break-all">
                        <ExplorerLink
                          path={`account/${query.data.owner}`}
                          label={ellipsify(query.data.owner.toString())}
                        />
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Asset Public Key: </span>
                      <span className="text-xs font-mono break-all">
                        <ExplorerLink
                          path={`account/${query.data.publicKey}`}
                          label={ellipsify(query.data.publicKey.toString())}
                        />
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Asset Signer PDA: </span>
                      <span className="text-xs font-mono break-all">
                        <ExplorerLink path={`account/${assetSigner}`} label={ellipsify(assetSigner)} />
                      </span>
                    </div>
                  </div>
                  {query.data.metadata.attributes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mt-3">Attributes</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {query.data.metadata.attributes.map((attr, index) => (
                          <span key={index} className="bg-muted px-2 py-1 rounded text-xs">
                            <span className="font-medium">{attr.trait_type}: </span>
                            <span>{attr.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <WalletBalance assetId={assetId} assetSigner={assetSigner} />
                  <WalletButtons
                    assetOwner={query.data.owner}
                    assetId={assetId}
                    assetSigner={assetSigner}
                    authority={authority}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token Accounts and Transactions Sections */}
      {query.isSuccess && query.data !== null && (
        <>
          <WalletTokens asset={query.data} assetSigner={assetSigner} authority={authority} />
          <WalletTransactions assetId={assetId} assetSigner={assetSigner} />
        </>
      )}
    </div>
  )
}

export function WalletTokens({
  asset,
  assetSigner,
  authority,
}: {
  asset: AssetWithMetadata
  assetSigner: PublicKey
  authority: PublicKey
}) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetTokenAccounts({ assetId: asset.publicKey, assetSigner })
  const tokens = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <div className="space-y-2">
      <div className="justify-between">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Token Accounts</h2>
          <div className="space-x-2">{query.isLoading && <span className="loading loading-spinner"></span>}</div>
        </div>
      </div>
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No token accounts found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Public Key</TableHead>
                  <TableHead>Mint</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens?.map((token) => (
                  <TableRow key={token.data.publicKey}>
                    <TableCell>
                      <div className="flex space-x-2">
                        <span className="font-mono">
                          <ExplorerLink
                            label={ellipsify(token.data.publicKey)}
                            path={`account/${token.data.publicKey}`}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <span className="font-mono">
                          <ExplorerLink
                            label={ellipsify(token.mint.publicKey)}
                            path={`account/${token.mint.publicKey}`}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono">
                        {amountToString(createAmount(token.data.amount, '', token.mint.decimals))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ModalSendSpl
                        assetId={asset.publicKey}
                        assetSigner={assetSigner}
                        assetOwner={asset.owner}
                        authority={authority}
                        mint={token.mint.publicKey}
                        source={token.data.publicKey}
                        decimals={token.mint.decimals}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(query.data?.length ?? 0) > 5 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : 'Show All'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  )
}

export function WalletTransactions({ assetId, assetSigner }: { assetId: PublicKey; assetSigner: PublicKey }) {
  const query = useGetSignatures({ assetId, assetSigner })
  const [showAll, setShowAll] = useState(false)

  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="space-x-2">{query.isLoading && <span className="loading loading-spinner"></span>}</div>
      </div>
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No transactions found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signature</TableHead>
                  <TableHead className="text-right">Slot</TableHead>
                  <TableHead>Block Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.signature}>
                    <TableHead className="font-mono">
                      <ExplorerLink path={`tx/${item.signature}`} label={ellipsify(item.signature, 8)} />
                    </TableHead>
                    <TableCell className="font-mono text-right">
                      <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                    </TableCell>
                    <TableCell>{new Date((item.blockTime ?? 0) * 1000).toISOString()}</TableCell>
                    <TableCell className="text-right">
                      {item.err ? (
                        <span className="text-red-500" title={item.err.toString()}>
                          Failed
                        </span>
                      ) : (
                        <span className="text-green-500">Success</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(query.data?.length ?? 0) > 5 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : 'Show All'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  )
}
