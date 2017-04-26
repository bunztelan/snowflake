/**
 * # BackendFactory
 *
 * This class sets up the backend by checking the config.js
 *
 */
'use strict'

import CONFIG from './config'
import {ProofnApi} from './ProofnApi'

export default function BackendFactory (token = null) {
  ProofnApi.initialize(token);
  return ProofnApi;
}
