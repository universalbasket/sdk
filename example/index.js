import { createApp } from '../index';
import CONFIG from './ubio.config';

var app = createApp(CONFIG.section, CONFIG.cache, CONFIG.layout, () => { console.log('finished!')});

app.init();
