export const GA_TRACKING_ID = 'AW-10778063853';

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action: string, { category, label, value, send_to }: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
            send_to: send_to,
        });
    }
};

export const reportConversion = (label?: string) => {
    const sendTo = label ? `${GA_TRACKING_ID}/${label}` : GA_TRACKING_ID;
    event('conversion', {
        send_to: sendTo,
    });
};
