import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Target,
  Zap,
  CheckCircle,
  Calendar,
  Download,
} from "lucide-react";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: string;
}

interface ProgramData {
  clientName: string;
  objective: string;
  level: string;
  duration: string;
  workoutDays: WorkoutDay[];
  tips: string[];
}

interface ProgramDisplayProps {
  program: ProgramData;
  onNewProgram: () => void;
}

const ProgramDisplay = ({ program, onNewProgram }: ProgramDisplayProps) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "debutant":
        return "bg-green-100 text-green-800";
      case "intermediaire":
        return "bg-yellow-100 text-yellow-800";
      case "avance":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getObjectiveIcon = (objective: string) => {
    switch (objective) {
      case "perte_poids":
        return "🔥";
      case "prise_muscle":
        return "💪";
      case "endurance":
        return "🏃";
      case "force":
        return "🏋️";
      case "tonification":
        return "✨";
      case "preparation_sport":
        return "⚡";
      default:
        return "🎯";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">
            Programme généré avec succès !
          </CardTitle>
          <CardDescription>
            Programme personnalisé pour <strong>{program.clientName}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="text-sm">
              {getObjectiveIcon(program.objective)}{" "}
              {program.objective.replace("_", " ")}
            </Badge>
            <Badge className={getLevelColor(program.level)}>
              Niveau {program.level}
            </Badge>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {program.duration}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Workout Days */}
      <div className="grid gap-6">
        {program.workoutDays.map((day, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-energy" />
                  {day.day}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {day.duration}
                </div>
              </div>
              <CardDescription>
                <div>
                  <Badge variant="outline">{day.focus}</Badge>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <h4 className="font-semibold mb-2">{exercise.name}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Séries:</span>
                        <span className="ml-2 font-medium">
                          {exercise.sets}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Répétitions:
                        </span>
                        <span className="ml-2 font-medium">
                          {exercise.reps}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Repos:</span>
                        <span className="ml-2 font-medium">
                          {exercise.rest}
                        </span>
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        💡 {exercise.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips & Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-success" />
            Conseils personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {program.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="energy" size="lg" className="flex-1">
          <Download className="h-5 w-5 mr-2" />
          Télécharger le programme
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onNewProgram}
          className="flex-1"
        >
          Créer un nouveau programme
        </Button>
      </div>
    </div>
  );
};

export default ProgramDisplay;
