/**
 * Google Analytics Event Tracking Utility
 */

export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    console.warn(`Analytics: gtag not initialized. Event ${eventName} skipped.`);
  }
};

export const trackPageView = (path) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'G-FWFW8TT3TV', {
      page_path: path,
    });
  }
};
