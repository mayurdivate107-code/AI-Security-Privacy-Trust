import React, { useState, useEffect } from 'react';
import { api, isBackendAlive } from '../lib/api.js';
import { AuditLog } from '../types/index.js';
import { ThreatBadge } from '../components/common/ThreatBadge.js';
import { ActionBadge } from '../components/common/ActionBadge.js';
import { DEFAULT_LOGS } from '../lib/clientFallback.js';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Fingerprint,
  RefreshCw,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(DEFAULT_LOGS);
  const [total, setTotal] = useState(DEFAULT_LOGS.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');

  // Expanded Row State
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    const online = await isBackendAlive();
    if (!online) {
      // Filter default logs client-side
      let filtered = [...DEFAULT_LOGS];
      if (actionFilter !== 'ALL') {
        filtered = filtered.filter((l) => l.actionTaken === actionFilter);
      }
      if (threatFilter !== 'ALL') {
        filtered = filtered.filter((l) => l.threatLevel === threatFilter);
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.sanitizedPrompt.toLowerCase().includes(q) ||
            l.aiExplanation.toLowerCase().includes(q) ||
            l.threatCategory.toLowerCase().includes(q)
        );
      }
      setLogs(filtered);
      setTotal(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 12) || 1);
      return;
    }

    try {
      setLoading(true);
      const params: any = { page, limit: 12 };
      if (search.trim()) params.search = search.trim();
      if (actionFilter !== 'ALL') params.action = actionFilter;
      if (threatFilter !== 'ALL') params.threatLevel = threatFilter;

      const res: any = await api.get('/dashboard/logs', { params });
      if (res.success && res.logs) {
        setLogs(res.logs);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
        return;
      }
    } catch (err: any) {
      console.warn('[AegisAI Audit Ledger] Applying client-side audit log query:', err.message);
      let filtered = [...DEFAULT_LOGS];
      if (actionFilter !== 'ALL') {
        filtered = filtered.filter((l) => l.actionTaken === actionFilter);
      }
      if (threatFilter !== 'ALL') {
        filtered = filtered.filter((l) => l.threatLevel === threatFilter);
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.sanitizedPrompt.toLowerCase().includes(q) ||
            l.aiExplanation.toLowerCase().includes(q) ||
            l.threatCategory.toLowerCase().includes(q)
        );
      }
      setLogs(filtered);
      setTotal(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 12) || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, threatFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            IMMUTABLE COMPLIANCE LEDGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight mt-1">
            Security Audit Trail & Prompt Logs
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Cryptographically indexed inspection records with zero raw secret retention (SHA-256 verified)
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Ledger
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="cyber-card rounded-2xl border border-slate-800 p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, categories, explanations, or PII tags..."
              className="w-full pl-10 pr-4 py-2 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-44 px-3 py-2 bg-[#030712] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 font-mono"
            >
              <option value="ALL">All Actions</option>
              <option value="ALLOWED">Allowed Only</option>
              <option value="REDACTED_AND_ALLOWED">Redacted & Allowed</option>
              <option value="BLOCKED">Blocked Only</option>
            </select>

            {/* Threat Level Filter */}
            <select
              value={threatFilter}
              onChange={(e) => {
                setThreatFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-40 px-3 py-2 bg-[#030712] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 font-mono"
            >
              <option value="ALL">All Threat Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition shrink-0"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-8"></th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Prompt Preview</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Threat Level</th>
                <th className="py-3 px-4">Trust</th>
                <th className="py-3 px-4">PII Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Querying audit ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No audit records matching specified filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isExpanded = expandedId === log._id;
                  return (
                    <React.Fragment key={log._id}>
                      <tr
                        onClick={() => toggleExpand(log._id)}
                        className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-slate-900/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-slate-500">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-slate-200 max-w-xs truncate font-mono">
                          {log.originalPromptPreview || log.sanitizedPrompt}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <ActionBadge action={log.actionTaken} />
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <ThreatBadge level={log.threatLevel} />
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`font-bold ${
                              log.trustScore >= 80
                                ? 'text-emerald-400'
                                : log.trustScore >= 50
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {log.trustScore}/100
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {log.detectedPII && log.detectedPII.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {log.detectedPII.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-600">None</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Deep Diagnostic Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-b border-slate-800">
                          <td colSpan={7} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                                <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                                  Sanitized Prompt Forwarded to LLM:
                                </span>
                                <p className="text-slate-300 leading-relaxed bg-[#030712] p-3 rounded-lg border border-slate-800">
                                  {log.sanitizedPrompt}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                                  <Fingerprint className="w-3.5 h-3.5" />
                                  <span>SHA-256 Hash: {log.originalPromptHash}</span>
                                </div>
                              </div>

                              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                                <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                                  AI Governance Explanation & Response:
                                </span>
                                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                                  {log.aiExplanation}
                                </p>
                                <div className="p-3 rounded-lg bg-[#030712] border border-slate-800 text-slate-300 text-xs">
                                  <span className="text-slate-500 text-[10px] block mb-1">
                                    Model Answer / Firewall Notice:
                                  </span>
                                  {log.aiResponse}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            Showing {logs.length} of {total} records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition"
            >
              Previous
            </button>
            <span className="text-white px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
