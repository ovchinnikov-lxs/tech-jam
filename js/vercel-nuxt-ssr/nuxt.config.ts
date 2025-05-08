// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: ['@nuxt/eslint'],

    nitro: {
        storage: {
            cache: {
                driver: 'redis',
                url: process.env.REDIS_URL,
            },
        },
        future: {
            nativeSWR: true,
        }
    },

    $production: {
        routeRules: {
            '/about-me': {
                isr: 86400,
            }
        },
    }
})
