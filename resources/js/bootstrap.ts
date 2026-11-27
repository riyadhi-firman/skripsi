import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        axios: typeof axios;
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Pusher = Pusher;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY || 'ubj_nms_key';
const envHost = import.meta.env.VITE_REVERB_HOST;
const isBrowser = typeof window !== 'undefined' && Boolean(window.location?.hostname);
const reverbHost = isBrowser
    ? (envHost && envHost !== 'localhost' && envHost !== '127.0.0.1' ? envHost : window.location.hostname)
    : (envHost || 'localhost');
const reverbPort = import.meta.env.VITE_REVERB_PORT || '8080';
const reverbScheme = isBrowser && window.location.protocol === 'https:'
    ? 'https'
    : (import.meta.env.VITE_REVERB_SCHEME || 'http');

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: Number(reverbPort),
    wssPort: Number(reverbPort),
    forceTLS: reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
});
