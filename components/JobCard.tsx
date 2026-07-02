'use client';

import { Job } from '@/app/api/jobs/route';
import { useState } from 'react';

export default function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await fetch('/api/saved-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        apply_url: job.applyUrl,
      }),
    });
    setSaved(true);
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h2 className="font-semibold text-lg">{job.title}</h2>
      <p className="text-gray-600">{job.company} — {job.location}</p>
      {job.salary && <p className="text-sm text-green-700">{job.salary}</p>}
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>
      <div className="flex gap-3 mt-3 items-center">
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
          Apply →
        </a>
        <button
          onClick={handleSave}
          disabled={saved}
          className="text-sm px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}