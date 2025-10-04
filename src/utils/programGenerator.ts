interface ClientData {
  name: string;
  age: string;
  fitness_level: string;
  objective: string;
  available_days: string;
  session_duration: string;
  medical_notes: string;
}

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

// Exercises database organized by objective and level
const exerciseDatabase = {
  perte_poids: {
    debutant: [
      { name: "Marche rapide", sets: "1", reps: "20-30 min", rest: "-", notes: "Maintenir un rythme soutenu" },
      { name: "Squats au poids du corps", sets: "3", reps: "8-12", rest: "60s", notes: "Descendre jusqu'aux genoux à 90°" },
      { name: "Pompes sur genoux", sets: "3", reps: "5-10", rest: "60s", notes: "Garder le corps aligné" },
      { name: "Planche", sets: "3", reps: "15-30s", rest: "45s", notes: "Maintenir la position" },
      { name: "Mountain climbers", sets: "3", reps: "20", rest: "45s", notes: "Rythme modéré" }
    ],
    intermediaire: [
      { name: "Course à pied", sets: "1", reps: "25-35 min", rest: "-", notes: "Alterner course et marche" },
      { name: "Burpees", sets: "3", reps: "8-12", rest: "60s", notes: "Mouvement complet" },
      { name: "Jumping jacks", sets: "4", reps: "30s", rest: "30s", notes: "Rythme soutenu" },
      { name: "Squats sautés", sets: "3", reps: "10-15", rest: "60s", notes: "Atterrissage en douceur" },
      { name: "Gainage latéral", sets: "3", reps: "30-45s", rest: "45s", notes: "Chaque côté" }
    ]
  },
  prise_muscle: {
    debutant: [
      { name: "Développé couché haltères", sets: "3", reps: "8-12", rest: "90s", notes: "Contrôler la descente" },
      { name: "Squats goblet", sets: "3", reps: "10-12", rest: "90s", notes: "Tenir un haltère devant soi" },
      { name: "Rowing haltères", sets: "3", reps: "8-12", rest: "90s", notes: "Serrer les omoplates" },
      { name: "Développé militaire assis", sets: "3", reps: "8-10", rest: "90s", notes: "Garder le dos droit" },
      { name: "Curl biceps", sets: "3", reps: "10-12", rest: "60s", notes: "Mouvement contrôlé" }
    ],
    intermediaire: [
      { name: "Développé couché barre", sets: "4", reps: "6-10", rest: "2-3 min", notes: "Augmenter progressivement" },
      { name: "Squats barre", sets: "4", reps: "8-12", rest: "2-3 min", notes: "Profondeur complète" },
      { name: "Soulevé de terre", sets: "3", reps: "6-8", rest: "3 min", notes: "Technique parfaite" },
      { name: "Tractions assistées", sets: "3", reps: "6-10", rest: "2 min", notes: "Amplitude complète" },
      { name: "Dips", sets: "3", reps: "8-12", rest: "90s", notes: "Contrôler la descente" }
    ]
  },
  endurance: {
    debutant: [
      { name: "Marche rapide", sets: "1", reps: "30-40 min", rest: "-", notes: "Rythme constant" },
      { name: "Vélo stationnaire", sets: "1", reps: "20-30 min", rest: "-", notes: "Résistance modérée" },
      { name: "Circuit cardio léger", sets: "3", reps: "10 exercices", rest: "30s", notes: "30s par exercice" },
      { name: "Étirements dynamiques", sets: "1", reps: "10 min", rest: "-", notes: "Préparation musculaire" }
    ],
    intermediaire: [
      { name: "Course continue", sets: "1", reps: "35-45 min", rest: "-", notes: "Rythme conversationnel" },
      { name: "Intervalles courts", sets: "8", reps: "1 min", rest: "1 min", notes: "Rythme élevé" },
      { name: "Circuit training", sets: "4", reps: "12 exercices", rest: "45s", notes: "45s par exercice" },
      { name: "Natation", sets: "1", reps: "30-40 min", rest: "-", notes: "Différentes nages" }
    ]
  }
};

const getWorkoutSchedule = (days: string) => {
  const dayCount = parseInt(days);
  const schedules: { [key: number]: string[] } = {
    2: ["Lundi", "Jeudi"],
    3: ["Lundi", "Mercredi", "Vendredi"],
    4: ["Lundi", "Mardi", "Jeudi", "Vendredi"],
    5: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
    6: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
  };
  return schedules[dayCount] || schedules[3];
};

