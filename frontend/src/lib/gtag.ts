export const GA_TRACKING_ID = 'AW-10778063853';

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
        gtag?: (...args: unknown[]) => void;
    }
}

export const SIMULADOR_STEP_NAMES: Record<number, string> = {
    1: 'dados',
    2: 'servicos',
    3: 'configuracao',
    4: 'custos',
    5: 'proposta',
};

export function pushDataLayer(payload: Record<string, unknown>) {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
}

export function trackSimuladorStep(step: number) {
    const name = SIMULADOR_STEP_NAMES[step] || `step_${step}`;
    pushDataLayer({
        event: `simulador_${name}`,
        simulador_step: step,
        simulador_step_name: name,
    });
}

export function trackSimuladorComplete(params?: { id?: string; value?: number }) {
    pushDataLayer({
        event: 'simulador_complete',
        simulador_id: params?.id,
        value: params?.value,
        currency: 'BRL',
    });
}

export function trackSimuladorAction(action: 'pdf' | 'whatsapp', id?: string) {
    pushDataLayer({
        event: `simulador_${action}`,
        simulador_id: id,
    });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action: string, { category, label, value, send_to }: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
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
