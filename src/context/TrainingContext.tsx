import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TrainingState, Training, Participant, User } from '../types';
import { useAuth } from './AuthContext';

type TrainingAction = 
  | { type: 'FETCH_TRAININGS_START' }
  | { type: 'FETCH_TRAININGS_SUCCESS'; payload: Training[] }
  | { type: 'FETCH_TRAININGS_FAILURE'; payload: string }
  | { type: 'CREATE_TRAINING_START' }
  | { type: 'CREATE_TRAINING_SUCCESS'; payload: Training }
  | { type: 'CREATE_TRAINING_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_TRAINING'; payload: Training }
  | { type: 'FETCH_PARTICIPANTS_SUCCESS'; payload: Participant[] }
  | { type: 'ADD_PARTICIPANT_SUCCESS'; payload: Participant }
  | { type: 'RESET_STATE' };

const initialState: TrainingState = {
  trainings: [],
  currentTraining: null,
  participants: [],
  isLoading: false,
  error: null
};

// For demo purposes, we'll simulate data storage with localStorage
// In a real app, this would connect to a backend API
const trainingReducer = (state: TrainingState, action: TrainingAction): TrainingState => {
  switch (action.type) {
    case 'FETCH_TRAININGS_START':
    case 'CREATE_TRAINING_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'FETCH_TRAININGS_SUCCESS':
      return {
        ...state,
        trainings: action.payload,
        isLoading: false,
        error: null
      };
    case 'CREATE_TRAINING_SUCCESS':
      return {
        ...state,
        trainings: [...state.trainings, action.payload],
        currentTraining: action.payload,
        isLoading: false,
        error: null
      };
    case 'FETCH_TRAININGS_FAILURE':
    case 'CREATE_TRAINING_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'SET_CURRENT_TRAINING':
      return {
        ...state,
        currentTraining: action.payload
      };
    case 'FETCH_PARTICIPANTS_SUCCESS':
      return {
        ...state,
        participants: action.payload
      };
    case 'ADD_PARTICIPANT_SUCCESS':
      return {
        ...state,
        participants: [...state.participants, action.payload]
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

type TrainingContextType = {
  state: TrainingState;
  fetchTrainings: () => Promise<void>;
  createTraining: (trainingData: Omit<Training, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  setCurrentTraining: (training: Training) => void;
  fetchParticipants: (trainingId: string) => Promise<void>;
  addParticipant: (participantData: Omit<Participant, 'id' | 'registeredAt'>) => Promise<void>;
  resetState: () => void;
  getTrainingUrl: (trainingId: string) => string;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(trainingReducer, initialState);
  const { state: authState } = useAuth();

  // Reset state when user logs out
  useEffect(() => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [authState.isAuthenticated]);

  // Load trainings from localStorage when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchTrainings();
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchTrainings = async () => {
    if (!authState.user) return;
    
    dispatch({ type: 'FETCH_TRAININGS_START' });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedTrainings = localStorage.getItem(`trainings-${authState.user.id}`);
      const trainings = storedTrainings ? JSON.parse(storedTrainings) : [];
      
      dispatch({ type: 'FETCH_TRAININGS_SUCCESS', payload: trainings });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_TRAININGS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch trainings'
      });
    }
  };

  const createTraining = async (trainingData: Omit<Training, 'id' | 'userId' | 'createdAt'>) => {
    if (!authState.user) return;
    
    dispatch({ type: 'CREATE_TRAINING_START' });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTraining: Training = {
        ...trainingData,
        id: `training-${Date.now()}`,
        userId: authState.user.id,
        createdAt: new Date()
      };
      
      const storedTrainings = localStorage.getItem(`trainings-${authState.user.id}`);
      const trainings = storedTrainings ? JSON.parse(storedTrainings) : [];
      
      const updatedTrainings = [...trainings, newTraining];
      localStorage.setItem(`trainings-${authState.user.id}`, JSON.stringify(updatedTrainings));
      
      dispatch({ type: 'CREATE_TRAINING_SUCCESS', payload: newTraining });
    } catch (error) {
      dispatch({ 
        type: 'CREATE_TRAINING_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to create training'
      });
    }
  };

  const setCurrentTraining = (training: Training) => {
    dispatch({ type: 'SET_CURRENT_TRAINING', payload: training });
  };

  const fetchParticipants = async (trainingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedParticipants = localStorage.getItem(`participants-${trainingId}`);
      const participants = storedParticipants ? JSON.parse(storedParticipants) : [];
      
      dispatch({ type: 'FETCH_PARTICIPANTS_SUCCESS', payload: participants });
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  };

  const addParticipant = async (participantData: Omit<Participant, 'id' | 'registeredAt'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newParticipant: Participant = {
        ...participantData,
        id: `participant-${Date.now()}`,
        registeredAt: new Date()
      };
      
      const storedParticipants = localStorage.getItem(`participants-${participantData.trainingId}`);
      const participants = storedParticipants ? JSON.parse(storedParticipants) : [];
      
      const updatedParticipants = [...participants, newParticipant];
      localStorage.setItem(`participants-${participantData.trainingId}`, JSON.stringify(updatedParticipants));
      
      dispatch({ type: 'ADD_PARTICIPANT_SUCCESS', payload: newParticipant });
      return newParticipant;
    } catch (error) {
      console.error('Failed to add participant:', error);
      throw error;
    }
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const getTrainingUrl = (trainingId: string) => {
    // In a real app, this would be a proper URL
    // For demo, we'll use a local route
    return `/register/${trainingId}`;
  };

  return (
    <TrainingContext.Provider value={{ 
      state, 
      fetchTrainings, 
      createTraining, 
      setCurrentTraining,
      fetchParticipants,
      addParticipant,
      resetState,
      getTrainingUrl
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};