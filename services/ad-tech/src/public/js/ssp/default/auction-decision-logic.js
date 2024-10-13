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

/**
 * Where is this script used:
 *   This is the 'default' auction decision logic for an SSP.
 *
 * What does this script do:
 *   This script is referenced in auction configurations to choose among bids
 *   in a Protected Audience auction.
 */

// ********************************************************
// Helper Functions
// ********************************************************
CURR_HOST = '';
/** Logs to console. */
function log(msg, context) {
  console.log('[PSDemo] Seller', CURR_HOST, 'decision logic', msg, {context});
}

// ********************************************************
// Top-level decision logic functions
// ********************************************************
function scoreAd(
  adMetadata,
  bid,
  auctionConfig,
  trustedScoringSignals,
  browserSignals,
) {
  CURR_HOST = auctionConfig.seller.substring('https://'.length);
  if (auctionConfig.componentAuctions) {
    CURR_HOST = `Top-level seller ${CURR_HOST}`;
  }
  log('scoring ad', {
    adMetadata,
    bid,
    auctionConfig,
    trustedScoringSignals,
    browserSignals,
  });
  const {renderURL} = browserSignals;
  if (trustedScoringSignals && trustedScoringSignals.renderURL[renderURL]) {
    const parsedScoringSignals = JSON.parse(
      trustedScoringSignals.renderURL[renderURL],
    );
    if (
      parsedScoringSignals &&
      'BLOCKED' === parsedScoringSignals.label.toUpperCase()
    ) {
      log('rejecting bid blocked by publisher', {
        parsedScoringSignals,
        trustedScoringSignals,
        renderURL,
        buyer: browserSignals.interestGroupOwner,
        dataVersion: browserSignals.dataVersion,
      });
      return {
        // Reject bid if creative is blocked.
        desirability: 0,
        allowComponentAuction: true,
        rejectReason: 'blocked-by-publisher',
      };
    }
  }
  const {buyerAndSellerReportingId, selectedBuyerAndSellerReportingId} =
    browserSignals;
  log('found reporting IDs', {
    buyerAndSellerReportingId,
    selectedBuyerAndSellerReportingId,
  });
  return {
    desirability: bid,
    allowComponentAuction: true,
    // incomingBidInSellerCurrency: optional
  };
}

function reportResult(auctionConfig, browserSignals) {
  CURR_HOST = auctionConfig.seller.substring('https://'.length);
  let auctionId;
  if (auctionConfig.componentAuctions) {
    CURR_HOST = `Top-level seller ${CURR_HOST}`;
    const winningComponentSeller = browserSignals.componentSeller;
    auctionId = auctionConfig.componentAuctions.filter(
      (componentAuction) => winningComponentSeller === componentAuction.seller,
    )[0].auctionSignals.auctionId;
  } else {
    auctionId = auctionConfig.auctionSignals.auctionId;
  }
  log('reporting result', {auctionConfig, browserSignals});
  sendReportTo(auctionConfig.seller + '/reporting?report=result');
  return {
    success: true,
    auctionId,
    buyer: browserSignals.interestGroupOwner,
    reportUrl: auctionConfig.seller + '/reporting',
    signalsForWinner: {signalForWinner: 1},
  };
}
