import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  User,
  Calendar,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Sparkles,
  Eye,
  Clock,
  Check,
} from "lucide-react";
import { clientService, programService } from "@/services/api";
import sessionService from "@/services/sessionService";
import { useToast } from "@/hooks/use-toast";

interface Client {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  goals: string[];
  fitnessLevel: string;
  createdAt: string;
  startDate: string;
  lastSession: string;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
  status: string;
  objective: string;
  level: string;
}

interface ClientListProps {
  onCreateClient: () => void;
  onBack: () => void;
}

const ClientList = ({ onCreateClient, onBack }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterObjective, setFilterObjective] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingProgram, setGeneratingProgram] = useState<string | null>(
    null
  );
  const [selectedClientProgram, setSelectedClientProgram] = useState<any>(null);
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [selectedClientForSession, setSelectedClientForSession] =
    useState<Client | null>(null);
  const [loadingProgram, setLoadingProgram] = useState(false);
  const [sessionData, setSessionData] = useState({
    scheduledDate: "",
    workoutName: "",
    notes: "",
  });
  const [clientPrograms, setClientPrograms] = useState<any[]>([]);
  const [loadingSession, setLoadingSession] = useState(false);
  const [showSessionsDialog, setShowSessionsDialog] = useState(false);
  const [selectedClientSessions, setSelectedClientSessions] = useState<any[]>(
    []
  );
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    fitnessLevel: "",
    goals: [] as string[],
    availableDays: "",
    sessionDuration: "",
    medicalNotes: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getAll();

      if (response.success) {
        // Mapper les données du backend au format du frontend et récupérer les stats
        const mappedClients = await Promise.all(
          (response.clients || []).map(async (client: any) => {
            // Récupérer les séances du client
            let sessionsCompleted = 0;
            let totalSessions = 0;
            let lastSessionDate = client.createdAt;

            try {
              const sessionsResponse = await sessionService.getAll({
                clientId: client._id,
              });

              if (sessionsResponse.success && sessionsResponse.sessions) {
                totalSessions = sessionsResponse.sessions.length;
                sessionsCompleted = sessionsResponse.sessions.filter(
                  (s: any) => s.status === "completed"
                ).length;

                // Trouver la dernière séance complétée
                const completedSessions = sessionsResponse.sessions
                  .filter((s: any) => s.status === "completed")
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.completedAt).getTime() -
                      new Date(a.completedAt).getTime()
                  );

                if (completedSessions.length > 0) {
                  lastSessionDate = completedSessions[0].completedAt;
                }
              }
            } catch (err) {
              console.log("Erreur récupération séances pour", client.name);
            }

            const progress =
              totalSessions > 0
                ? Math.round((sessionsCompleted / totalSessions) * 100)
                : 0;

            return {
              ...client,
              id: client._id,
              status: "active",
              startDate: client.createdAt,
              lastSession: lastSessionDate,
              progress,
              sessionsCompleted,
              totalSessions,
              objective: client.goals?.[0] || "general_fitness",
              level: client.fitnessLevel,
            };
          })
        );

        setClients(mappedClients);
      }
    } catch (error: any) {
      console.error("Erreur chargement clients:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProgram = async (clientId: string) => {
    try {
      setGeneratingProgram(clientId);
      const response = await programService.generate(clientId);

      if (response.success) {
        toast({
          title: "Programme généré!",
          description: `Le programme "${response.program.name}" a été créé avec succès.`,
        });
      }
    } catch (error: any) {
      console.error("Erreur génération programme:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le programme",
        variant: "destructive",
      });
    } finally {
      setGeneratingProgram(null);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client?")) {
      return;
    }

    try {
      const response = await clientService.delete(clientId);

      if (response.success) {
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès.",
        });
        loadClients(); // Recharger la liste
      }
    } catch (error: any) {
      console.error("Erreur suppression client:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le client",
        variant: "destructive",
      });
    }
  };

  const handleViewProgram = async (clientId: string) => {
    try {
      setLoadingProgram(true);
      // Récupérer les programmes du client
      const response = await programService.getAll({ clientId });

      if (
        response.success &&
        response.programs &&
        response.programs.length > 0
      ) {
        // Prendre le programme le plus récent
        const latestProgram = response.programs[0];
        setSelectedClientProgram(latestProgram);
        setShowProgramDialog(true);
      } else {
        toast({
          title: "Aucun programme",
          description:
            "Ce client n'a pas encore de programme. Générez-en un d'abord!",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erreur chargement programme:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger le programme",
        variant: "destructive",
      });
    } finally {
      setLoadingProgram(false);
    }
  };

  const handlePlanSession = async (client: Client) => {
    setSelectedClientForSession(client);
    setLoadingSession(true);

    // Charger les programmes du client
    try {
      const response = await programService.getAll({
        clientId: client.id || client._id,
      });
      if (response.success && response.programs) {
        setClientPrograms(response.programs);
      }
    } catch (error: any) {
      console.error("Erreur chargement programmes:", error);
    } finally {
      setLoadingSession(false);
    }

    setShowSessionDialog(true);

    // Initialiser avec la date d'aujourd'hui
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setSessionData({
      scheduledDate: now.toISOString().slice(0, 16),
      workoutName: "",
      notes: "",
    });
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setEditFormData({
      name: client.name,
      age: client.age?.toString() || "",
      fitnessLevel: client.level,
      goals: Array.isArray(client.objective)
        ? client.objective
        : [client.objective],
      availableDays: (client as any).availableDays?.toString() || "3",
      sessionDuration: (client as any).sessionDuration?.toString() || "60",
      medicalNotes: (client as any).medicalNotes || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingClient) return;

    setSavingEdit(true);
    try {
      const response = await clientService.update(editingClient.id, {
        name: editFormData.name,
        age: parseInt(editFormData.age),
        fitnessLevel: editFormData.fitnessLevel,
        goals:
          editFormData.goals.length > 0
            ? editFormData.goals
            : ["general_fitness"],
        sessionDuration: parseInt(editFormData.sessionDuration),
        notes: editFormData.medicalNotes, // 'notes' au lieu de 'medicalNotes'
        // Ne pas envoyer availableDays comme nombre, le garder tel quel dans le client
      });

      if (response.success) {
        toast({
          title: "Client modifié",
          description: "Les informations du client ont été mises à jour",
        });
        setShowEditDialog(false);
        setEditingClient(null);

        // Recharger la liste des clients
        setClients([]);
        await loadClients();
      }
    } catch (error) {
      console.error("Erreur modification client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le client",
        variant: "destructive",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleViewSessions = async (client: Client) => {
    setSelectedClientForSession(client);
    setShowSessionsDialog(true);
    setLoadingSessions(true);

    try {
      const response = await sessionService.getAll({
        clientId: client.id || client._id,
      });
      if (response.success) {
        // Trier par date (les plus récentes d'abord)
        const sortedSessions = (response.sessions || []).sort(
          (a: any, b: any) =>
            new Date(b.scheduledDate).getTime() -
            new Date(a.scheduledDate).getTime()
        );
        setSelectedClientSessions(sortedSessions);
      }
    } catch (error) {
      console.error("Erreur chargement séances:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les séances",
        variant: "destructive",
      });
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleMarkSessionCompleted = async (sessionId: string) => {
    try {
      const response = await sessionService.markAsCompleted(sessionId, {
        completedAt: new Date().toISOString(),
      });

      if (response.success) {
        toast({
          title: "Séance complétée",
          description: "La séance a été marquée comme complétée",
        });

        // Rafraîchir la liste des séances
        if (selectedClientForSession) {
          handleViewSessions(selectedClientForSession);
        }

        // Rafraîchir la liste des clients pour mettre à jour les stats
        setClients([]);
        await loadClients();
      }
    } catch (error) {
      console.error("Erreur complétion séance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la séance comme complétée",
        variant: "destructive",
      });
    }
  };

  const handleCreateSession = async () => {
    if (!selectedClientForSession || !sessionData.scheduledDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    if (clientPrograms.length === 0) {
      toast({
        title: "Aucun programme",
        description:
          "Ce client n'a pas de programme actif. Générez-en un d'abord!",
        variant: "destructive",
      });
      return;
    }

    setLoadingSession(true);

    try {
      const program = clientPrograms[0]; // Utiliser le premier programme actif

      const response = await sessionService.create({
        clientId: selectedClientForSession.id || selectedClientForSession._id,
        programId: program._id,
        workoutName: sessionData.workoutName || "Séance d'entraînement",
        scheduledDate: sessionData.scheduledDate,
        notes: sessionData.notes,
      });

      if (response.success) {
        toast({
          title: "Séance planifiée",
          description: `La séance pour ${selectedClientForSession.name} a été planifiée avec succès.`,
        });
        setShowSessionDialog(false);
        setSessionData({ scheduledDate: "", workoutName: "", notes: "" });

        // Forcer le re-render en réinitialisant d'abord
        setClients([]);
        // Recharger les clients avec les nouvelles statistiques
        await loadClients();
      }
    } catch (error: any) {
      console.error("Erreur planification séance:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de planifier la séance",
        variant: "destructive",
      });
    } finally {
      setLoadingSession(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesObjective =
      filterObjective === "all" || client.goals.includes(filterObjective);
    const matchesLevel =
      filterLevel === "all" || client.fitnessLevel === filterLevel;

    return matchesSearch && matchesObjective && matchesLevel;
  });

  const getObjectiveLabel = (objective: string) => {
    const labels: { [key: string]: string } = {
      weight_loss: "Perte de poids",
      muscle_gain: "Prise de muscle",
      endurance: "Endurance",
      strength: "Force",
      general_fitness: "Remise en forme",
      flexibility: "Flexibilité",
    };
    return labels[objective] || objective;
  };

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
      expert: "Expert",
    };
    return labels[level] || level;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success text-success-foreground">Actif</Badge>
        );
      case "paused":
        return <Badge variant="secondary">En pause</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 60) return "bg-energy";
    if (progress >= 40) return "bg-motivation";
    return "bg-destructive";
  };

  return (
    <div className="container py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fade-in px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            ← Retour au dashboard
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Mes clients</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez vos {clients.length} clients et suivez leurs progrès
          </p>
        </div>

        <Button
          variant="energy"
          onClick={onCreateClient}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Select
                value={filterObjective}
                onValueChange={setFilterObjective}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les objectifs</SelectItem>
                  <SelectItem value="perte_poids">Perte de poids</SelectItem>
                  <SelectItem value="prise_muscle">Prise de muscle</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="force">Force</SelectItem>
                  <SelectItem value="tonification">Tonification</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Cards */}
      <div className="grid gap-6">
        {filteredClients.map((client, index) => (
          <Card
            key={client.id}
            className="shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                    <User className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{client.age} ans</span>
                      <span>•</span>
                      <span>
                        Client depuis le{" "}
                        {new Date(client.startDate).toLocaleDateString("fr-FR")}
                      </span>
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(client.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Program Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-energy" />
                    Programme
                  </h4>
                  <div className="space-y-1">
                    <Badge variant="outline">
                      {getObjectiveLabel(client.objective)}
                    </Badge>
                    <Badge variant="secondary" className="ml-2">
                      {getLevelLabel(client.level)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Dernière séance:{" "}
                      {new Date(client.lastSession).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Progression
                  </h4>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Avancement
                      </span>
                      <span className="text-sm font-medium">
                        {client.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                          client.progress
                        )}`}
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {client.sessionsCompleted} / {client.totalSessions}{" "}
                      séances
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Actions
                  </h4>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="energy"
                      size="sm"
                      onClick={() => handleGenerateProgram(client.id)}
                      disabled={generatingProgram === client.id}
                    >
                      {generatingProgram === client.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Générer Programme IA
                        </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleViewProgram(client.id)}
                      disabled={loadingProgram}
                    >
                      {loadingProgram ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir le programme
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlanSession(client)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Planifier séance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSessions(client)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Voir les séances
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun client trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Aucun client ne correspond à vos critères de recherche.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterObjective("all");
                setFilterLevel("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour voir le programme */}
      <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Programme d'entraînement
            </DialogTitle>
            <DialogDescription>
              Programme pour{" "}
              {selectedClientProgram?.client?.name || "le client"}
            </DialogDescription>
          </DialogHeader>

          {selectedClientProgram && (
            <div className="space-y-4">
              {/* Informations du programme */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedClientProgram.name}</CardTitle>
                  <CardDescription>
                    {selectedClientProgram.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Durée</p>
                      <p className="font-semibold">
                        {selectedClientProgram.duration?.value || 0}{" "}
                        {selectedClientProgram.duration?.unit || "semaines"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fréquence</p>
                      <p className="font-semibold">
                        {selectedClientProgram.frequency} séances/semaine
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          selectedClientProgram.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedClientProgram.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Généré par IA
                      </p>
                      <p className="font-semibold">
                        {selectedClientProgram.generatedByAI ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Séances d'entraînement */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  Séances d'entraînement
                </h3>
                {selectedClientProgram.workouts &&
                selectedClientProgram.workouts.length > 0 ? (
                  selectedClientProgram.workouts.map(
                    (workout: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {workout.name || `Séance ${index + 1}`} -{" "}
                            {workout.day}
                          </CardTitle>
                          {workout.type && (
                            <Badge variant="outline">{workout.type}</Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          {workout.warmup && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-md">
                              <p className="text-sm font-semibold text-blue-900">
                                🔥 Échauffement
                              </p>
                              <p className="text-sm text-blue-800">
                                {workout.warmup}
                              </p>
                            </div>
                          )}

                          {workout.exercises &&
                            workout.exercises.length > 0 && (
                              <div className="space-y-2">
                                <p className="font-semibold text-sm">
                                  Exercices :
                                </p>
                                {workout.exercises.map(
                                  (exercise: any, exIndex: number) => (
                                    <div
                                      key={exIndex}
                                      className="p-3 border rounded-md"
                                    >
                                      <p className="font-semibold">
                                        {exercise.name}
                                      </p>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                                        {exercise.sets && (
                                          <p>Séries: {exercise.sets}</p>
                                        )}
                                        {exercise.reps && (
                                          <p>Reps: {exercise.reps}</p>
                                        )}
                                        {exercise.rest && (
                                          <p>Repos: {exercise.rest}s</p>
                                        )}
                                      </div>
                                      {exercise.notes && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                          💡 {exercise.notes}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {workout.cooldown && (
                            <div className="mt-3 p-3 bg-green-50 rounded-md">
                              <p className="text-sm font-semibold text-green-900">
                                ❄️ Retour au calme
                              </p>
                              <p className="text-sm text-green-800">
                                {workout.cooldown}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )
                ) : (
                  <p className="text-muted-foreground">
                    Aucune séance d'entraînement définie.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour planifier une séance */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Planifier une séance</DialogTitle>
            <DialogDescription>
              Planifier une séance pour {selectedClientForSession?.name}
            </DialogDescription>
          </DialogHeader>

          {loadingSession ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : clientPrograms.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Aucun programme trouvé pour ce client.
              </p>
              <Button
                onClick={() => {
                  setShowSessionDialog(false);
                  handleGenerateProgram(
                    selectedClientForSession!.id ||
                      selectedClientForSession!._id
                  );
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Générer un programme
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Programme</label>
                <Input
                  value={clientPrograms[0]?.name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date et heure *</label>
                <Input
                  type="datetime-local"
                  value={sessionData.scheduledDate}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      scheduledDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la séance</label>
                <Input
                  placeholder="Ex: Séance Force Jambes"
                  value={sessionData.workoutName}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      workoutName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optionnel)</label>
                <Input
                  placeholder="Notes supplémentaires..."
                  value={sessionData.notes}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSessionDialog(false)}
                  disabled={loadingSession}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateSession}
                  disabled={loadingSession || !sessionData.scheduledDate}
                >
                  {loadingSession ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Planification...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour voir les séances d'un client */}
      <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Séances de {selectedClientForSession?.name}
            </DialogTitle>
            <DialogDescription>
              Gérez les séances planifiées et complétées
            </DialogDescription>
          </DialogHeader>

          {loadingSessions ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedClientSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune séance planifiée pour ce client</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedClientSessions.map((session: any) => {
                const statusColors = {
                  scheduled: "bg-blue-500",
                  completed: "bg-green-500",
                  cancelled: "bg-red-500",
                  missed: "bg-orange-500",
                };
                const statusLabels = {
                  scheduled: "Planifiée",
                  completed: "Complétée",
                  cancelled: "Annulée",
                  missed: "Manquée",
                };

                return (
                  <Card key={session._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              statusColors[
                                session.status as keyof typeof statusColors
                              ]
                            }`}
                          ></div>
                          <h4 className="font-semibold">
                            {session.workoutName || "Séance d'entraînement"}
                          </h4>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(
                                session.scheduledDate
                              ).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Statut:</span>
                            <span>
                              {
                                statusLabels[
                                  session.status as keyof typeof statusLabels
                                ]
                              }
                            </span>
                          </div>
                          {session.notes && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Notes:</span>{" "}
                              {session.notes}
                            </div>
                          )}
                          {session.status === "completed" &&
                            session.completedAt && (
                              <div className="flex items-center gap-2 text-green-600">
                                <Check className="h-4 w-4" />
                                <span>
                                  Complétée le{" "}
                                  {new Date(
                                    session.completedAt
                                  ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {session.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() =>
                              handleMarkSessionCompleted(session._id)
                            }
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Marquer complétée
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer un client */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations de {editingClient?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Nom et Âge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom complet</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age">Âge</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={editFormData.age}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, age: e.target.value })
                  }
                  placeholder="25"
                />
              </div>
            </div>

            {/* Niveau et Objectif */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-level">Niveau de forme</Label>
                <Select
                  value={editFormData.fitnessLevel}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, fitnessLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-days">Jours disponibles/semaine</Label>
                <Select
                  value={editFormData.availableDays}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, availableDays: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Jours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 jours</SelectItem>
                    <SelectItem value="3">3 jours</SelectItem>
                    <SelectItem value="4">4 jours</SelectItem>
                    <SelectItem value="5">5 jours</SelectItem>
                    <SelectItem value="6">6 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Durée de séance */}
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Durée de séance (minutes)</Label>
              <Select
                value={editFormData.sessionDuration}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, sessionDuration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes médicales */}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes médicales</Label>
              <Textarea
                id="edit-notes"
                value={editFormData.medicalNotes}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    medicalNotes: e.target.value,
                  })
                }
                placeholder="Allergies, blessures, conditions particulières..."
                rows={3}
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={savingEdit}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={savingEdit || !editFormData.name}
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientList;
