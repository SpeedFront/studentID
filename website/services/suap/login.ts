import { waitForPromiseWithTimeout } from '@/utils/promises';
import { newPage } from '@/utils/webScraping';
import { solver } from '@/utils/solveCaptcha';

export async function suapLogin(username: string, password: string) {
    const url = 'https://suap.ifpb.edu.br/accounts/login/?next=/';
    const { page, browser } = await newPage(url);

    // Preencher os campos de login
    await page.type('#id_username', username);
    await page.type('#id_password', password);

    // Clicar no botão de login
    await page.click('input[type="submit"]');

    let captcha = false;
    if (page.url() === url) {
        await page.waitForNavigation({ timeout: 1000 }).catch(() => {
            captcha = true;
        });
    }

    if (captcha) {
        // Esperar o Captcha ser resolvido
        const solvedCaptcha = await waitForPromiseWithTimeout(solver(page), 30000).catch(e => {
            return (e.toString() as string).includes('Execution context was destroyed');
        });

        if (!solvedCaptcha) {
            await browser.close();
            return { status: 'error', message: 'Captcha não resolvido' };
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Esperar o login ser concluído
    if (page.url() === url) {
        await page.waitForNavigation({ timeout: 5000 }).catch(e => console.error(e));
    }

    // Caso o login tenha sido concluído, retornar o cookie sessionid
    // Capturar o valor do cookie 'sessionid'
    const cookies = await page.cookies();
    const sessionid = page.url() !== url ? cookies.find(cookie => cookie.name === 'sessionid') : undefined;

    await browser.close();

    if (sessionid) {
        return { status: 'success', sessionid };
    } else {
        return { status: 'error', message: 'Credenciais inválidas' };
    }
}
