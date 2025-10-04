import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Users,
  Calendar,
  TrendingUp,
  Dumbbell,
  Zap,
  Target,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";

interface DemoPageProps {
  onBack: () => void;
  onStartNow: () => void;
}

const DemoPage = ({ onBack, onStartNow }: DemoPageProps) => {
  const [activeDemo, setActiveDemo] = useState<
    "client" | "program" | "progress"
  >("client");

  // Données de démonstration
  const demoClient = {
    name: "Sophie Martin",
    age: 32,
    level: "Intermédiaire",
    objective: "Perte de poids",
    sessions: 12,
    completed: 8,
    progress: 67,
  };

  const demoProgram = {
    name: "Programme Perte de Poids",
    duration: "12 semaines",
    frequency: "3 séances/semaine",
    workouts: [
      {
        name: "Séance Cardio & Force",
        exercises: [
          { name: "Squats", sets: "3", reps: "12", rest: "60s" },
          { name: "Pompes", sets: "3", reps: "10", rest: "60s" },
          { name: "Burpees", sets: "3", reps: "8", rest: "90s" },
        ],
      },
      {
        name: "Séance HIIT",
        exercises: [
          { name: "Mountain Climbers", sets: "4", reps: "30s", rest: "30s" },
          { name: "Jumping Jacks", sets: "4", reps: "45s", rest: "30s" },
          { name: "Planche", sets: "3", reps: "45s", rest: "60s" },
        ],
      },
    ],
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Génération IA",
      description:
        "Programmes personnalisés générés automatiquement par intelligence artificielle",
      color: "text-energy",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestion Clients",
      description:
        "Base de données complète pour suivre tous vos clients au même endroit",
      color: "text-primary",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Suivi Progression",
      description:
        "Statistiques détaillées et graphiques de progression en temps réel",
      color: "text-success",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Planification",
      description:
        "Calendrier de séances et gestion des rendez-vous automatisée",
      color: "text-motivation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container py-4 sm:py-6 px-4">
        <Button variant="ghost" onClick={onBack} size="sm" className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
      </div>

      {/* Hero Demo Section */}
      <div className="container py-6 sm:py-12 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm" variant="outline">
            <Play className="h-3 w-3 mr-1" />
            Démo Interactive
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
            Découvrez{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Coach Fit
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explorez toutes les fonctionnalités de notre plateforme de gestion
            de programmes d'entraînement
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-card hover:shadow-card-hover transition-shadow"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div
                  className={`${feature.color} mb-2 flex justify-center sm:justify-start`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-base sm:text-lg text-center sm:text-left">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
            <Button
              variant={activeDemo === "client" ? "default" : "outline"}
              onClick={() => setActiveDemo("client")}
              className="w-full sm:w-auto"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="text-xs sm:text-sm">Fiche Client</span>
            </Button>
            <Button
              variant={activeDemo === "program" ? "default" : "outline"}
              onClick={() => setActiveDemo("program")}
              className="w-full sm:w-auto"
            >
              <Dumbbell className="h-4 w-4 mr-2" />
              <span className="text-xs sm:text-sm">Programme</span>
            </Button>
            <Button
              variant={activeDemo === "progress" ? "default" : "outline"}
              onClick={() => setActiveDemo("progress")}
              className="w-full sm:w-auto"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-xs sm:text-sm">Progression</span>
            </Button>
          </div>

          {/* Demo Content */}
          <div className="max-w-4xl mx-auto px-4">
            {activeDemo === "client" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl sm:text-2xl truncate">
                        {demoClient.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {demoClient.age} ans • {demoClient.level}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 text-energy" />
                        Objectif
                      </h4>
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        {demoClient.objective}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        Séances
                      </h4>
                      <p className="text-xl sm:text-2xl font-bold">
                        {demoClient.sessions}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                        Complétées
                      </h4>
                      <p className="text-xl sm:text-2xl font-bold text-success">
                        {demoClient.completed}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeDemo === "program" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">
                      {demoProgram.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-xs self-start sm:self-auto"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Généré par IA
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    {demoProgram.duration} • {demoProgram.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {demoProgram.workouts.map((workout, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base sm:text-lg">
                            {workout.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 sm:space-y-3">
                            {workout.exercises.map((exercise, exIndex) => (
                              <div
                                key={exIndex}
                                className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-2 sm:p-3 bg-muted rounded-lg gap-2"
                              >
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-sm sm:text-base truncate">
                                    {exercise.name}
                                  </h5>
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                    {exercise.sets} séries × {exercise.reps} •
                                    Repos: {exercise.rest}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeDemo === "progress" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Progression de {demoClient.name}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Statistiques et évolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Progression générale */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium">
                          Progression générale
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-energy">
                          {demoClient.progress}%
                        </span>
                      </div>
                      <Progress
                        value={demoClient.progress}
                        className="h-2 sm:h-3"
                      />
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      <Card>
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <span className="text-xl sm:text-2xl font-bold">
                              {demoClient.sessions}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Séances planifiées
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                            <span className="text-xl sm:text-2xl font-bold text-success">
                              {demoClient.completed}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Séances complétées
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-energy" />
                            <span className="text-xl sm:text-2xl font-bold text-energy">
                              95%
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Taux de réussite
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Performance Badges */}
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-xs sm:text-sm font-semibold">
                        Performances
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <Badge className="bg-success text-white text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Assiduité excellente
                        </Badge>
                        <Badge className="bg-energy text-white text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Progression rapide
                        </Badge>
                        <Badge className="bg-primary text-white text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Objectifs atteints
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="shadow-card bg-gradient-primary text-white">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre coaching ?
            </h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Rejoignez des centaines de coachs qui utilisent déjà Coach Fit
              pour créer des programmes sur mesure et suivre leurs clients
              efficacement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={onStartNow}
                className="group"
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 border-white/30"
              >
                <Clock className="h-5 w-5 mr-2" />
                Essai gratuit 14 jours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoPage;
