import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getExercisePlans, getDietPlans, updateProgress } from '../services/firebase';

type ExercisePlan = {
  id: string;
  title: string;
  description: string;
  schedule: {
    day: string;
    activities: string;
  }[];
  createdAt: string;
};

type DietPlan = {
  id: string;
  title: string;
  description: string;
  meals: {
    name: string;
    description: string;
  }[];
  restrictions: string;
  recommendations: string;
  createdAt: string;
};

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('exercise');
  const [exercisePlans, setExercisePlans] = useState<ExercisePlan[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressUpdate, setProgressUpdate] = useState({
    weight: '',
    mood: '',
    painLevel: '',
    notes: '',
    completedExercises: '',
    followedDiet: '',
  });
  const [painLevelError, setPainLevelError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      if (currentUser) {
        try {
          // Fetch exercise plans
          const exerciseData = await getExercisePlans(currentUser.uid);
          setExercisePlans(exerciseData as ExercisePlan[]);

          // Fetch diet plans
          const dietData = await getDietPlans(currentUser.uid);
          setDietPlans(dietData as DietPlan[]);
        } catch (error) {
          console.error("Error fetching plans:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPlans();
  }, [currentUser]);

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    // Validate pain level
    const painLevel = parseInt(progressUpdate.painLevel);
    if (painLevel > 10) {
      setPainLevelError('Pain level must not exceed 10');
      setErrorMessage('Pain level must not exceed 10');
      setShowErrorPopup(true);
      
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 4000);
      
      return;
    }
    
    try {
      await updateProgress(currentUser.uid, progressUpdate);
      alert("Progress update submitted successfully!");
      
      setProgressUpdate({
        weight: '',
        mood: '',
        painLevel: '',
        notes: '',
        completedExercises: '',
        followedDiet: '',
      });
      setPainLevelError('');
    } catch (error) {
      console.error("Error submitting progress:", error);
      alert("Failed to submit progress update");
    }
  };

  // Handle pain level change with validation
  const handlePainLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProgressUpdate({...progressUpdate, painLevel: value});
    
    // Clear previous error
    if (painLevelError) {
      setPainLevelError('');
    }
    
    // Show error if value > 10
    if (value && parseInt(value) > 10) {
      setPainLevelError('Pain level must not exceed 10');
    }
  };

  // Get the most recent plans
  const latestExercisePlan = exercisePlans.length > 0
    ? exercisePlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;
    
  const latestDietPlan = dietPlans.length > 0
    ? dietPlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  return (
    <div>
      {showErrorPopup && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setShowErrorPopup(false)}
            className="absolute top-1 right-1 text-white"
          >
            ✕
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Your Health Dashboard</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'exercise' 
                ? 'border-b-2 border-accent text-accent' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('exercise')}
          >
            Exercise Plan
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'diet' 
                ? 'border-b-2 border-accent text-accent' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('diet')}
          >
            Diet Plan
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'progress' 
                ? 'border-b-2 border-accent text-accent' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            Update Progress
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="card p-8 text-center">
          <p>Loading your health plans...</p>
        </div>
      ) : (
        <>
          {/* Exercise Plan Tab */}
          {activeTab === 'exercise' && (
            <div className="card">
              {!latestExercisePlan ? (
                <div className="p-8 text-center">
                  <p>No exercise plan available yet. Your healthcare provider will create one for you soon.</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{latestExercisePlan.title}</h2>
                    <p className="text-gray-300">{latestExercisePlan.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Weekly Schedule</h3>
                    
                    {latestExercisePlan.schedule.map((day) => (
                      <div key={day.day} className="p-4 bg-primary rounded-md">
                        <h4 className="font-medium text-accent mb-2">{day.day}</h4>
                        {day.activities ? (
                          <p className="whitespace-pre-line">{day.activities}</p>
                        ) : (
                          <p className="text-gray-400">Rest day</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Diet Plan Tab */}
          {activeTab === 'diet' && (
            <div className="card">
              {!latestDietPlan ? (
                <div className="p-8 text-center">
                  <p>No diet plan available yet. Your healthcare provider will create one for you soon.</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{latestDietPlan.title}</h2>
                    <p className="text-gray-300">{latestDietPlan.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Daily Meals</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {latestDietPlan.meals.map((meal) => (
                          <div key={meal.name} className="p-4 bg-primary rounded-md">
                            <h4 className="font-medium text-accent mb-2">{meal.name}</h4>
                            {meal.description ? (
                              <p className="whitespace-pre-line">{meal.description}</p>
                            ) : (
                              <p className="text-gray-400">No specific recommendations</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {latestDietPlan.restrictions && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Dietary Restrictions</h3>
                        <div className="p-4 bg-primary rounded-md">
                          <p className="whitespace-pre-line">{latestDietPlan.restrictions}</p>
                        </div>
                      </div>
                    )}
                    
                    {latestDietPlan.recommendations && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Additional Recommendations</h3>
                        <div className="p-4 bg-primary rounded-md">
                          <p className="whitespace-pre-line">{latestDietPlan.recommendations}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Progress Update Tab */}
          {activeTab === 'progress' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Update Your Progress</h2>
              <form onSubmit={handleProgressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Current Weight</label>
                    <input
                      type="text"
                      value={progressUpdate.weight}
                      onChange={(e) => setProgressUpdate({...progressUpdate, weight: e.target.value})}
                      className="form-input"
                      placeholder="e.g., 70kg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">Today's Mood</label>
                    <select
                      value={progressUpdate.mood}
                      onChange={(e) => setProgressUpdate({...progressUpdate, mood: e.target.value})}
                      className="form-input"
                    >
                      <option value="">Select mood</option>
                      <option value="Great">Great</option>
                      <option value="Good">Good</option>
                      <option value="Okay">Okay</option>
                      <option value="Not so good">Not so good</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">Pain Level (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={progressUpdate.painLevel}
                      onChange={handlePainLevelChange}
                      className={`form-input ${painLevelError ? 'border-red-500' : ''}`}
                      placeholder="1-10"
                    />
                    {painLevelError && (
                      <div className="text-red-500 text-sm mt-1">{painLevelError}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">Completed Exercise Activities</label>
                    <textarea
                      value={progressUpdate.completedExercises}
                      onChange={(e) => setProgressUpdate({...progressUpdate, completedExercises: e.target.value})}
                      className="form-input"
                      rows={2}
                      placeholder="List exercises you've completed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">Diet Adherence</label>
                    <textarea
                      value={progressUpdate.followedDiet}
                      onChange={(e) => setProgressUpdate({...progressUpdate, followedDiet: e.target.value})}
                      className="form-input"
                      rows={2}
                      placeholder="Comment on how well you've followed your diet plan"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Additional Notes</label>
                  <textarea
                    value={progressUpdate.notes}
                    onChange={(e) => setProgressUpdate({...progressUpdate, notes: e.target.value})}
                    className="form-input"
                    rows={4}
                    placeholder="Any other information you want to share with your healthcare provider"
                  />
                </div>
                
                <button type="submit" className="btn btn-primary mt-4">
                  Submit Progress Update
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientDashboard; 