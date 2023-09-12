import { type Page } from 'puppeteer';
import { readFile, unlink } from 'fs/promises';
import { downloadFile } from '@/utils/files';
import { newPage } from '@/utils/webScraping';

export interface UserData {
    registration: string;
    name: string;
    email: string;
    avatar: string;
    phoneNumber?: string;
}

export interface MedicalInfo {
    bloodType: string;
    allergies: string[];
    diseases: string[];
    medications: string[];
}

export async function getUserData(sessionid: { value: string; expires: Date | number }, withMedicalInfo = false) {
    const { page, browser } = await newPage('https://suap.ifpb.edu.br/', sessionid);

    try {
        await page.waitForNetworkIdle();
        await page.click('#link-1-meus-dados > a');
        await page.waitForXPath('//*[@id="content"]/div[3]/div/table/tbody/tr[2]/td[6]', { timeout: 5000 });

        const registrationHandle = await page.$x('//*[@id="content"]/div[3]/div/table/tbody/tr[2]/td[6]');
        const nameHandle = await page.$x('//*[@id="content"]/div[3]/div/table/tbody/tr[2]/td[2]');
        const emailHandle = await page.$x('//*[@id="content"]/div[4]/div[4]/div/table/tbody/tr[3]/td[4]');
        const phoneNumberHandle = await page.$x('//*[@id="content"]/div[4]/div[4]/div/table/tbody/tr[2]/td[2]');

        const registration = await page.evaluate(el => el.textContent, registrationHandle[0]);
        const name = await page.evaluate(el => el.textContent, nameHandle[0]);
        const email = await page.evaluate(el => el.textContent, emailHandle[0]);

        if (!registration || !name || !email) {
            await browser.close();
            return;
        }

        let avatar = await page.evaluate(() => {
            return document
                .querySelector('#content > div.box > div > table > tbody > tr:nth-child(1) > td > div > img')
                ?.getAttribute('src')
                ?.replace('/', '');
        });

        if (avatar) {
            const path = `./public/temp/avatars/${registration}.jpg`;
            await downloadFile(avatar, path);

            const img = await readFile(path).catch(() => undefined);
            await unlink(path);

            if (!img) {
                avatar = undefined;
            } else {
                avatar = Buffer.from(img).toString('base64');
            }
        }

        const phoneNumber = await page
            .evaluate(el => el.textContent, phoneNumberHandle[0])
            .then(phoneNumber => {
                if (phoneNumber) {
                    return phoneNumber.split(',')[0];
                }
            });

        const medicalInfo = withMedicalInfo ? await getMedicalInfo(page, registration) : undefined;
        await browser.close();

        return {
            registration,
            name,
            email,
            avatar,
            phoneNumber,
            medicalInfo,
        };
    } catch (e) {
        console.error(e);
        await browser.close();
    }
}

async function getMedicalInfo(page: Page, id: string) {
    const bloodTypeHandle = await page.$x('//*[@id="content"]/div[4]/div[1]/div/table/tbody/tr[2]/td[4]');
    const bloodType = await page.evaluate(el => el.textContent, bloodTypeHandle[0]);

    await page.goto(`https://suap.ifpb.edu.br/edu/aluno/${id}/`);
    await page.waitForNetworkIdle();

    const diseases = await page.evaluate(() => {
        const texts: string[] = [];

        const checkboxes = document.querySelectorAll('#id_doencas_cronicas input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement; // Obtém o elemento <label> pai do <input>
            texts.push(label?.textContent?.trim() ?? ''); // Adiciona o texto ao array
        });

        return texts;
    });

    const deficiencies = await page.evaluate(() => {
        const texts: string[] = [];

        const checkboxes = document.querySelectorAll('#id_deficiencias input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement; // Obtém o elemento <label> pai do <input>
            texts.push(label?.textContent?.trim() ?? ''); // Adiciona o texto ao array
        });

        return texts;
    });

    const medications = await page.evaluate(
        () => document.querySelector('#id_aluno_usa_medicamento_nome')?.getAttribute('value'),
    );

    const useHearingAid =
        (await page.evaluate(
            () => (document.querySelector('#id_usa_aparelho_auditivo') as HTMLInputElement | undefined)?.checked,
        )) ?? false;

    const useWheelchair =
        (await page.evaluate(
            () => (document.querySelector('#id_usa_cadeira_rodas') as HTMLInputElement | undefined)?.checked,
        )) ?? false;

    return {
        bloodType,
        diseases,
        deficiencies,
        medications: (medications?.length ?? 0) > 0 ? medications?.split(',') : [],
        useHearingAid,
        useWheelchair,
    };
}
