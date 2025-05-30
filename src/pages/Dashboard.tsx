import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTraining } from '../context/TrainingContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TrainingCard from '../components/TrainingCard';
import { PlusCircle, Calendar, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: trainingState, fetchTrainings } = useTraining();
  const navigate = useNavigate();
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);
  
  useEffect(() => {
    // Load participant counts for each training
    const loadParticipantCounts = () => {
      const counts: Record<string, number> = {};
      
      trainingState.trainings.forEach(training => {
        const storedParticipants = localStorage.getItem(`participants-${training.id}`);
        const participants = storedParticipants ? JSON.parse(storedParticipants) : [];
        counts[training.id] = participants.length;
      });
      
      setParticipantCounts(counts);
    };
    
    if (trainingState.trainings.length > 0) {
      loadParticipantCounts();
    }
  }, [trainingState.trainings]);
  
  // Get upcoming and past trainings
  const now = new Date();
  const upcomingTrainings = trainingState.trainings
    .filter(training => new Date(training.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastTrainings = trainingState.trainings
    .filter(training => new Date(training.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate statistics
  const totalTrainings = trainingState.trainings.length;
  const totalParticipants = Object.values(participantCounts).reduce((sum, count) => sum + count, 0);
  const upcomingTrainingsCount = upcomingTrainings.length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {authState.user?.companyName}</p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => navigate('/create-training')}
        >
          Create Training
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Trainings</p>
              <h3 className="text-2xl font-bold">{totalTrainings}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming Trainings</p>
              <h3 className="text-2xl font-bold">{upcomingTrainingsCount}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <h3 className="text-2xl font-bold">{totalParticipants}</h3>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Upcoming Trainings */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Upcoming Trainings</h2>
        {upcomingTrainings.length === 0 ? (
          <Card>
            <CardBody className="text-center py-10">
              <p className="text-gray-500 mb-4">You don't have any upcoming trainings.</p>
              <Button
                variant="outline"
                onClick={() => navigate('/create-training')}
                leftIcon={<PlusCircle className="h-5 w-5" />}
              >
                Create Your First Training
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrainings.map(training => (
              <TrainingCard 
                key={training.id} 
                training={training} 
                participantCount={participantCounts[training.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Past Trainings */}
      {pastTrainings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Trainings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTrainings.slice(0, 3).map(training => (
              <TrainingCard 
                key={training.id} 
                training={training} 
                participantCount={participantCounts[training.id] || 0}
              />
            ))}
          </div>
          
          {pastTrainings.length > 3 && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/training-history')}
              >
                View All Past Trainings
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;