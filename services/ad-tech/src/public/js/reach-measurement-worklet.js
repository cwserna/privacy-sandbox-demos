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
 *   This script is included in Shared Storage Reach Measurement, and is executed
 *   when an ad is delivered by this ad-tech on a publisher page.
 *
 * What does this script do:
 *
 * This script utilizes the shared storage key "has-reported-content" to identify
 * browsers that have previously contributed to Aggrigations reports for the given contentId.
 *
 * If the browser has NOT previously contributed to the Aggregation report,  the "privateAggregation.contributeToHistogram" functun is called.
 */

console.log(
  'Loading . . . services/ad-tech/src/public/js/reach-measurement-worklet.js',
);

// Learn more about noise and scaling from the Private Aggregation fundamentals
// documentation on Chrome blog
const SCALE_FACTOR = 1; // max 65536

function convertContentIdToBucket(contentId) {
  return BigInt(contentId);
}

/* 
Using Aggrigation key method documented here : 
https://developers.google.com/privacy-sandbox/private-advertising/private-aggregation/fundamentals#aggregation-key

we convert our data into a key 

Expected data format 
Content ID (first 4 digits) | Geo ID  (next 3 digits)  | Creative ID (last 5 digits)

ex 012323610055

Content ID  | Geo ID  | Creative ID
0123           236       10055

EX
data: {
      contentId: 1234, /// 4 digit campaign id
      geo: 236, //  3 digit GEO Identifier
      creativeId: 10055,  // 5 digit creative id
    },

**/
async function convertToBucket(data) {
  return data.contentId + data.geo + data.creativeId;
}

class ReachMeasurementOperation {
  async run(data) {
    console.log('data:  ', data);
    // Generate the aggregation key and the aggregatable value
    const bucket = await convertToBucket(data);
    const value = 1 * SCALE_FACTOR;

    console.log('bucket:', bucket);

    /**** Setting Debug */
    privateAggregation.enableDebugMode();

    // Read from Shared Storage
    const key = 'has-reported-content: ' + bucket;
    const hasReportedContent = (await sharedStorage.get(key)) === 'true';

    // const hasReportedContent = false;
    // console.log(' ******* SHARED STORGE CHECK OVERIDE ')

    // Do not report if a report has been sent already
    if (hasReportedContent) {
      console.log('Bucket ID already seen:  ' + key);
      return;
    } else {
      // Send an aggregatable report via the Private Aggregation API
      console.log('contributeToHistogram:');
      privateAggregation.contributeToHistogram({bucket, value});
      // Set the report submission status flag
      console.log('Shared Storage key ' + key + ' stored');
      await sharedStorage.set(key, true);
    }
  }
}

// Register the operation
register('reach-measurement', ReachMeasurementOperation);
