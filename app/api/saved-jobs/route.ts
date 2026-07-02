import {NextRequest, NextResponse} from 'next/server';
import {supabase} from '@/lib/supabase';

export async function GET(){

    const {data, error} = await supabase
        .from('saved_jobs')
        .select('*')
        .order('created_at', {ascending: false});

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({savedJobs: data});
}

export async function POST(request: NextRequest){
    const body = await request.json();
    const {error} = await supabase.from('saved_jobs').insert([
        {
            job_id: body.job_id,
            title: body.title,
            company: body.company,
            location: body.location,
            apply_url: body.apply_url,
        },
    ]);

    if (error) return NextResponse.json({error:error.message}, {status:500});
    return NextResponse.json({success: true});
}

export async function PATCH(request: NextRequest){
    const body = await request.json();
    const {error} = await supabase
        .from('saved_jobs')
        .update({notes: body.notes})
        .eq('job_id', body.job_id);
    if (error) return NextResponse.json({error:error.message}, {status:500});
    return NextResponse.json({success: true});
}