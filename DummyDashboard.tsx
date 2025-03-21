import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Hardcoded data
const dummyExercisePlan = {
  id: '1',
  title: 'Weekly Exercise Plan',
  description: 'A balanced exercise routine for overall fitness',
  schedule: [
    {
      day: 'Monday',
      activities: 'Morning: 30 min cardio\nEvening: Upper body strength training\n- 3 sets of push-ups\n- 3 sets of pull-ups\n- 3 sets of shoulder press'
    },
    {
      day: 'Tuesday',
      activities: 'Morning: 20 min stretching\nEvening: Lower body strength training\n- 3 sets of squats\n- 3 sets of lunges\n- 3 sets of calf raises'
    },
    {
      day: 'Wednesday',
      activities: 'Morning: 45 min cardio\nEvening: Core workout\n- 3 sets of planks\n- 3 sets of crunches\n- 3 sets of Russian twists'
    },
    {
      day: 'Thursday',
      activities: 'Morning: 30 min yoga\nEvening: Full body workout\n- 3 sets of deadlifts\n- 3 sets of bench press\n- 3 sets of rows'
    },
    {
      day: 'Friday',
      activities: 'Morning: 40 min cardio\nEvening: HIIT workout\n- 30 sec sprints\n- 30 sec rest\n- Repeat 10 times'
    },
    {
      day: 'Saturday',
      activities: 'Morning: 60 min cardio\nEvening: Flexibility training\n- 20 min stretching\n- 20 min yoga\n- 20 min mobility work'
    },
    {
      day: 'Sunday',
      activities: 'Rest day - Light walking or stretching only'
    }
  ],
  createdAt: new Date().toISOString()
};

const dummyDietPlan = {
  id: '1',
  title: 'Balanced Nutrition Plan',
  description: 'A well-balanced diet plan for optimal health',
  meals: [
    {
      name: 'Breakfast',
      description: 'Oatmeal with fruits and nuts\n- 1 cup rolled oats\n- 1 banana\n- 1 tbsp honey\n- 1/4 cup mixed nuts'
    },
    {
      name: 'Morning Snack',
      description: 'Greek yogurt with berries\n- 1 cup Greek yogurt\n- 1/2 cup mixed berries\n- 1 tbsp chia seeds'
    },
    {
      name: 'Lunch',
      description: 'Grilled chicken salad\n- 200g chicken breast\n- Mixed greens\n- Cherry tomatoes\n- Olive oil dressing'
    },
    {
      name: 'Afternoon Snack',
      description: 'Mixed nuts and fruits\n- 1/4 cup almonds\n- 1/4 cup dried fruits\n- 1 apple'
    },
    {
      name: 'Dinner',
      description: 'Salmon with vegetables\n- 200g salmon\n- Steamed broccoli\n- Brown rice\n- Lemon butter sauce'
    }
  ],
  restrictions: 'Avoid processed foods\nLimit sugar intake\nNo alcohol\nReduce sodium intake',
  recommendations: 'Drink 8 glasses of water daily\nTake multivitamins\nEat slowly and mindfully\nPlan meals in advance',
  createdAt: new Date().toISOString()
};

const dummyProgressData = {
  weight: 'Enter your weight',
  mood: 'Enter your mood',
  painLevel: 'Enter your pain level',
  notes: 'Enter your notes',
  completedExercises: 'Enter your completed exercises',
  followedDiet: 'Enter your followed diet'
};

const DummyDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('exercise');
  
  // Add state for exercise plan data
  const [exercisePlan, setExercisePlan] = useState(dummyExercisePlan);
  const [dietPlan, setDietPlan] = useState(dummyDietPlan);
  
  // Add states for editing mode
  const [editingExercise, setEditingExercise] = useState(false);
  const [editingDiet, setEditingDiet] = useState(false);
  const [editingProgress, setEditingProgress] = useState(false);
  
  // Add states for form data
  const [exerciseFormData, setExerciseFormData] = useState(exercisePlan);
  const [dietFormData, setDietFormData] = useState(dietPlan);
  const [progressData, setProgressData] = useState(dummyProgressData);
  const [progressFormData, setProgressFormData] = useState(dummyProgressData);
  
  // Check if user is a doctor or patient
  const isDoctor = userData?.role === 'doctor';
  const isPatient = userData?.role === 'patient';
  const isNutritionist = userData?.role === 'nutritionist';
  const isTrainer = userData?.role === 'trainer';
  const isAdmin = userData?.role === 'admin';
  
  // Check permissions for editing
  const canEditExercise = isDoctor || isTrainer || isAdmin;
  const canEditDiet = isDoctor || isNutritionist || isAdmin;
  
  // Handle editing exercise plan
  const handleExerciseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
    const { name, value } = e.target;
    
    if (index !== undefined && field) {
      // Handle change for schedule items
      const updatedSchedule = [...exerciseFormData.schedule];
      updatedSchedule[index] = { 
        ...updatedSchedule[index], 
        [field]: value 
      };
      
      setExerciseFormData({
        ...exerciseFormData,
        schedule: updatedSchedule
      });
    } else {
      // Handle change for basic fields
      setExerciseFormData({
        ...exerciseFormData,
        [name]: value
      });
    }
  };
  
  // Handle editing diet plan
  const handleDietFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
    const { name, value } = e.target;
    
    if (index !== undefined && field) {
      // Handle change for meal items
      const updatedMeals = [...dietFormData.meals];
      updatedMeals[index] = { 
        ...updatedMeals[index], 
        [field]: value 
      };
      
      setDietFormData({
        ...dietFormData,
        meals: updatedMeals
      });
    } else {
      // Handle change for basic fields
      setDietFormData({
        ...dietFormData,
        [name]: value
      });
    }
  };
  
  // Handle editing progress data
  const handleProgressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgressFormData({
      ...progressFormData,
      [name]: value
    });
  };
  
  // Handle save exercise plan
  const handleSaveExercisePlan = () => {
    setExercisePlan(exerciseFormData);
    setEditingExercise(false);
    // In a real app, you would save to database here
  };
  
  // Handle save diet plan
  const handleSaveDietPlan = () => {
    setDietPlan(dietFormData);
    setEditingDiet(false);
    // In a real app, you would save to database here
  };
  
  // Handle save progress data
  const handleSaveProgress = () => {
    setProgressData(progressFormData);
    setEditingProgress(false);
    // In a real app, you would save to database here
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
            Progress
          </button>
        </div>
      </div>
      
      {/* Exercise Plan Tab */}
      {activeTab === 'exercise' && (
        <div className="card">
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{exercisePlan.title}</h2>
                <p className="text-gray-300">{exercisePlan.description}</p>
              </div>
              
              {canEditExercise && (
                <button
                  className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-200"
                  onClick={() => {
                    setExerciseFormData(exercisePlan);
                    setEditingExercise(true);
                  }}
                >
                  {editingExercise ? 'Cancel' : 'Edit Plan'}
                </button>
              )}
            </div>
            
            {!editingExercise ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Weekly Schedule</h3>
                
                {exercisePlan.schedule.map((day) => (
                  <div key={day.day} className="p-4 bg-primary rounded-md">
                    <h4 className="font-medium text-accent mb-2">{day.day}</h4>
                    <p className="whitespace-pre-line">{day.activities}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={exerciseFormData.title}
                    onChange={handleExerciseFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={exerciseFormData.description}
                    onChange={handleExerciseFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                  />
                </div>
                
                <h3 className="text-xl font-semibold">Weekly Schedule</h3>
                
                {exerciseFormData.schedule.map((day, index) => (
                  <div key={index} className="p-4 bg-primary rounded-md">
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Day</label>
                      <input
                        type="text"
                        value={day.day}
                        onChange={(e) => handleExerciseFormChange(e, index, 'day')}
                        className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Activities</label>
                      <textarea
                        value={day.activities}
                        onChange={(e) => handleExerciseFormChange(e, index, 'activities')}
                        rows={5}
                        className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-200"
                    onClick={handleSaveExercisePlan}
                  >
                    Save Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Diet Plan Tab */}
      {activeTab === 'diet' && (
        <div className="card">
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{dietPlan.title}</h2>
                <p className="text-gray-300">{dietPlan.description}</p>
              </div>
              
              {canEditDiet && (
                <button
                  className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-200"
                  onClick={() => {
                    setDietFormData(dietPlan);
                    setEditingDiet(!editingDiet);
                  }}
                >
                  {editingDiet ? 'Cancel' : 'Edit Plan'}
                </button>
              )}
            </div>
            
            {!editingDiet ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Daily Meals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dietPlan.meals.map((meal) => (
                      <div key={meal.name} className="p-4 bg-primary rounded-md">
                        <h4 className="font-medium text-accent mb-2">{meal.name}</h4>
                        <p className="whitespace-pre-line">{meal.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dietary Restrictions</h3>
                  <div className="p-4 bg-primary rounded-md">
                    <p className="whitespace-pre-line">{dietPlan.restrictions}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Additional Recommendations</h3>
                  <div className="p-4 bg-primary rounded-md">
                    <p className="whitespace-pre-line">{dietPlan.recommendations}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={dietFormData.title}
                    onChange={handleDietFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={dietFormData.description}
                    onChange={handleDietFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Daily Meals</h3>
                  <div className="space-y-4">
                    {dietFormData.meals.map((meal, index) => (
                      <div key={index} className="p-4 bg-primary rounded-md">
                        <div className="mb-2">
                          <label className="block text-sm font-medium mb-1">Meal Name</label>
                          <input
                            type="text"
                            value={meal.name}
                            onChange={(e) => handleDietFormChange(e, index, 'name')}
                            className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={meal.description}
                            onChange={(e) => handleDietFormChange(e, index, 'description')}
                            rows={5}
                            className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Dietary Restrictions</label>
                  <textarea
                    name="restrictions"
                    value={dietFormData.restrictions}
                    onChange={handleDietFormChange}
                    rows={4}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Recommendations</label>
                  <textarea
                    name="recommendations"
                    value={dietFormData.recommendations}
                    onChange={handleDietFormChange}
                    rows={4}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-200"
                    onClick={handleSaveDietPlan}
                  >
                    Save Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="card">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            
            {isPatient && (
              <button
                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-200"
                onClick={() => {
                  setProgressFormData(progressData);
                  setEditingProgress(!editingProgress);
                }}
              >
                {editingProgress ? 'Cancel' : 'Update Progress'}
              </button>
            )}
          </div>
          
          {!editingProgress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary rounded-md">
                <h3 className="font-medium text-accent mb-2">Current Weight</h3>
                <p>{progressData.weight}</p>
              </div>
              
              <div className="p-4 bg-primary rounded-md">
                <h3 className="font-medium text-accent mb-2">Today's Mood</h3>
                <p>{progressData.mood}</p>
              </div>
              
              <div className="p-4 bg-primary rounded-md">
                <h3 className="font-medium text-accent mb-2">Pain Level</h3>
                <p>{progressData.painLevel}</p>
              </div>
              
              <div className="p-4 bg-primary rounded-md">
                <h3 className="font-medium text-accent mb-2">Exercise Completion</h3>
                <p>{progressData.completedExercises}</p>
              </div>
              
              <div className="p-4 bg-primary rounded-md">
                <h3 className="font-medium text-accent mb-2">Diet Adherence</h3>
                <p>{progressData.followedDiet}</p>
              </div>
              
              <div className="p-4 bg-primary rounded-md md:col-span-2">
                <h3 className="font-medium text-accent mb-2">Notes</h3>
                <p>{progressData.notes}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary rounded-md">
                  <label className="block font-medium text-accent mb-2">Current Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={progressFormData.weight}
                    onChange={handleProgressFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                    placeholder="Enter your weight"
                  />
                </div>
                
                <div className="p-4 bg-primary rounded-md">
                  <label className="block font-medium text-accent mb-2">Today's Mood</label>
                  <input
                    type="text"
                    name="mood"
                    value={progressFormData.mood}
                    onChange={handleProgressFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                    placeholder="How are you feeling today?"
                  />
                </div>
                
                <div className="p-4 bg-primary rounded-md">
                  <label className="block font-medium text-accent mb-2">Pain Level (1-10)</label>
                  <input
                    type="text"
                    name="painLevel"
                    value={progressFormData.painLevel}
                    onChange={handleProgressFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                    placeholder="Rate your pain level (1-10)"
                  />
                </div>
                
                <div className="p-4 bg-primary rounded-md">
                  <label className="block font-medium text-accent mb-2">Completed Exercises</label>
                  <input
                    type="text"
                    name="completedExercises"
                    value={progressFormData.completedExercises}
                    onChange={handleProgressFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                    placeholder="Which exercises did you complete?"
                  />
                </div>
                
                <div className="p-4 bg-primary rounded-md">
                  <label className="block font-medium text-accent mb-2">Diet Adherence</label>
                  <input
                    type="text"
                    name="followedDiet"
                    value={progressFormData.followedDiet}
                    onChange={handleProgressFormChange}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                    placeholder="How well did you follow your diet plan?"
                  />
                </div>
                
                <div className="p-4 bg-primary rounded-md md:col-span-2">
                  <label className="block font-medium text-accent mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={progressFormData.notes}
                    onChange={handleProgressFormChange}
                    rows={4}
                    className="w-full p-2 bg-primary border border-gray-700 rounded-md text-white"
                    placeholder="Any additional notes or observations"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-200"
                  onClick={handleSaveProgress}
                >
                  Save Progress
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DummyDashboard; 