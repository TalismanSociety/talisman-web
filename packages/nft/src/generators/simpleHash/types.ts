export type Chain = {
  chain: string
  eip155_network_id: number
  is_testnet: boolean
}

type Preview = {
  image_small_url: string
  image_medium_url: string
  image_large_url: string
  image_opengraph_url: string
  blurhash: string
  predominant_color: string
}

type ImageProperties = {
  width: number
  height: number
  size: number
  mime_type: string
}

type Owner = {
  owner_address: string
  quantity: number
  quantity_string: string
  first_acquired_date: string
  last_acquired_date: string
}

type Contract = {
  type: string
  name: string
  symbol: string
  deployed_by: string
  deployed_via_contract: null
  owned_by: string
  has_multiple_collections: boolean
}

type MarketplacePage = {
  marketplace_id: string
  marketplace_name: string
  marketplace_collection_id: string
  nft_url: string
  collection_url: string
  verified: boolean
}

type Collection = {
  collection_id: string
  name: string
  description: null | string
  image_url: string
  image_properties: ImageProperties
  banner_image_url: null | string
  category: null | string
  is_nsfw: boolean
  external_url: null | string
  twitter_username: null | string
  discord_url: null | string
  instagram_username: null | string
  medium_username: null | string
  telegram_url: null | string
  marketplace_pages: MarketplacePage[]
  metaplex_mint: null
  metaplex_candy_machine: null
  metaplex_first_verified_creator: null
  floor_prices: any[]
  top_bids: any[]
  distinct_owner_count: number
  distinct_nft_count: number
  total_quantity: number
  chains: string[]
  top_contracts: string[]
  collection_royalties: any[]
}

type FirstCreated = {
  minted_to: string
  quantity: number
  quantity_string: string
  timestamp: string
  block_number: number
  transaction: string
  transaction_initiator: string
}

type RoyaltyRecipient = {
  source: string
  total_creator_fee_basis_points: number
  recipients: any[]
}

type ExtraMetadata = {
  attributes: {
    trait_type: string
    value: string
    display_type: null | string
  }[]
  image_original_url: string
  animation_original_url: null | string
  metadata_original_url: string
}

export type Nft = {
  nft_id: string
  chain: string
  contract_address: string
  token_id: string
  name: string
  description: string
  previews: Preview
  image_url: string
  image_properties: ImageProperties
  video_url: null | string
  video_properties: null
  audio_url: null | string
  audio_properties: null
  model_url: null | string
  model_properties: null
  other_url: null | string
  other_properties: null
  background_color: null | string
  external_url: null | string
  created_date: string
  status: string
  token_count: number
  owner_count: number
  owners: Owner[]
  contract: Contract
  collection: Collection | null
  last_sale: null
  first_created: FirstCreated
  rarity: {
    rank: null | string
    score: null | string
    unique_attributes: null
  }
  royalty: RoyaltyRecipient[]
  extra_metadata: ExtraMetadata
}
