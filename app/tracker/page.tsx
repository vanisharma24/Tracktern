'use client';

import { useEffect, useState } from 'react';

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  apply_url: string;
  status: string;
}

const STATUSES = ['Saved', 'Applied', 'Interviewing', 'Rejected', 'Offer'];

export default function Tracker() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/saved-jobs')
      .then((res) => res.json())
      .then((data) => setSavedJobs(data.savedJobs || []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch('/api/saved-jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setSavedJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status } : job))
    );
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Tracked Jobs — JobTrack</h1>
      <div className="grid gap-3">
        {savedJobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-gray-600 text-sm">{job.company} — {job.location}</p>
            </div>
            <select
              value={job.status}
              onChange={(e) => updateStatus(job.id, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </main>
  );
}