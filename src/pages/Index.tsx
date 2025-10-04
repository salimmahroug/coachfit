import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DemoPage from "@/components/DemoPage";
import Dashboard from "@/components/Dashboard";
import ClientList from "@/components/ClientList";
import ClientForm from "@/components/ClientForm";
import ClientProfile from "@/components/ClientProfile";
import ProgramDisplay from "@/components/ProgramDisplay";
import { generateProgram } from "@/utils/programGenerator";
import { useProgramData } from "@/hooks/useProgramData";
import { clientService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  name: string;
  age: string;
  gender?: string;
  fitness_level: string;
  objective: string;
  available_days: string;
  session_duration: string;
  medical_notes: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<
    "home" | "dashboard" | "clients" | "form" | "program" | "profile" | "demo"
  >("home");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const {
    currentProgram,
    setCurrentProgram,
    generateDefaultProgram,
    createProgram,
  } = useProgramData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNavigate = (view: string) => {
    setCurrentView(view as any);
  };

  const handleStartProgram = () => {
    setCurrentView("form");
  };

  const handleViewDemo = () => {
    setCurrentView("demo");
  };

  const handleBackFromDemo = () => {
    setCurrentView("home");
  };

  const handleFormSubmit = async (clientData: ClientData) => {
    try {
      setIsSubmitting(true);

      // Mapper les valeurs françaises vers les valeurs anglaises du backend
      const fitnessLevelMap: { [key: string]: string } = {
        debutant: "beginner",
        intermediaire: "intermediate",
        avance: "advanced",
        expert: "advanced", // Expert -> advanced
      };

      const goalsMap: { [key: string]: string } = {
        perte_poids: "weight_loss",
        prise_muscle: "muscle_gain",
        endurance: "endurance",
        force: "strength",
        tonification: "flexibility",
        preparation_sport: "general_fitness",
      };

      // Créer le client dans le backend
      const clientPayload = {
        name: clientData.name,
        email: `${clientData.name
          .toLowerCase()
          .replace(/\s+/g, "")}@client.com`,
        phone: "0000000000",
        age: parseInt(clientData.age),
        weight: 75,
        height: 170,
        gender: clientData.gender || "other",
        objective: goalsMap[clientData.objective] || "general_fitness",
        level: fitnessLevelMap[clientData.fitness_level] || "intermediate",
        fitnessLevel:
          fitnessLevelMap[clientData.fitness_level] || "intermediate",
        goals: [goalsMap[clientData.objective] || "general_fitness"],
        availableDays: ["monday", "wednesday", "friday"],
        sessionDuration: parseInt(clientData.session_duration),
        preferredTime: "morning",
        equipment: ["bodyweight"],
        medicalConditions: clientData.medical_notes
          ? [clientData.medical_notes]
          : [],
        notes: clientData.medical_notes || "",
      };

      console.log(
        "📤 Envoi du client:",
        JSON.stringify(clientPayload, null, 2)
      );

      const response = await clientService.create(clientPayload);

      console.log("📥 Réponse reçue:", response);

      if (response.success) {
        toast({
          title: "Client créé!",
          description: `Le profil de ${clientData.name} a été créé avec succès.`,
        });

        // Retour à la liste des clients
        setCurrentView("clients");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du client:", error);

      toast({
        title: "Erreur",
        description:
          error.message ||
          "Impossible de créer le client. Vérifiez que le backend est démarré.",
        variant: "destructive",
      });

      // En cas d'erreur, utiliser le programme par défaut localement
      const program = generateDefaultProgram(
        clientData.name,
        clientData.objective,
        clientData.fitness_level
      );
      setCurrentProgram(program);
      setCurrentView("program");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewProgram = () => {
    setCurrentView("form");
    setCurrentProgram(null);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setCurrentProgram(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleViewClientProfile = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView("profile");
  };

  const handleEditClient = (clientId: string) => {
    // Pour l'instant, retour vers la liste des clients
    // Plus tard, on pourra ouvrir un dialog d'édition
    setCurrentView("clients");
  };

  const handleBackFromProfile = () => {
    setSelectedClientId(null);
    setCurrentView("clients");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      {currentView === "home" && (
        <div>
          <HeroSection
            onStartNow={handleStartProgram}
            onViewDemo={handleViewDemo}
          />
          <div className="container py-16">
            <div className="text-center space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center group-hover:animate-pulse-glow">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Dashboard</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Vue d'ensemble de vos clients et statistiques
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleStartProgram}
                  className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-energy flex items-center justify-center group-hover:animate-pulse-glow">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Nouveau Client</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Créer un programme personnalisé
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView("clients")}
                  className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center group-hover:animate-pulse-glow">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Mes Clients</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Gérer tous vos clients
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "dashboard" && (
        <Dashboard
          onCreateClient={() => setCurrentView("form")}
          onViewClients={() => setCurrentView("clients")}
          onViewClient={handleViewClientProfile}
        />
      )}

      {currentView === "demo" && (
        <DemoPage onBack={handleBackFromDemo} onStartNow={handleStartProgram} />
      )}

      {currentView === "clients" && (
        <ClientList
          onCreateClient={() => setCurrentView("form")}
          onBack={handleBackToDashboard}
        />
      )}

      {currentView === "profile" && selectedClientId && (
        <ClientProfile
          clientId={selectedClientId}
          onBack={handleBackFromProfile}
          onEdit={handleEditClient}
        />
      )}

      {currentView === "form" && (
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <ClientForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      )}

      {currentView === "program" && currentProgram && (
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <ProgramDisplay
              program={currentProgram}
              onNewProgram={handleNewProgram}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