const getFocusAreas = (objective: string, days: string) => {
  const dayCount = parseInt(days);
  
  const focusPlans: { [key: string]: { [key: number]: string[] } } = {
    perte_poids: {
      2: ["Cardio + Force", "HIIT + Core"],
      3: ["Cardio-Force", "HIIT", "Renforcement"],
      4: ["Cardio", "Force haut", "HIIT", "Force bas"],
      5: ["Cardio", "Force haut", "HIIT", "Force bas", "Recovery cardio"],
      6: ["Cardio", "Force haut", "HIIT", "Force bas", "Cardio", "Core"]
    },
    prise_muscle: {
      2: ["Haut du corps", "Bas du corps"],
      3: ["Haut du corps", "Bas du corps", "Full body"],
      4: ["Pectoraux-Triceps", "Dos-Biceps", "Jambes", "Épaules"],
      5: ["Pectoraux-Triceps", "Dos-Biceps", "Jambes", "Épaules", "Full body"],
      6: ["Pectoraux", "Dos", "Jambes", "Épaules-Bras", "Jambes", "Core"]
    },
    endurance: {
      2: ["Cardio long", "Cardio intensité"],
      3: ["Cardio base", "Intervalles", "Récupération"],
      4: ["Cardio base", "Intervalles", "Tempo", "Récupération"],
      5: ["Cardio base", "Intervalles", "Tempo", "Récupération", "Cross-training"],
      6: ["Cardio base", "Intervalles", "Tempo", "Récupération", "Cross-training", "Cardio léger"]
    }
  };

  return focusPlans[objective]?.[dayCount] || focusPlans[objective]?.[3] || ["Entraînement complet"];
};

const getPersonalizedTips = (clientData: ClientData): string[] => {
  const tips: string[] = [];
  
  // Age-based tips
  const age = parseInt(clientData.age);
  if (age < 25) {
    tips.push("À votre âge, la récupération est rapide. Vous pouvez augmenter l'intensité progressivement.");
  } else if (age >= 40) {
    tips.push("Accordez une attention particulière à l'échauffement et aux étirements.");
  }

  // Level-based tips
  if (clientData.fitness_level === 'debutant') {
    tips.push("Commencez doucement et concentrez-vous sur la technique avant l'intensité.");
    tips.push("Augmentez la charge de travail de 10% maximum par semaine.");
  }

  // Objective-based tips
  if (clientData.objective === 'perte_poids') {
    tips.push("Combinez l'entraînement avec une alimentation équilibrée pour de meilleurs résultats.");
    tips.push("Hydratez-vous bien avant, pendant et après l'entraînement.");
  } else if (clientData.objective === 'prise_muscle') {
    tips.push("Consommez des protéines dans les 30 minutes suivant l'entraînement.");
    tips.push("Le repos est crucial : 48h entre deux séances pour le même groupe musculaire.");
  }

  // Duration-based tips
  const duration = parseInt(clientData.session_duration);
  if (duration <= 30) {
    tips.push("Privilégiez les exercices composés pour maximiser l'efficacité de vos courtes séances.");
  }

  // Medical notes
  if (clientData.medical_notes.trim()) {
    tips.push("Respectez vos limitations médicales et consultez un professionnel si nécessaire.");
  }

  // General tips
  tips.push("Écoutez votre corps et n'hésitez pas à adapter l'intensité selon votre forme du jour.");
  tips.push("La régularité est plus importante que l'intensité ponctuelle.");

  return tips;
};

export const generateProgram = (clientData: ClientData): ProgramData => {
  const schedule = getWorkoutSchedule(clientData.available_days);
  const focusAreas = getFocusAreas(clientData.objective, clientData.available_days);
  
  // Get exercises based on objective and level
  const availableExercises = exerciseDatabase[clientData.objective as keyof typeof exerciseDatabase]?.[clientData.fitness_level as keyof typeof exerciseDatabase['perte_poids']] || 
                            exerciseDatabase.perte_poids.debutant;

  const workoutDays: WorkoutDay[] = schedule.map((day, index) => {
    // Select 4-6 exercises per day
    const exerciseCount = clientData.fitness_level === 'debutant' ? 4 : 5;
    const dayExercises = availableExercises.slice(0, exerciseCount);
    
    return {
      day: day,
      focus: focusAreas[index] || "Entraînement complet",
      exercises: dayExercises,
      duration: clientData.session_duration + " minutes"
    };
  });

  return {
    clientName: clientData.name,
    objective: clientData.objective,
    level: clientData.fitness_level,
    duration: `${clientData.available_days} jours par semaine`,
    workoutDays,
    tips: getPersonalizedTips(clientData)
  };
};