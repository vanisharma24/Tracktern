import { NextRequest, NextResponse } from "next/server";

//Defining what a clean jobs looks like in our application
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string | null;
  applyUrl: string;
  posteddate: string;
}
// Raw shape returned by Adzuna's API, before we clean it up
interface AdzunaJobRaw {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  description: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || '';
    const location = searchParams.get('location') || '';
    const country = searchParams.get('country') || 'us';
    const category = searchParams.get('category') || '';
    const page = searchParams.get('page') || '1';
    
    
    const appID = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`);
    url.searchParams.set('app_id', appID!);
    url.searchParams.set('app_key', appKey!);
    if (query) url.searchParams.set('what', query);
    if (location) url.searchParams.set('where', location);
    if (category) url.searchParams.set('category', category);
    url.searchParams.set('results_per_page', '20');

    try{
        const res = await fetch(url.toString());
        if (!res.ok) {
            return NextResponse.json({error: 'Failed to fetch jobs'}, {status: res.status});
            
        }
        const data = await res.json();

        const jobs: Job[] = data.results.map((r: AdzunaJobRaw) => ({
            id: r.id,
            title: r.title,
            company: r.company?.display_name || 'Unknown',
            location: r.location?.display_name || 'Unknown',
            description: r.description,
            salary: r.salary_min != null && r.salary_max != null
             ?`${Math.round(r.salary_min)} - ${Math.round(r.salary_max)}` : null,
            applyUrl: r.redirect_url,
            posteddate: r.created,
        }));

        return NextResponse.json({jobs, count:data.count});
    } catch (err){
        console.error(err);
        return NextResponse.json({error: 'Server error'}, {status: 500});
    }
}