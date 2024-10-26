/*
 Copyright 2022 Google LLC
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
      https://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// ****************************************************************************
// ENVIRONMENT VARIABLES
// ****************************************************************************
export const {
  // Runtime variables
  PORT,
  EXTERNAL_PORT,
  HOSTNAME,
  DEMO_HOST_PREFIX,

  // Advertisers
  SHOP_HOST,
  SHOP_DETAIL,
  TRAVEL_HOST,
  TRAVEL_DETAIL,

  // Publishers
  NEWS_HOST,
  NEWS_DETAIL,
  MOTO_NEWS_HOST,
  SOCCER_NEWS_HOST,
  GARDENING_HOST,

  // Ad-techs
  DSP_HOST,
  DSP_DETAIL,
  DSP_URI,

  DSP_A_HOST,
  DSP_A_DETAIL,
  DSP_A_URI,

  DSP_B_HOST,
  DSP_B_DETAIL,
  DSP_B_URI,

  SSP_HOST,
  SSP_DETAIL,
  SSP_URI,

  SSP_A_HOST,
  SSP_A_DETAIL,
  SSP_A_URI,

  SSP_B_HOST,
  SSP_B_DETAIL,
  SSP_B_URI,

  AD_SERVER_HOST,
  AD_SERVER_DETAIL,
  AD_SERVER_URI,
} = process.env;

export const CURRENT_ORIGIN = new URL(
  `https://${HOSTNAME}:${EXTERNAL_PORT}`,
).toString();

// ****************************************************************************
// CONTEXTUAL AUCTION METADATA
// ****************************************************************************
/**
 * Name of the contextual advertiser.
 * This is used in the buyer's bid response to contextual bid requests.
 */
export const ADVERTISER_CONTEXTUAL = 'ContextNext';
/** Max bid CPM for contextual auctions. */
export const MAX_CONTEXTUAL_BID = 1.5;
/** Min bid CPM for contextual auctions. */
export const MIN_CONTEXTUAL_BID = 0.5;

// ****************************************************************************
// ADVERTISER METADATA
// ****************************************************************************
/**
 * Map of SHOP advertiser's item metadata. Map contains item labels indexed by
 * itemId.
 * This is currently used to initialize the sellers's BYOS key-value store for
 * the Protected Audience seller's realtime creative scoring signals use-case.
 */
export const KNOWN_SHOP_ITEM_LABELS_BY_ID = {
  '1f45e': "Man's brown shoe",
  '1f45f': 'Blue running shoe',
  '1f460': 'Red high-heeled shoe',
  '1f461': "Woman's sandal",
  '1f462': "Woman's boot",
  '1f6fc': 'Roller skate',
  '1f97e': 'Hiking boot',
  '1f97f': 'Blue flat shoe',
  '1fa70': 'Ballet shoes',
  '1fa74': 'Thong sandal',
  '1f3bf': 'Ski boots',
  '26f8': 'Ice skate',
};

// ****************************************************************************
// PROTECTED AUDIENCE RENDER URL MACROS
// ****************************************************************************
/**
 * This macro is used with render URLs for display ads, where AD_WIDTH and
 * AD_HEIGHT are natively supported macros in Protected Audience. These macros
 * may be specified in either formats: ${...} or {%...%}
 *
 * For the macro replacement to work, the SSP needs to request an ad size in
 * the auction configuration and the DSP needs to specify the ad size with the
 * bid. The values returned by the DSP are used for macro replacements. These
 * values need not match the size requested by the SSP. Regardless of whether
 * the ad size included in the DSP's bid matches the ad size requested by the
 * SSP, the decision is made via the SSP's scoring logic. Both the requested
 * and the response ad sizes are accessible the SSP's scoreAd().
 */
export const MACRO_DISPLAY_RENDER_URL_AD_SIZE =
  'adSize1={%AD_WIDTH%}x{%AD_HEIGHT%}&adSize2=${AD_WIDTH}x${AD_HEIGHT}';

/**
 * This macro is used in render URLs for video ads, where SSP_VAST is a custom
 * macro included in the SSP's component auction configuration. At render time,
 * this macro will be replaced with the winning SSP's VAST XML endpoint. This
 * SSP endpoint returns a wrapped VAST XML for a given DSP VAST XML and
 * auction ID.
 */
export const MACRO_VIDEO_RENDER_URL_SSP_VAST =
  'sspVast=${SSP_VAST}&sspVastAlt=%%SSP_VAST%%';

// ****************************************************************************
// INTEGRATION CONFIGURATIONS
// ****************************************************************************
/**
 * Map of buyers to integrate with indexed by sellers.
 * This is meant to showcase business relationships between buyers and sellers.
 * When a buyer is integrated with the seller, the seller sends contextual bid
 * requests to the buyer and includes the buyer as an interest group buyer in
 * its Protected Audience component auction config.
 */
export const BUYER_HOSTS_TO_INTEGRATE_BY_SELLER_HOST = new Map([
  // ad-server -> dsp + dsp-a + dsp-b
  [AD_SERVER_HOST!, [DSP_HOST!, DSP_A_HOST!, DSP_B_HOST!]],
  // ssp -> dsp-a + dsp-b
  [SSP_HOST!, [DSP_A_HOST!, DSP_B_HOST!]],
  // ssp-a -> dsp + dsp-a
  [SSP_A_HOST!, [DSP_HOST!, DSP_A_HOST!]],
  // ssp-b -> dsp + dsp-b
  [SSP_B_HOST!, [DSP_HOST!, DSP_B_HOST!]],
]);