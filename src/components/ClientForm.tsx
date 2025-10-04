import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Target, Calendar, Activity } from "lucide-react";

interface ClientData {
  name: string;
  age: string;
  fitness_level: string;
  objective: string;
  available_days: string;
  session_duration: string;
  medical_notes: string;
}

interface ClientFormProps {
  onSubmit: (data: ClientData) => void;
  isLoading?: boolean;
}

const ClientForm = ({ onSubmit, isLoading = false }: ClientFormProps) => {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    age: "",
    fitness_level: "",
    objective: "",
    available_days: "",
    session_duration: "",
    medical_notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ClientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Nouveau profil client</CardTitle>
        <CardDescription>
          Remplissez les informations pour créer un programme personnalisé
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <UserPlus className="h-5 w-5 text-primary" />
              Informations personnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="25"
                  min="16"
                  max="100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Niveau et objectifs */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Target className="h-5 w-5 text-energy" />
              Niveau et objectifs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fitness_level">Niveau de forme physique</Label>
                <Select
                  value={formData.fitness_level}
                  onValueChange={(value) =>
                    handleChange("fitness_level", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="avance">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Objectif principal</Label>
                <Select
                  value={formData.objective}
                  onValueChange={(value) => handleChange("objective", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perte_poids">Perte de poids</SelectItem>
                    <SelectItem value="prise_muscle">
                      Prise de muscle
                    </SelectItem>
                    <SelectItem value="endurance">
                      Améliorer l'endurance
                    </SelectItem>
                    <SelectItem value="force">Développer la force</SelectItem>
                    <SelectItem value="tonification">Tonification</SelectItem>
                    <SelectItem value="preparation_sport">
                      Préparation sportive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Disponibilité */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 text-success" />
              Disponibilité
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_days">
                  Jours disponibles par semaine
                </Label>
                <Select
                  value={formData.available_days}
                  onValueChange={(value) =>
                    handleChange("available_days", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nombre de jours" />
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

              <div className="space-y-2">
                <Label htmlFor="session_duration">Durée par séance</Label>
                <Select
                  value={formData.session_duration}
                  onValueChange={(value) =>
                    handleChange("session_duration", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durée en minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes médicales */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5 text-destructive" />
              Informations médicales
            </h3>

            <div className="space-y-2">
              <Label htmlFor="medical_notes">
                Notes médicales et restrictions
              </Label>
              <Textarea
                id="medical_notes"
                value={formData.medical_notes}
                onChange={(e) => handleChange("medical_notes", e.target.value)}
                placeholder="Blessures, limitations, allergies, médicaments..."
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="energy"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            <Target className="h-5 w-5 mr-2" />
            {isLoading
              ? "Création en cours..."
              : "Générer le programme d'entraînement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
