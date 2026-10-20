import {HOSTED_URL} from '../dist/run-anywhere.js';
import {openBrowser} from './open-browser.mjs';
console.log(`Hosted Fieldwork: ${HOSTED_URL}`);
openBrowser(HOSTED_URL);
