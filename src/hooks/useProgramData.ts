import { useState, useEffect } from 'react';

interface Program {
  id: string;
  clientId: string;
  clientName: string;
  objective: string;
  level: string;
  duration: string;
  workoutDays: any[];
  tips: string[];
}

export const useProgramData = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300));
      // Pas de données - liste vide
      setPrograms([]);
    } catch (err) {
      console.error('Erreur lors du chargement des programmes:', err);
      setError('Erreur lors du chargement des programmes');
    } finally {
      setIsLoading(false);
    }
  };

  const createProgram = async (programData: Omit<Program, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      // Créer un nouveau programme avec un ID généré
      const newProgram = {
        ...programData,
        id: Date.now().toString(),
      };
      setCurrentProgram(newProgram);
      setPrograms([...programs, newProgram]);
      return newProgram;
    } catch (err) {
      console.error('Erreur lors de la création du programme:', err);
      setError('Erreur lors de la création du programme');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultProgram = (clientName: string, objective: string, level: string): Program => {
    // Programme par défaut pour la démo
    return {
      id: Date.now().toString(),
      clientId: 'demo',
      clientName,
      objective,
      level,
      duration: '4 semaines',
      workoutDays: [
        {
          day: 'Jour 1 - Haut du corps',
          focus: 'Force & Endurance',
          duration: '45 min',
          exercises: [
            {
              name: 'Pompes',
              sets: '3',
              reps: '12-15',
              rest: '60s',
              notes: 'Gardez le corps bien droit'
            },
            {
              name: 'Tractions assistées',
              sets: '3',
              reps: '8-10',
              rest: '90s',
              notes: 'Utilisez un élastique si nécessaire'
            },
            {
              name: 'Développé haltères',
              sets: '3',
              reps: '10-12',
              rest: '60s',
              notes: 'Contrôlez la descente'
            }
          ]
        },
        {
          day: 'Jour 2 - Bas du corps',
          focus: 'Force & Stabilité',
          duration: '50 min',
          exercises: [
            {
              name: 'Squats',
              sets: '4',
              reps: '15-20',
              rest: '60s',
              notes: 'Descendez bien en parallèle'
            },
            {
              name: 'Fentes alternées',
              sets: '3',
              reps: '12 par jambe',
              rest: '45s',
              notes: 'Gardez le dos droit'
            },
            {
              name: 'Pont fessier',
              sets: '3',
              reps: '15-20',
              rest: '45s',
              notes: 'Contractez bien les fessiers'
            }
          ]
        }
      ],
      tips: [
        'Hydratez-vous régulièrement pendant et après l\'entraînement',
        'Respectez les temps de repos entre les séries',
        'Écoutez votre corps et adaptez l\'intensité si nécessaire',
        'Maintenez une alimentation équilibrée pour optimiser vos résultats'
      ]
    };
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    currentProgram,
    setCurrentProgram,
    isLoading,
    error,
    fetchPrograms,
    createProgram,
    generateDefaultProgram
  };
};
