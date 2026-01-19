import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react";
import { SharedStateProvider } from './SharedStateContext.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.js';

import App from './App.jsx'
import './index.css'

// Sentry activeren
Sentry.init({
    dsn: "https://c46c4a1529354a5e6cb900e73da17033@o4505997486915584.ingest.sentry.io/4505997516210176",

    integrations: [
        Sentry.browserTracingIntegration({
            tracePropagationTargets: [
                "localhost",
                /^http:\/\/localhost:5173/,
                /^https:\/\/thorfgin\.github\.io\/charactercreator\//
            ],
        }),

        Sentry.replayIntegration(),
    ],

    // Performance Monitoring
    tracesSampleRate: 0.5,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});


// Function to handle orientation change
function adjustViewportScale() {
    const viewportMetaTag = document.querySelector('meta[name="viewport"]');
    if (window.matchMedia("(orientation: portrait)").matches) {
        // Portrait orientation: Set initial scale to 1
        viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=0.55');
    } else if (window.matchMedia("(orientation: landscape)").matches) {
        // Landscape orientation: Set initial scale to a different value
        viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
}

// Initial check for orientation
adjustViewportScale();

// Listen for orientation changes
window.addEventListener('resize', adjustViewportScale);

// Function to handle orientation change
function handleOrientationChange() {
    if (window.matchMedia("(orientation: landscape)").matches) {
        // Landscape orientation: Disable scrolling
        document.body.style.overflow = 'auto';
    } else {
        // Portrait orientation: Enable scrolling
        document.body.style.overflow = 'hidden';
    }
}

// Initial check for orientation
handleOrientationChange();

// Listen for orientation changes
window.addEventListener('resize', handleOrientationChange);


ReactDOM.createRoot(document.getElementById('root')).render(
    <SharedStateProvider>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>,
    </SharedStateProvider>
)
