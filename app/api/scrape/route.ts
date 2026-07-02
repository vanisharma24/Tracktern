import {NextResponse} from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(){
    const res = await fetch('https://www.indeed.com/jobs?q=software+engineer&l=remote');
    const html = await res. text();
    const $ = cheerio.load(html);

    const jobs: {title: string; link: string }[]= [];

    //Adjustment of selectors on the basis of the actual page's HTML structure-
    //Inspect the page in your browser's dev tools to find the right ones
      $('.job-listing').each((_, el) => {
    const title = $(el).find('.job-title').text().trim();
    const link = $(el).find('a').attr('href') || '';
    jobs.push({ title, link });
  });

  return NextResponse.json({ jobs });
}
