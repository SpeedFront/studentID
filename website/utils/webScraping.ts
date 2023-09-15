import { PuppeteerLaunchOptions } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';
import chromium from '@sparticuz/chromium-min';

puppeteer.use(StealthPlugin());

export async function newPage(
    url: string,
    sessionid?: { value: string; expires: Date | number },
    args?: PuppeteerLaunchOptions,
) {
    const localOptions: PuppeteerLaunchOptions = {
        headless: process.env.NODE_ENV !== 'development' ? false : 'new',
        args: [
            '--allow-external-pages',
            '--allow-third-party-modules',
            '--data-reduction-proxy-http-proxies',
            '--disable-web-security',
            '--enable-automation',
            '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
            '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
        ],
        ...args,
        executablePath: puppeteer.executablePath(),
    };

    let options: PuppeteerLaunchOptions = localOptions;

    if (process.env.USE_SERVER_CHROMIUM === 'true' || process.env.NODE_ENV !== 'development') {
        options = {
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            ...args,
            executablePath: await chromium.executablePath(
                `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`,
            ),
        };
    }

    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    if (sessionid) {
        const { value, expires } = sessionid;

        await page.setCookie({
            name: 'sessionid',
            value,
            domain: 'suap.ifpb.edu.br',
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            expires: expires instanceof Date ? Math.floor(expires.getTime() / 1000) : expires,
        });
    }

    await page.goto(url);

    return { page, browser };
}
