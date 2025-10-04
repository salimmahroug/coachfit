import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Calendar,
  Target,
  Activity,
  Clock,
  TrendingUp,
  Edit,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Dumbbell,
  Heart,
  Mail,
  Phone,
} from "lucide-react";
import { clientService, programService } from "@/services/api";
import sessionService from "@/services/sessionService";
import { useToast } from "@/hooks/use-toast";

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
  onEdit: (clientId: string) => void;
}

const ClientProfile = ({ clientId, onBack, onEdit }: ClientProfileProps) => {
  const [client, setClient] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
    progress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadClientData();
  }, [clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadClientData = async () => {
    setIsLoading(true);
    try {
      // Charger les données du client
      const clientResponse = await clientService.getById(clientId);
      if (clientResponse.success) {
        setClient(clientResponse.client);
      }

      // Charger le programme du client
      const programResponse = await programService.getAll({ clientId });
      if (programResponse.success && programResponse.programs.length > 0) {
        setProgram(programResponse.programs[0]);
      }

      // Charger les séances du client
      const sessionsResponse = await sessionService.getAll({ clientId });
      if (sessionsResponse.success) {
        const sessionsList = sessionsResponse.sessions || [];
        setSessions(sessionsList);

        // Calculer les statistiques
        const completed = sessionsList.filter(
          (s: any) => s.status === "completed"
        ).length;
        const scheduled = sessionsList.filter(
          (s: any) => s.status === "scheduled"
        ).length;
        const cancelled = sessionsList.filter(
          (s: any) => s.status === "cancelled"
        ).length;
        const progress =
          sessionsList.length > 0
            ? Math.round((completed / sessionsList.length) * 100)
            : 0;

        setStats({
          total: sessionsList.length,
          completed,
          scheduled,
          cancelled,
          progress,
        });
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil du client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper pour gérer les valeurs qui peuvent être des objets {value, unit} ou des nombres simples
  const formatValue = (value: any): string => {
    if (typeof value === "object" && value !== null && "value" in value) {
      return `${value.value}${value.unit || ""}`;
    }
    return String(value || "");
  };

  const getObjectiveLabel = (objective: string) => {
    const labels: { [key: string]: string } = {
      weight_loss: "Perte de poids",
      muscle_gain: "Prise de masse",
      endurance: "Endurance",
      strength: "Force",
      flexibility: "Flexibilité",
      general_fitness: "Forme générale",
    };
    return labels[objective] || objective;
  };

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    };
    return labels[level] || level;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-success";
    if (progress >= 60) return "text-energy";
    if (progress >= 40) return "text-motivation";
    return "text-destructive";
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: any } = {
      scheduled: <Badge variant="outline">Planifiée</Badge>,
      completed: <Badge className="bg-success text-white">Complétée</Badge>,
      cancelled: <Badge variant="destructive">Annulée</Badge>,
      missed: <Badge variant="secondary">Manquée</Badge>,
    };
    return badges[status] || <Badge>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-lg">Client introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fade-in px-4">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
        <Button variant="outline" onClick={() => onEdit(clientId)} size="sm">
          <Edit className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Modifier</span>
        </Button>
      </div>

      {/* Informations principales du client */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl truncate">
                  {client.name}
                </CardTitle>
                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{client.age} ans</span>
                  </span>
                  {client.email && (
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm truncate">
                        {client.email}
                      </span>
                    </span>
                  )}
                  {client.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{client.phone}</span>
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={client.isActive ? "default" : "secondary"}
              className="self-start"
            >
              {client.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Objectifs */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-energy" />
                Objectifs
              </h4>
              <div className="flex flex-wrap gap-2">
                {client.goals?.map((goal: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {getObjectiveLabel(goal)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Niveau */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Niveau
              </h4>
              <Badge variant="secondary" className="text-base">
                {getLevelLabel(client.fitnessLevel)}
              </Badge>
            </div>

            {/* Disponibilité */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-success" />
                Disponibilité
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatValue(client.sessionDuration || 60)} min par séance
              </p>
              {client.preferredTime && (
                <p className="text-sm text-muted-foreground">
                  Préférence: {client.preferredTime}
                </p>
              )}
            </div>
          </div>

          {/* Notes médicales */}
          {client.notes && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-destructive" />
                Notes médicales
              </h4>
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques de progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Séances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Complétées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Planifiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.scheduled}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getProgressColor(
                stats.progress
              )}`}
            >
              {stats.progress}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets Programme et Séances */}
      <Tabs defaultValue="program" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="program">
            <Dumbbell className="h-4 w-4 mr-2" />
            Programme
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Calendar className="h-4 w-4 mr-2" />
            Séances
          </TabsTrigger>
        </TabsList>

        {/* Onglet Programme */}
        <TabsContent value="program" className="space-y-4">
          {program ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        {program.name || "Programme d'entraînement"}
                      </CardTitle>
                      {program.generatedByAI && (
                        <Badge variant="outline">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Généré par IA
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {formatValue(program.duration)} semaines •{" "}
                      {formatValue(program.frequency)} séances/semaine
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {program.workouts?.map((workout: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {workout.name}
                        </CardTitle>
                        <CardDescription>{workout.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {workout.exercises?.map(
                            (exercise: any, exIndex: number) => (
                              <div
                                key={exIndex}
                                className="flex items-start justify-between p-3 bg-muted rounded-lg"
                              >
                                <div className="flex-1">
                                  <h5 className="font-semibold">
                                    {exercise.name}
                                  </h5>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {formatValue(exercise.sets)} séries ×{" "}
                                    {formatValue(exercise.reps)} répétitions
                                    {exercise.rest &&
                                      ` • Repos: ${formatValue(exercise.rest)}`}
                                  </p>
                                  {exercise.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      💡 {exercise.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucun programme trouvé pour ce client
                </p>
                <Button variant="energy" className="mt-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer un programme
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Séances */}
        <TabsContent value="sessions" className="space-y-4">
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session: any) => (
                <Card key={session._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">
                            {session.workoutName || "Séance d'entraînement"}
                          </h4>
                          {getStatusBadge(session.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(session.scheduledDate).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            📝 {session.notes}
                          </p>
                        )}
                        {session.status === "completed" &&
                          session.completedAt && (
                            <p className="text-sm text-success mt-2">
                              <CheckCircle2 className="h-4 w-4 inline mr-1" />
                              Complétée le{" "}
                              {new Date(session.completedAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                          )}
                      </div>
                      {session.status === "scheduled" && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      {session.status === "completed" && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                      {session.status === "cancelled" && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucune séance planifiée pour ce client
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
