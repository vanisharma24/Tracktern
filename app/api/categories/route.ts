import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const country = request.nextUrl.searchParams.get('country') || 'us';
    const appID = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/categories?app_id=${appID}&app_key=${appKey}`;

    try{
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json({categories: data.results});
    } catch {
        return NextResponse.json({error: 'Failed to fetch categories'}, {status: 500});
    }
}