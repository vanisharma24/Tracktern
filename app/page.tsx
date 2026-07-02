'use client';

import { useState, useEffect } from 'react';
import { Job } from './api/jobs/route';
import JobCard from '../components/JobCard';

const COUNTRIES = [
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'in', label: 'India' },
  { code: 'ca', label: 'Canada' },
  { code: 'au', label: 'Australia' },
  { code: 'de', label: 'Germany' },
  { code: 'fr', label: 'France' },
  { code: 'nz', label: 'New Zealand' },
  { code: 'pl', label: 'Poland' },
  { code: 'br', label: 'Brazil' },
  { code: 'at', label: 'Austria' },
  { code: 'za', label: 'South Africa' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('us');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<{ tag: string; label: string }[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Categories differ slightly by country, so refetch whenever the country changes
  useEffect(() => {
    fetch(`/api/categories?country=${country}`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, [country]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ query, location, country, category });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setJobs(data.jobs);
    } catch {
      setError('Could not fetch jobs. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">JobTrack</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title or keyword (any field)"
          className="border rounded px-3 py-2 flex-1 min-w-50"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City (optional)"
          className="border rounded px-3 py-2 flex-1 min-w-37.5"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.tag} value={cat.tag}>{cat.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </main>
  );
}