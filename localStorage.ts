// Types
export interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface ExercisePlan {
  id: string;
  patientId: string;
  title: string;
  description: string;
  schedule: {
    day: string;
    activities: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DietPlan {
  id: string;
  patientId: string;
  title: string;
  description: string;
  meals: {
    name: string;
    description: string;
  }[];
  restrictions: string;
  recommendations: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressUpdate {
  id: string;
  patientId: string;
  weight: number;
  mood: string;
  painLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  notes: string;
  completedExercises: string;
  followedDiet: string;
  createdAt: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'health_tracker_users',
  EXERCISE_PLANS: 'health_tracker_exercise_plans',
  DIET_PLANS: 'health_tracker_diet_plans',
  PROGRESS_UPDATES: 'health_tracker_progress_updates',
};

// Helper functions
const getItem = <T>(key: string): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// User functions
export const registerUser = async (email: string, password: string, role: string, name: string): Promise<User> => {
  const users = getItem<User>(STORAGE_KEYS.USERS);
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    uid: Math.random().toString(36).substr(2, 9),
    email,
    name,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const users = getItem<User>(STORAGE_KEYS.USERS);
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const users = getItem<User>(STORAGE_KEYS.USERS);
  return users.find(user => user.uid === uid) || null;
};

// Exercise plan functions
export const createExercisePlan = async (patientId: string, plan: Omit<ExercisePlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const plans = getItem<ExercisePlan>(STORAGE_KEYS.EXERCISE_PLANS);
  
  const newPlan: ExercisePlan = {
    ...plan,
    id: Math.random().toString(36).substr(2, 9),
    patientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  plans.push(newPlan);
  setItem(STORAGE_KEYS.EXERCISE_PLANS, plans);
  return newPlan.id;
};

export const getExercisePlans = async (patientId: string): Promise<ExercisePlan[]> => {
  const plans = getItem<ExercisePlan>(STORAGE_KEYS.EXERCISE_PLANS);
  return plans.filter(plan => plan.patientId === patientId);
};

// Diet plan functions
export const createDietPlan = async (patientId: string, plan: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const plans = getItem<DietPlan>(STORAGE_KEYS.DIET_PLANS);
  
  const newPlan: DietPlan = {
    ...plan,
    id: Math.random().toString(36).substr(2, 9),
    patientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  plans.push(newPlan);
  setItem(STORAGE_KEYS.DIET_PLANS, plans);
  return newPlan.id;
};

export const getDietPlans = async (patientId: string): Promise<DietPlan[]> => {
  const plans = getItem<DietPlan>(STORAGE_KEYS.DIET_PLANS);
  return plans.filter(plan => plan.patientId === patientId);
};

// Progress update functions
export const updateProgress = async (patientId: string, update: Omit<ProgressUpdate, 'id' | 'patientId' | 'createdAt'>): Promise<string> => {
  const updates = getItem<ProgressUpdate>(STORAGE_KEYS.PROGRESS_UPDATES);
  
  const newUpdate: ProgressUpdate = {
    ...update,
    id: Math.random().toString(36).substr(2, 9),
    patientId,
    createdAt: new Date().toISOString()
  };

  updates.push(newUpdate);
  setItem(STORAGE_KEYS.PROGRESS_UPDATES, updates);
  return newUpdate.id;
};

export const getProgressUpdates = async (patientId: string): Promise<ProgressUpdate[]> => {
  const updates = getItem<ProgressUpdate>(STORAGE_KEYS.PROGRESS_UPDATES);
  return updates.filter(update => update.patientId === patientId);
};

// Add these functions after the existing functions

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const deleteUser = (userId: string): void => {
  const users = getAllUsers();
  const updatedUsers = users.filter(user => user.uid !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
};

// Add default entries if no users exist
const initializeDefaultUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  
  // For debugging
  console.log('Current users in storage:', users);
  
  if (!users || JSON.parse(users).length === 0) {
    console.log('Initializing default users');
    const defaultUsers: User[] = [
      {
        uid: '1',
        name: 'Devansh Popli',
        email: 'superdevansh2006@gmail.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        uid: '2',
        name: 'Ankit',
        email: 'ankit@gmail.com',
        role: 'patient',
        createdAt: new Date().toISOString()
      },
      {
        uid: '3',
        name: 'Akash',
        email: 'akashpopli@gmail.com',
        role: 'doctor',
        createdAt: new Date().toISOString()
      },
      {
        uid: '4',
        name: 'Gujar',
        email: 'ridhikagurjar@gmail.com',
        role: 'nutritionist',
        createdAt: new Date().toISOString()
      },
      {
        uid: '5',
        name: 'gopinathswamy',
        email: 'gopi@gmail.com',
        role: 'trainer',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    console.log('Default users initialized:', defaultUsers);
  }
};

// Initialize default users when the service is loaded
initializeDefaultUsers();

// Export a function to force initialization for components that need it
export const ensureDefaultUsers = () => {
  initializeDefaultUsers();
}; 