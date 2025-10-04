import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Calendar, TrendingUp, Plus, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { clientService, programService } from "@/services/api";
import sessionService from "@/services/sessionService";
import { Client, Session } from "@/types";

interface ClientSummary {
  id: string;
  name: string;
  objective: string;
  level: string;
  lastSession: string;
  progress: number;
}

interface DashboardStats {
  totalClients: number;
  activePrograms: number;
  thisWeekSessions: number;
  completionRate: number;
}

interface DashboardProps {
  onCreateClient: () => void;
  onViewClients: () => void;
  onViewClient?: (clientId: string) => void;
}

const Dashboard = ({
  onCreateClient,
  onViewClients,
  onViewClient,
}: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activePrograms: 0,
    thisWeekSessions: 0,
    completionRate: 0,
  });
  const [recentClients, setRecentClients] = useState<ClientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Charger les clients
      const clientsResponse = await clientService.getAll();

      // Charger les programmes actifs
      const programsResponse = await programService.getAll({
        status: "active",
      });

      if (clientsResponse.success && programsResponse.success) {
        const clients = clientsResponse.clients || [];
        const programs = programsResponse.programs || [];

        // Calculer les vraies statistiques à partir des sessions
        const allSessionsResponse = await sessionService.getAll();
        const allSessions = allSessionsResponse.sessions || [];
        const completedSessions = allSessions.filter(
          (s: Session) => s.status === "completed"
        );
        const completionRate =
          allSessions.length > 0
            ? Math.round((completedSessions.length / allSessions.length) * 100)
            : 0;

        // Calculer les stats
        setStats({
          totalClients: clients.length,
          activePrograms: programs.length,
          thisWeekSessions: allSessions.length,
          completionRate,
        });

        // Préparer les clients récents avec leurs vraies statistiques
        const recentClientsData = await Promise.all(
          clients.slice(0, 5).map(async (client: Client) => {
            const clientSessionsResponse = await sessionService.getAll({
              clientId: client._id,
            });
            const clientSessions = clientSessionsResponse.sessions || [];
            const clientCompleted = clientSessions.filter(
              (s: Session) => s.status === "completed"
            );
            const progress =
              clientSessions.length > 0
                ? Math.round(
                    (clientCompleted.length / clientSessions.length) * 100
                  )
                : 0;

            // Trouver la dernière séance complétée
            const lastCompletedSession = clientCompleted.sort(
              (a: Session, b: Session) =>
                new Date(b.completedAt).getTime() -
                new Date(a.completedAt).getTime()
            )[0];

            return {
              id: client._id,
              name: client.name,
              objective: client.objective || "Fitness général",
              level: client.level || "intermediate",
              lastSession:
                lastCompletedSession?.completedAt || new Date().toISOString(),
              progress,
            };
          })
        );

        setRecentClients(recentClientsData);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error("Erreur lors du chargement du tableau de bord:", err);
      setError(error.message || "Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-success";
    if (progress >= 60) return "text-energy";
    return "text-destructive";
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Coach</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez vos clients et suivez leurs progrès
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onViewClients}
            className="w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Voir tous les clients</span>
            <span className="sm:hidden">Tous les clients</span>
          </Button>
          <Button
            variant="energy"
            onClick={onCreateClient}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clients totaux
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">+2 ce mois</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Programmes actifs
            </CardTitle>
            <Target className="h-4 w-4 text-energy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-energy">
              {stats.activePrograms}
            </div>
            <p className="text-xs text-muted-foreground">67% de vos clients</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Séances cette semaine
            </CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.thisWeekSessions}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% vs semaine dernière
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de réussite
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-motivation" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-motivation">
              {stats.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">Excellent score!</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Clients récents
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Aperçu de l'activité de vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {recentClients.map((client) => (
              <div
                key={client.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base truncate">
                    {client.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                    <span className="truncate">{client.objective}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">{client.level}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">{client.lastSession}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-left sm:text-right flex-1 sm:flex-initial">
                    <div
                      className={`text-xs sm:text-sm font-medium ${getProgressColor(
                        client.progress
                      )}`}
                    >
                      {client.progress}% terminé
                    </div>
                    <div className="w-full sm:w-20 bg-muted rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => {
                      if (onViewClient) {
                        onViewClient(client.id);
                      } else {
                        onViewClients();
                      }
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={onViewClients}>
              Voir tous les clients
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-card bg-gradient-to-r from-primary/5 to-energy/5">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Commencez rapidement vos tâches les plus courantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="default"
              className="h-auto p-6 flex-col gap-2"
              onClick={onCreateClient}
            >
              <Plus className="h-6 w-6" />
              <span className="font-semibold">Nouveau client</span>
              <span className="text-xs text-center">
                Créer un profil et programme
              </span>
            </Button>

            <Button variant="secondary" className="h-auto p-6 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="font-semibold">Planifier séance</span>
              <span className="text-xs text-center">
                Organiser votre planning
              </span>
            </Button>

            <Button variant="outline" className="h-auto p-6 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="font-semibold">Analyser progrès</span>
              <span className="text-xs text-center">Suivre les résultats</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
