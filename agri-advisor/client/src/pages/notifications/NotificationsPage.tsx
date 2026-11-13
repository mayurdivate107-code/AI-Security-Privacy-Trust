import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Trash2, Clock } from 'lucide-react';
import { api } from '../../lib/api.js';
import { NotificationItem } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: NotificationItem[] }>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
  });

  const markAllMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markSingleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.data || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">In-App Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Advisory completion alerts, pest warnings, and farm profile updates
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            className="inline-flex items-center text-xs font-bold text-agri-primary hover:underline"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark All as Read
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner text="Retrieving alerts..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Alerts Currently"
          description="You are caught up! When Gemini finishes analyzing foliage photos or calculating fertilization schedules, notifications will arrive here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.is_read) markSingleMutation.mutate(n.id);
              }}
              className={`p-4 rounded-2xl border transition flex items-start justify-between cursor-pointer ${
                n.is_read
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-emerald-50/50 border-emerald-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    n.is_read ? 'bg-transparent' : 'bg-agri-primary'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-xs">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(n.id);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
