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

export async function getUserData(sessionid: { value: string; expires: Date | number }) {
    const { page, browser } = await newPage('https://suap.ifpb.edu.br/', sessionid);

    try {
        await page.waitForNetworkIdle();
        await page.click('#link-1-meus-dados > a');
        await page.waitForXPath('//*[@id="content"]/div[3]/div/table/tbody/tr[2]/td[6]', { timeout: 5000 });

        const registrationHandle = await page.$x('//*[@id="content"]/div[3]/div/table/tbody/tr[2]/td[6]');
        const nameHandle = await page.$x('//*[@id="content"]/div[3]/div/table/tbody/tr[2]/td[2]');
        const emailHandle = await page.$x('//*[@id="content"]/div[4]/div[4]/div/table/tbody/tr[3]/td[4]');
        const avatarHandle = await page.$x('//*[@id="content"]/div[3]/div/table/tbody/tr[1]/td/div/img');
        const phoneNumberHandle = await page.$x('//*[@id="content"]/div[4]/div[4]/div/table/tbody/tr[2]/td[2]');

        const registration = await page.evaluate(el => el.textContent, registrationHandle[0]);
        const name = await page.evaluate(el => el.textContent, nameHandle[0]);
        const email = await page.evaluate(el => el.textContent, emailHandle[0]);
        const avatar = await page.evaluate(el => el, avatarHandle[0].getProperty('src'));
        console.log(avatar);
        const phoneNumber = await page.evaluate(el => el.textContent, phoneNumberHandle[0]);

        await browser.close();
        return {
            registration,
            name,
            email,
            avatar,
            phoneNumber,
        };
    } catch (e) {
        console.error(e);
        await browser.close();
    }
}
