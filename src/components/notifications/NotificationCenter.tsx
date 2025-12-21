import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/monitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch notifications from database (or use a notifications table)
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        // In a real app, you'd have a notifications table
        // For now, we'll simulate with a mock structure
        // This would be: await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        
        // Mock notifications for demo
        return [
          {
            id: '1',
            type: 'info' as const,
            title: language === 'fr' ? 'Mise à jour du marché' : 'Market Update',
            message: language === 'fr' 
              ? 'Nouvelles données de marché disponibles pour Marrakech'
              : 'New market data available for Marrakech',
            read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'success' as const,
            title: language === 'fr' ? 'Rapport exporté' : 'Report Exported',
            message: language === 'fr'
              ? 'Votre rapport PDF a été généré avec succès'
              : 'Your PDF report has been generated successfully',
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            action_url: '/reports',
          },
          {
            id: '3',
            type: 'warning' as const,
            title: language === 'fr' ? 'Prix sous-optimal' : 'Suboptimal Pricing',
            message: language === 'fr'
              ? 'Votre propriété est 15% en dessous de la médiane du marché'
              : 'Your property is 15% below market median',
            read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ] as Notification[];
      } catch (error) {
        handleError(error);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      // In real app: await supabase.from('notifications').update({ read: true }).eq('id', id)
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In real app: await supabase.from('notifications').delete().eq('id', id)
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // In real app: await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return language === 'fr' ? 'À l\'instant' : 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return language === 'fr' ? `Il y a ${minutes} min` : `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return language === 'fr' ? `Il y a ${hours}h` : `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return language === 'fr' ? `Il y a ${days}j` : `${days}d ago`;
    }
  };

  if (!user) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Connectez-vous pour voir vos notifications' : 'Please log in to view notifications'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                {language === 'fr' ? 'Notifications' : 'Notifications'}
              </CardTitle>
              <CardDescription>
                {unreadCount > 0 
                  ? (language === 'fr' 
                      ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                      : `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`)
                  : (language === 'fr' ? 'Aucune nouvelle notification' : 'No new notifications')
                }
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                {language === 'fr' ? 'Tout marquer comme lu' : 'Mark all as read'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'fr' ? 'Aucune notification' : 'No notifications'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read
                        ? 'bg-card border-border/50'
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notification.created_at)}
                              </span>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  {language === 'fr' ? 'Non lu' : 'New'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                title={language === 'fr' ? 'Marquer comme lu' : 'Mark as read'}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteMutation.mutate(notification.id)}
                              title={language === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {notification.action_url && (
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-2 p-0 h-auto"
                            onClick={() => window.location.href = notification.action_url!}
                          >
                            {language === 'fr' ? 'Voir plus →' : 'View more →'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
