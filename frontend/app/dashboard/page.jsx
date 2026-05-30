'use client';

import Link from 'next/link';
import Container from '@/components/Common/Container';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] py-12">
      <Container>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back. Continue working on your cards.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/templates"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <span className="text-2xl">🎴</span>
            <h2 className="mt-3 font-semibold text-slate-800">Templates</h2>
            <p className="mt-1 text-sm text-slate-500">Browse and customize card designs</p>
          </Link>
          <Link
            href="/gallery"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <span className="text-2xl">⭐</span>
            <h2 className="mt-3 font-semibold text-slate-800">Gallery</h2>
            <p className="mt-1 text-sm text-slate-500">Wishlist, drafts, and downloads</p>
          </Link>
          <Link
            href="/customize"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <span className="text-2xl">✏️</span>
            <h2 className="mt-3 font-semibold text-slate-800">Customize</h2>
            <p className="mt-1 text-sm text-slate-500">Open the card editor</p>
          </Link>
        </div>
      </Container>
    </div>
  );
}
