import { createApp } from '/web_modules/@ubio/sdk-application-bundle/bundle.js';
import CONFIG from './src/ubio.config.js';

const app = createApp(CONFIG, () => console.log('finished!'));
app.init();
