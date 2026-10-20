import {HOSTED_URL} from '../dist/run-anywhere.js';
import {openBrowser} from './open-browser.mjs';
if(!HOSTED_URL){console.error('No hosted Site configured yet. Publish your new-account copy, then run npm run configure:hosted -- --url YOUR_SITE_URL.');process.exit(1);}
console.log(`Hosted Fieldwork: ${HOSTED_URL}`);
openBrowser(HOSTED_URL);
