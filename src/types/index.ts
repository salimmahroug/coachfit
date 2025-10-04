// Types globaux de l'application

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Client {
  _id: string;
  id?: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  objective: string;
  level: string;
  availableDays?: number | string;
  sessionDuration?: number | string;
  medicalNotes?: string;
  programId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exercise {
  name: string;
  sets: string | number;
  reps: string | number;
  rest: string | number;
  notes?: string;
}

export interface Workout {
  day: string;
  focus: string;
  duration: string | number;
  exercises: Exercise[];
}

export interface Program {
  _id: string;
  id?: string;
  clientId: string;
  name: string;
  objective: string;
  level: string;
  duration: string | number;
  frequency: string | number;
  sessionDuration: string | number;
  workouts: Workout[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  _id: string;
  id?: string;
  clientId: string;
  programId: string;
  workoutId?: string;
  date: string;
  status: 'planned' | 'completed' | 'missed' | 'cancelled';
  notes?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientData {
  name: string;
  email: string;
  phone?: string;
  age: number | string;
  weight?: number;
  height?: number;
  gender: string;
  objective: string;
  level: string;
  fitnessLevel?: string;
  goals?: string[];
  availableDays?: number | string | string[];
  sessionDuration?: number | string;
  preferredTime?: string;
  equipment?: string[];
  medicalConditions?: string[];
  medicalNotes?: string;
  notes?: string;
}

export interface ProgramData {
  clientId: string;
  name: string;
  objective: string;
  level: string;
  duration: number | string;
  frequency: number | string;
  sessionDuration: number | string;
  workouts: Workout[];
}

export interface ProgressData {
  clientId: string;
  programId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: Record<string, number>;
  notes?: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}
