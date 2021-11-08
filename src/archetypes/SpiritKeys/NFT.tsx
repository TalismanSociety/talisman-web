import { ChainLogo, ExtensionStatusGate, Info, Panel, PanelSection, Pendor } from '@components'
import { calculateAssetPortfolioAmounts, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useExtension } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import {
  BalanceWithTokens,
  BalanceWithTokensWithPrice,
  addPriceToTokenBalances,
  addTokensToBalances,
  groupBalancesByChain,
  useBalances,
  useChain,
} from '@talismn/api-react-hooks'
import { addBigNumbers, useFuncMemo } from '@talismn/util'
import { formatCommas, formatCurrency } from '@util/helpers'
import { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import {NFTConsolidated} from 'rmrk-tools/dist/tools/consolidator/consolidator';
import { encodeAnyAddress } from '@talismn/util'


const customRpcs = {
  '0': [], // ['wss://polkadot.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Polkadot Relay
  '2': [], // ['wss://kusama.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Kusama Relay
  '1000': [], // ['wss://statemine.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Statemine
  '2000': [], // ['wss://karura.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Karura
  '2001': [], // ['wss://bifrost-parachain.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Bifrost
  '2004': [], // ['wss://khala.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Khala
  '2007': [], // ['wss://shiden.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Shiden
  '2023': [], // ['wss://moonriver.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Moonriver
  '2084': [], // Calamari
  '2086': [], // KILT Spiritnet
  '2090': [
    'wss://basilisk.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4',
    'wss://rpc-01.basilisk.hydradx.io',
  ], // Basilisk
}


export const fetchNFTData = async (setNfts: (nfts: NFTConsolidated[]) => void, addresses: string[]) => {
  try {
   console.log('addresses sent', addresses);
    let dataTotal: NFTConsolidated[] = []
    for await (const address of addresses){
      console.log(address)
      const payload = await fetch(`https://singular.rmrk.app/api/rmrk1/account/${address}`);
      const nftData: NFTConsolidated[] = await payload.json();
      dataTotal = dataTotal.concat(nftData);
      console.log('nftdata',dataTotal)
      for await(const nft of dataTotal) {
        nft.account = address
      }
    }
    dataTotal = dataTotal.filter(nft => nft.collectionId === 'b6e98494bff52d3b1e-SPIRIT'); 
    
   for await (const nft of dataTotal) {
      const payload = await fetch(nft.metadata!.replace('ipfs://', 'https://rmrk.mypinata.cloud/'));
      const metadata: PinataObject = await payload.json();
      nft.image = metadata.image
      nft.data = metadata
      nft.collection = nft.collectionId
   };
    
    console.log("data",dataTotal)
    if (dataTotal){
      dataTotal = dataTotal.sort((n1,n2) => {
        if (n1.sn > n2.sn) {
            return 1;
        }else{
          return -1;
        }
      });
    
      setNfts(dataTotal);
    }
  } catch (error: any) {
    console.log(error);
  }
};

export interface PinataObject {
  image: string;
  name: string;
  description: string;
  external_url: string;
};


