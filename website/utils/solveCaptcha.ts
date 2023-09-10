import { type Page } from 'puppeteer';

export async function solver(page: Page) {
    return await page.evaluate(async () => {
        function qSelector<T = HTMLElement>(selector: string): T | null {
            return (
                ((
                    document.querySelector('iframe[src*="api2/anchor"]') as HTMLIFrameElement
                )?.contentWindow?.document.querySelector(selector) as T) ?? null
            );
        }

        function ifqSelector<T = HTMLElement>(selector: string): T | null {
            return (
                ((
                    document.querySelector('iframe[src*="api2/bframe"]') as HTMLIFrameElement
                )?.contentWindow?.document.querySelector(selector) as T) ?? null
            );
        }

        let error = undefined;
        let solved: boolean = false;
        let checkBoxClicked = false;
        let waitingForAudioResponse = false;

        //Node Selectors
        const CHECK_BOX = '.recaptcha-checkbox-border';
        const AUDIO_BUTTON = '#recaptcha-audio-button';
        const AUDIO_SOURCE = '#audio-source';
        const IMAGE_SELECT = '#rc-imageselect';
        const RESPONSE_FIELD = '.rc-audiochallenge-response-field';
        const AUDIO_ERROR_MESSAGE = '.rc-audiochallenge-error-message';
        const AUDIO_RESPONSE = '#audio-response';
        const RELOAD_BUTTON = '#recaptcha-reload-button';
        const RECAPTCHA_STATUS = '#recaptcha-accessible-status';
        const DOSCAPTCHA = '.rc-doscaptcha-body';
        const VERIFY_BUTTON = '#recaptcha-verify-button';
        const MAX_ATTEMPTS = 5;

        let requestCount = 0;
        let recaptchaLanguage = qSelector('html')?.getAttribute('lang') ?? '';
        let audioUrl = '';
        const recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS)?.innerText : '';
        const serversList = ['https://engageub.pythonanywhere.com', 'https://engageub1.pythonanywhere.com'];

        const latencyList = Array(serversList.length).fill(10000);
        //Check for visibility && Click the check box
        function isHidden(el: HTMLElement | null) {
            return !el || el.offsetParent === null;
        }

        function fetchWithTimeout(url: string, options: RequestInit, timeout?: number): Promise<Response> {
            return new Promise<Response>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Request timeout'));
                }, timeout ?? 30000);

                fetch(url, options)
                    .then(response => {
                        clearTimeout(timeoutId);
                        resolve(response);
                    })
                    .catch(error => {
                        clearTimeout(timeoutId);
                        reject(error);
                    });
            });
        }

        async function getTextFromAudio(URL: string) {
            let minLatency = 100000;
            let url = '';

            //Selecting the last/latest server by default if latencies are equal
            for (let k = 0; k < latencyList.length; k++) {
                if (latencyList[k] <= minLatency) {
                    minLatency = latencyList[k];
                    url = serversList[k];
                }
            }

            requestCount = requestCount + 1;
            URL = URL.replace('recaptcha.net', 'google.com');
            if (recaptchaLanguage.length < 1) {
                recaptchaLanguage = 'en-US';
            }

            const requestOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `input=${encodeURIComponent(URL)}&lang=${recaptchaLanguage}`,
            };

            fetchWithTimeout(url, requestOptions, 15000)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(responseText => {
                    try {
                        if (responseText) {
                            // Validate Response for error messages or html elements
                            if (
                                responseText === '0' ||
                                responseText.includes('<') ||
                                responseText.includes('>') ||
                                responseText.length < 2 ||
                                responseText.length > 50
                            ) {
                                // Invalid Response, Reload the captcha
                            } else if (
                                !!ifqSelector(AUDIO_SOURCE) &&
                                !!ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src &&
                                audioUrl === ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src &&
                                !!ifqSelector(AUDIO_RESPONSE) &&
                                !ifqSelector<HTMLInputElement>(AUDIO_RESPONSE)?.value &&
                                !!ifqSelector(VERIFY_BUTTON)
                            ) {
                                (ifqSelector(AUDIO_RESPONSE) as HTMLInputElement).value = responseText;
                                ifqSelector(VERIFY_BUTTON)?.click();
                            }

                            waitingForAudioResponse = false;
                        }
                    } catch (err: any) {
                        console.error(err?.message);
                        console.error('Exception handling response. Retrying..');
                        waitingForAudioResponse = false;
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    waitingForAudioResponse = false;
                });
        }

        async function pingTest(url: string) {
            const start = new Date().getTime();
            const requestOptions: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: '', // O corpo precisa ser uma string vazia para corresponder ao axios.data=""
            };

            fetchWithTimeout(url, requestOptions, 15000)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // Se desejar, pode usar response.json() se a resposta for JSON
                })
                .then(data => {
                    if (!!data && data === '0') {
                        const end = new Date().getTime();
                        const milliseconds = end - start;
                        // Para valores grandes, use um HashMap
                        for (let i = 0; i < serversList.length; i++) {
                            if (url === serversList[i]) {
                                latencyList[i] = milliseconds;
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        if (qSelector(CHECK_BOX)) {
            qSelector(CHECK_BOX)?.click();
        } else if (window.location.href.includes('bframe')) {
            serversList.forEach(element => {
                pingTest(element);
            });
        }

        //Solve the captcha using audio
        const startInterval = setInterval(() => {
            try {
                //Click the check box
                if (!checkBoxClicked && !!qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
                    qSelector(CHECK_BOX)?.click();
                    checkBoxClicked = true;
                }

                //Check if the captcha is solved
                if (
                    !!qSelector(RECAPTCHA_STATUS) &&
                    qSelector(RECAPTCHA_STATUS)?.innerText !== recaptchaInitialStatus
                ) {
                    solved = true;
                    clearInterval(startInterval);
                }

                if (requestCount > MAX_ATTEMPTS) {
                    console.error('Attempted Max Retries. Stopping the solver');

                    error = true;
                    clearInterval(startInterval);
                }

                if (!solved) {
                    if (
                        !!ifqSelector(AUDIO_BUTTON) &&
                        !isHidden(ifqSelector(AUDIO_BUTTON)) &&
                        !!ifqSelector(IMAGE_SELECT)
                    ) {
                        ifqSelector(AUDIO_BUTTON)?.click();
                    }

                    if (
                        (!waitingForAudioResponse &&
                            !!ifqSelector(AUDIO_SOURCE) &&
                            !!ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src &&
                            (ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src.length ?? 0) > 0 &&
                            audioUrl === ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src &&
                            ifqSelector(RELOAD_BUTTON)) ||
                        (ifqSelector(AUDIO_ERROR_MESSAGE) &&
                            (ifqSelector(AUDIO_ERROR_MESSAGE)?.innerText?.length ?? 0) > 0 &&
                            ifqSelector(RELOAD_BUTTON) &&
                            !ifqSelector<HTMLButtonElement>(RELOAD_BUTTON)?.disabled)
                    ) {
                        ifqSelector(RELOAD_BUTTON)?.click();
                    } else if (
                        !waitingForAudioResponse &&
                        ifqSelector(RESPONSE_FIELD) &&
                        !isHidden(ifqSelector(RESPONSE_FIELD)) &&
                        !ifqSelector<HTMLInputElement>(AUDIO_RESPONSE)?.value &&
                        ifqSelector(AUDIO_SOURCE) &&
                        ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src &&
                        (ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src.length ?? 0) > 0 &&
                        audioUrl !== ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src &&
                        requestCount <= MAX_ATTEMPTS
                    ) {
                        waitingForAudioResponse = true;
                        audioUrl = ifqSelector<HTMLAudioElement>(AUDIO_SOURCE)?.src ?? '';
                        getTextFromAudio(audioUrl);
                    }
                }

                //Stop solving when Automated queries message is shown
                if (qSelector(DOSCAPTCHA) && (qSelector(DOSCAPTCHA)?.innerText.length ?? 0) > 0) {
                    console.error('Automated Queries Detected');

                    error = true;
                    clearInterval(startInterval);
                }
            } catch (err: any) {
                console.error(err?.message);
                console.error('An error occurred while solving. Stopping the solver.');

                error = true;
                clearInterval(startInterval);
            }
        }, 5000);

        while (!solved && error === undefined) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return solved;
    });
}
