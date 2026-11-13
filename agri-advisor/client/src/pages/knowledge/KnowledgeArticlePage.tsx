import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api.js';
import { KnowledgeArticle } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const KnowledgeArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ data: KnowledgeArticle }>({
    queryKey: ['article', slug],
    queryFn: () => api.get(`/knowledge/${slug}`),
  });

  const article = data?.data;

  if (isLoading) return <LoadingSpinner text="Retrieving agricultural manual..." />;
  if (!article) return <div className="text-center py-12 text-xs text-slate-500">Manual not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => navigate('/knowledge-center')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-agri-primary"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Knowledge Center
      </button>

      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-3 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
              {article.category}
            </span>
            <span className="text-slate-400 text-xs flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {new Date(article.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xs sm:text-sm text-slate-500 italic leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Content Body */}
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Verification Footer */}
        <div className="p-4 bg-emerald-50 rounded-2xl flex items-center space-x-3 text-xs text-emerald-900 border border-emerald-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            Compiled from verified agricultural research institutes and field extension protocols.
          </p>
        </div>
      </article>
    </div>
  );
};
