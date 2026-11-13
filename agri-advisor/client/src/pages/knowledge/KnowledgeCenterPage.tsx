import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { KnowledgeArticle } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

const categories = [
  'All',
  'Crop Selection',
  'Soil Health',
  'Fertilizer Management',
  'Irrigation',
  'Pest Management',
  'Crop Diseases',
  'Organic Farming',
  'Sustainable Agriculture',
];

export const KnowledgeCenterPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery<{ data: KnowledgeArticle[] }>({
    queryKey: ['knowledge', selectedCat],
    queryFn: () => {
      const url = selectedCat === 'All' ? '/knowledge' : `/knowledge?category=${encodeURIComponent(selectedCat)}`;
      return api.get(url);
    },
  });

  const articles = data?.data || [];

  const filtered = articles.filter((art) => {
    return (
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Agricultural Extension Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Agricultural Knowledge & Field Manuals
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Curated scientific best practices for soil enhancement, IPM pest suppression, and regenerative farming
        </p>
      </div>

      {/* Search and Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search manuals, e.g. Kharif sowing, soil pH, vermicompost..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-agri-primary"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto text-xs pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                selectedCat === cat
                  ? 'bg-agri-primary text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading agricultural repository..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          No agricultural articles matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {art.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{art.excerpt}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Verified Guide</span>
                <Link
                  to={`/knowledge-center/${art.slug}`}
                  className="font-bold text-agri-primary hover:underline flex items-center"
                >
                  Read Full Guide
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
