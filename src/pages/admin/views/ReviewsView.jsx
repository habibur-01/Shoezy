import React, { useState } from 'react';
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Flag,
  MessageSquare,
  ThumbsUp,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const INITIAL_REVIEWS = [
  {
    id: 'rev_01',
    customerName: 'Marcus Wright',
    productTitle: 'Aura Studio Wireless Noise-Canceling Headphones',
    rating: 5,
    title: 'Flawless ANC and remarkable soundstage',
    comment:
      'The memory foam ear cushions make long multi-hour editing sessions effortless. Latency over Bluetooth 5.3 is nonexistent.',
    verifiedBuyer: true,
    status: 'published',
    date: '2026-09-04',
    helpfulCount: 24,
  },
  {
    id: 'rev_02',
    customerName: 'Claire Beauchamp',
    productTitle: 'Double-Walled Matte Titanium Water Flask 750ml',
    rating: 5,
    title: 'Indestructible featherweight bottle',
    comment:
      'Zero metallic taste, keeps iced matcha cold throughout my 12-hour shifts. The laser-etched texture offers superior grip.',
    verifiedBuyer: true,
    status: 'published',
    date: '2026-09-03',
    helpfulCount: 18,
  },
  {
    id: 'rev_03',
    customerName: 'Liam Zhang',
    productTitle: 'Mechanical Wireless Keyboard 75%',
    rating: 4,
    title: 'Great acoustic dampening, needs extra keycap puller',
    comment:
      'Switches are super smooth and factory lubed. South-facing LEDs look fantastic with cherry profile caps.',
    verifiedBuyer: true,
    status: 'published',
    date: '2026-09-02',
    helpfulCount: 9,
  },
  {
    id: 'rev_04',
    customerName: 'Amina Al-Mansoor',
    productTitle: 'Organic Heavyweight Fleece Hoodie',
    rating: 5,
    title: 'The best heavyweight cotton fleece on the market',
    comment:
      'True 450 GSM heft. Wash after wash the fit remains tailored with zero shrinkage. Worth every penny.',
    verifiedBuyer: true,
    status: 'pending',
    date: '2026-09-01',
    helpfulCount: 14,
  },
  {
    id: 'rev_05',
    customerName: 'Sophia Takahashi',
    productTitle: 'Artisan Pour-Over Dripper Set',
    rating: 4,
    title: 'Beautiful Japanese ceramic craft',
    comment:
      'Flow rate is predictable and consistent. Looks sculptural on the coffee bar counter.',
    verifiedBuyer: true,
    status: 'pending',
    date: '2026-08-30',
    helpfulCount: 5,
  },
  {
    id: 'rev_06',
    customerName: 'Nathaniel Drake',
    productTitle: 'Precision Electric Coffee Burr Grinder',
    rating: 5,
    title: 'Minimal retention, whisper quiet motor',
    comment:
      'Consistent espresso fine grind with 64mm flat burrs. Dialing in single-origin beans has never been easier.',
    verifiedBuyer: true,
    status: 'published',
    date: '2026-08-28',
    helpfulCount: 31,
  },
  {
    id: 'rev_07',
    customerName: 'Lucas Lindqvist',
    productTitle: 'Mechanical Wireless Keyboard 75%',
    rating: 2,
    title: 'Bluetooth pairing failed on older MacBook',
    comment:
      'Could not pair seamlessly until firmware update. Works fine via 2.4GHz dongle now though.',
    verifiedBuyer: true,
    status: 'flagged',
    date: '2026-08-25',
    helpfulCount: 2,
  },
  {
    id: 'rev_08',
    customerName: 'Freja Nygård',
    productTitle: 'Double-Walled Matte Titanium Water Flask 750ml',
    rating: 5,
    title: 'Sleek Scandinavian aesthetic',
    comment:
      'Fits automotive cup holders seamlessly. Ultra premium lid seal that never leaks.',
    verifiedBuyer: true,
    status: 'pending',
    date: '2026-08-22',
    helpfulCount: 11,
  },
];

export const ReviewsView = () => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  const handleUpdateStatus = (id, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Product Reviews & Ratings</h1>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {reviews.length} Customer Reviews
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Moderate customer feedback, verify buyer badges, and publish verified testimonials to storefronts.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search reviews, products, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'published', 'pending', 'flagged'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer capitalize ${
                statusFilter === st
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="p-5 bg-white border border-zinc-200 rounded-xl shadow-2xs hover:shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-zinc-900 text-xs">{rev.title}</span>
                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified Purchase
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-500 mt-1">
                  By <strong className="text-zinc-800">{rev.customerName}</strong> on{' '}
                  <span className="text-indigo-600 font-medium">{rev.productTitle}</span> • {rev.date}
                </div>

                <p className="text-xs text-zinc-700 mt-2 leading-relaxed">{rev.comment}</p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex sm:flex-col items-end gap-2 shrink-0">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    rev.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : rev.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {rev.status}
                </span>

                <div className="flex items-center gap-1.5 mt-1">
                  {rev.status !== 'published' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'published')}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                    >
                      Publish
                    </button>
                  )}
                  {rev.status !== 'flagged' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'flagged')}
                      className="px-2 py-1 text-xs text-zinc-600 border border-zinc-200 hover:bg-zinc-100 rounded transition-colors"
                      title="Flag review for review"
                    >
                      <Flag className="w-3 h-3 text-rose-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
