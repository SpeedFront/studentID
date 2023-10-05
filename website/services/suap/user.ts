import { type Page } from 'puppeteer';
import { read, MIME_JPEG } from 'jimp';
import { downloadFile } from '@/utils/files';
import { newPage } from '@/utils/webScraping';
import { unlink } from 'fs/promises';

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
        const phoneNumberHandle = await page.$x('//*[@id="content"]/div[4]/div[4]/div/table/tbody/tr[2]/td[2]');

        const registration = await page.evaluate(el => el.textContent, registrationHandle[0]);
        const name = await page.evaluate(el => el.textContent, nameHandle[0]);
        const email = await page.evaluate(() => {
            const academyEmail = document.querySelector(
                '#content > div:nth-child(6) > div:nth-child(4) > div > table > tbody > tr:nth-child(3) > td:nth-child(2)',
            )?.textContent;

            if (/^[a-zA-Z0-9._%+-]+@academico\.ifpb\.edu\.br$/g.test(academyEmail ?? '')) {
                return document.querySelector(
                    '#content > div:nth-child(6) > div:nth-child(4) > div > table > tbody > tr:nth-child(3) > td:nth-child(4)',
                )?.textContent;
            } else {
                return academyEmail;
            }
        });

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
            const inPath = `./public/temp/avatars/${registration}-in.jpg`;
            const outPath = `./public/temp/avatars/${registration}-out.jpg`;
            await downloadFile(avatar, inPath);

            const img = await resizeAndConvertToBase64(inPath, outPath, MIME_JPEG).catch(() => undefined);

            if (!img) {
                avatar = undefined;
            } else {
                avatar = img.replace(/^data:image\/[^;]+;base64,/, '');
            }
        }

        const phoneNumber = await page
            .evaluate(el => el.textContent, phoneNumberHandle[0])
            .then(phoneNumber => {
                if (phoneNumber) {
                    return phoneNumber.split(',')[0];
                }
            });

        const medicalInfo = withMedicalInfo ? await getMedicalInfo(page) : undefined;
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

async function getMedicalInfo(page: Page) {
    const bloodTypeHandle = await page.$x('//*[@id="content"]/div[4]/div[1]/div/table/tbody/tr[2]/td[4]');
    const bloodType = await page.evaluate(el => el.textContent, bloodTypeHandle[0]);

    await page.goto(
        (await page.evaluate(
            () =>
                (
                    document.querySelector(
                        '#content > ul.action-bar > li:nth-child(1) > ul > li:nth-child(1) > a',
                    ) as HTMLAnchorElement
                )?.href,
        )) ?? 'https://suap.ifpb.edu.br/',
    );
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

async function resizeAndConvertToBase64(inputPath: string, outputPath: string, outputFormat: string): Promise<string> {
    // Carregue a imagem de entrada
    const image = await read(inputPath);

    // Verifique se a imagem possui a proporção 3:4 (ou seja, largura:altura = 3:4)
    if (image.getWidth() / image.getHeight() !== 3 / 4) {
        throw new Error('A imagem de entrada não possui proporção 3:4');
    }

    // Defina as novas dimensões para proporção 1:1 sem distorção
    const newWidth = Math.min(image.getWidth(), image.getHeight());
    const newHeight = newWidth;

    // Redimensione a imagem
    image.crop(0, 0, newWidth, newHeight);

    // Salve a imagem redimensionada
    await image.writeAsync(outputPath);

    // Converta a imagem redimensionada para base64
    const base64Data = await read(outputPath).then(img => {
        return img.getBase64Async(outputFormat);
    });

    // Exclua as imagens de entrada e saída
    await unlink(inputPath);
    await unlink(outputPath);

    return base64Data;
}
