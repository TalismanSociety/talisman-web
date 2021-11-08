// Import the API, Keyring and some utility functions
import { ApiPromise, WsProvider } from '@polkadot/api';
import {  u8aToHex } from '@polkadot/util';
import axios from 'axios';
// import { readFile } from 'fs/promises'  // don't need.
import * as crypto from 'crypto';
import moonbeamStatement from './moonbeamStatement';

const WS_URL = 'wss://wss.polkatrain.moonbeam.network';
const API_URL = 'https://wallet-test.api.purestake.xyz';
const HEADERS = {
  'headers': {
    'x-api-key': 'APIKEY HERE'
  }
};

const MNEMONIC = 'MNEMONIC HERE';


async function agreeRemark(address, signedMessage) {
  console.log('Calling /agree-remark', address, signedMessage);

  return await axios.post(API_URL + '/agree-remark', {
    'address': address,
    'signed-message': signedMessage,
  }, HEADERS);
}


async function sendRemark(api, pair, content, callback) {
  const remarkExtrinsic = api.tx.system.remark(content);

  console.log('Sending remark extrinsic and waiting for finalization')
  const hash = await remarkExtrinsic.signAndSend(pair, ({ status }) => {
    // Wait until block is finalized!
    if (status.isFinalized) {
      console.log('Extrinsic in finilized block');
      callback(pair.address, remarkExtrinsic.hash.toHex(), status.asFinalized.toHex());
    };
  });
}


async function verifyRemark(address, extrinsicHash, blockHash) {
  console.log('Calling /verify-remark', address, extrinsicHash, blockHash);

  const response = await axios.post(API_URL + '/verify-remark', {
    'address': address,
    'extrinsic-hash': extrinsicHash,
    'block-hash': blockHash,
  }, HEADERS);

  console.log('verified', response.data.verified);
  process.exit(1);
}


export async function submitTermsAndConditions() {

  // Initialize API
  const wsProvider = new WsProvider(WS_URL);
  var api = await ApiPromise.create({ provider: wsProvider });

  // TODO: get keypair
  const pair = {address: '0xYeet', sign: () => console.log('blahhh')}

  // First we need to accept the terms
  const hash = crypto.createHash('sha256').update(moonbeamStatement).digest('hex');
  const signedMessage = u8aToHex(pair.sign(hash));

  const agreementResponse = await agreeRemark(pair.address, signedMessage);

  // Send the remark and then verify it
  const sendRemarkResponse = sendRemark(api, pair, agreementResponse.data.remark, verifyRemark);

  return sendRemarkResponse
}