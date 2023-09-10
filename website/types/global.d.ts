// Use type safe message keys with `next-intl`
type Messages = typeof import('../translations/en.json');
declare type IntlMessages = Messages;

declare namespace NodeJS {
    declare interface ProcessEnv {
        POSTGRES_URL?: string;
        POSTGRES_PRISMA_URL?: string;
        POSTGRES_URL_NON_POOLING?: string;
        POSTGRES_USER?: string;
        POSTGRES_HOST?: string;
        POSTGRES_PASSWORD?: string;
        POSTGRES_DATABASE?: string;

        NEXTAUTH_SECRET?: string;

        NEXT_PUBLIC_SITE_URL?: string;
    }
}
