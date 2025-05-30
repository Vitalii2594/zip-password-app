export interface User {
  id: string;
  email: string;
  companyName: string;
  nip?: string;
  createdAt: Date;
}

export interface Training {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  mode: 'online' | 'in-person';
  location?: string;
  instructor?: string;
  materials?: string;
  accessCode?: string;
  userId: string;
  createdAt: Date;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  trainingId: string;
  registeredAt: Date;
  signature?: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type TrainingState = {
  trainings: Training[];
  currentTraining: Training | null;
  participants: Participant[];
  isLoading: boolean;
  error: string | null;
};