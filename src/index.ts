import ABTest from './AB/ABTest';
import { IEvent } from './AB/IEvent';
import Variation from './AB/Variation';

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        _paq: any[];
    }
}

export default class Matomo {
    public static default(): Matomo {
        if (!Matomo.instance) {
            Matomo.instance = new Matomo();
        }
        return Matomo.instance;
    }
    private static instance: Matomo;

    private previousUri?: string = null;
    private previousTitle?: string = null;

    /**
     * Try to call the init method as soon as possible in the project
     */
    public init(
        trackerUrl: string,
        siteId: string,
        {
            domains,
            cookieDomain,
            crossDomainLinking = true,
            async = true,
            srcUri = '//cdnjs.cloudflare.com/ajax/libs/piwik/3.8.1/piwik.js',
        }: {
            domains?: string[];
            cookieDomain?: string;
            crossDomainLinking?: boolean;
            async?: boolean;
            srcUri?: string;
        } = {},
    ): void {
        if (window) {
            window._paq = window._paq || [];

            if (cookieDomain) {
                this.push(['setCookieDomain', cookieDomain]);
            }
            if (domains) {
                this.push(['setDomains', domains]);
            }
            if (crossDomainLinking) {
                this.push(['enableCrossDomainLinking']);
            }

            this.push(['enableHeartBeatTimer']);

            (() => {
                this.push(['setTrackerUrl', `${trackerUrl}${trackerUrl.endsWith('/') ? '' : '/'}piwik.php`]);
                this.push(['setSiteId', siteId]);
                const d = window.document;
                const g = d.createElement('script');
                const s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                if (async) {
                    g.async = true;
                    g.defer = true;
                }
                g.src = srcUri;
                s.parentNode.insertBefore(g, s);
            })();
        } else {
            throw new Error(
                "Window context is undefined, make sure you're calling this in a web-browser aware environment.",
            );
        }
    }

    public push(args: any[]): void {
        if (window._paq) { 
            window._paq.push(args);
        }
    }

    public setUserId(userId: string): void {
        this.push(['setUserId', userId]);
    }

    public resetUserId(): void {
        this.push(['resetUserId']);
    }

    public setReferrerUrl(referrerUrl: string): void {
        this.push(['setReferrerUrl', referrerUrl]);
    }

    /**
     * If the last tracked uri and name are identical the page will not be tracked
     * This prevent multiple calls when using a components based frameworks
     * where the lifecycle tend to refresh the DOM very often
     */
    public trackPageView(name?: string): void {
        const uri = window.document.documentURI;
        const title = name ? name : window.document.title;

        if (uri === this.previousUri && title === this.previousTitle) {
            // Safety to not log multiple times the same pageview
            // Useful w/ React-like framework
            return;
        }

        this.push(['setCustomUrl', uri]);
        this.push(['setDocumentTitle', window.document.domain + '/' + title]);
        if (this.previousUri) {
            this.push(['setGenerationTimeMs', 0]);
        }
        this.push(['trackPageView']);

        this.previousUri = uri;
        this.previousTitle = title;
    }

    /**
     * If you are looking after outlinks tracking this method should be called after every DOM updates.
     */
    public trackLinks(): void {
        this.push(['enableLinkTracking']);
    }

    public trackEvent(category: string, action: string, opt?: { name?: string; value?: number }): void {
        const event: any[] = ['trackEvent', category, action];
        if (opt) {
            if (opt.name) {
                event.push(opt.name);
            }
            if (opt.value) {
                if (!opt.name) {
                    event.push('');
                }
                event.push(opt.value);
            }
        }
        this.push(event);
    }

    public trackEcommerceOrder(orderId: string, grandTotal: number): void {
        const event: any[] = ['trackEcommerceOrder', orderId, grandTotal];
        this.push(event);
    }

    public trackABTest(abTest: ABTest): void {
        abTest.start(this);
    }
}

export { ABTest, Variation, IEvent };
