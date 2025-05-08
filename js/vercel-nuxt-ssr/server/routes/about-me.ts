import {EventHandlerRequest, H3Event} from "h3";
import * as cheerio from 'cheerio';

const url = 'https://ovchinnikov-lxs.github.io/n3-workspace';

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
    try {
        const html = await $fetch(url);
        const $ = cheerio.load(html);

        const profile = {
            name: $('title').text().trim(),
            description: $('meta[name="description"]').attr('content') || '',
            keywords: $('meta[name="keywords"]').attr('content') || '',
            social_links: [],
            projects: [],
            sections: []
        };

        $('a[href]').each((_, el) => {
            const href = $(el).attr('href');
            if (href.includes('linkedin.com') || href.includes('github.com') || href.includes('t.me')) {
                profile.social_links.push(href);
            }
        });

        $('h1, h2, h3, p').each((_, el) => {
            const tag = $(el).prop('tagName').toLowerCase();
            const text = $(el).text().trim();
            profile.sections.push({tag, text});
        });

        profile.projects = profile.social_links.filter(link => link.includes('github.com/ovchinnikov-lxs/'));

        return profile;
    } catch (error) {
        console.error('Error parsing site:', error);
        return {error: 'Failed to fetch or parse site'};
    }
})
