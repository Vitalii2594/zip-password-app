import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTraining } from '../context/TrainingContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import QRCodeGenerator from '../components/QRCodeGenerator';
import ParticipantList from '../components/ParticipantList';
import { ArrowLeft, Calendar, Clock, MapPin, MonitorSmartphone, User, Download } from 'lucide-react';

const TrainingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    state, 
    fetchTrainings, 
    setCurrentTraining, 
    fetchParticipants,
    getTrainingUrl
  } = useTraining();
  
  useEffect(() => {
    if (!state.trainings.length) {
      fetchTrainings();
    }
  }, [fetchTrainings, state.trainings.length]);
  
  useEffect(() => {
    if (id && state.trainings.length) {
      const training = state.trainings.find(t => t.id === id);
      if (training) {
        setCurrentTraining(training);
        fetchParticipants(training.id);
      }
    }
  }, [id, state.trainings, setCurrentTraining, fetchParticipants]);
  
  const training = state.currentTraining;
  
  const handleExportList = () => {
    if (!training || !state.participants.length) return;
    
    // Create CSV content
    const headers = ['First Name', 'Last Name', 'Email', 'Company', 'Registration Time'];
    const rows = state.participants.map(p => [
      p.firstName,
      p.lastName,
      p.email,
      p.company || '',
      new Date(p.registeredAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${training.title.replace(/\s+/g, '_')}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (!training) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Format date
  const formattedDate = new Date(training.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold truncate">{training.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Training Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Date</h3>
                    <p>{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Time</h3>
                    <p>{training.startTime} - {training.endTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MonitorSmartphone className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Mode</h3>
                    <p>{training.mode === 'online' ? 'Online' : 'In-person'}</p>
                  </div>
                </div>
                
                {training.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">{training.mode === 'online' ? 'Meeting Link' : 'Location'}</h3>
                      <p className="break-words">{training.location}</p>
                    </div>
                  </div>
                )}
                
                {training.instructor && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Instructor</h3>
                      <p>{training.instructor}</p>
                    </div>
                  </div>
                )}
                
                {training.materials && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-medium mb-2">Materials & Notes</h3>
                    <p className="text-gray-700 whitespace-pre-line">{training.materials}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          
          <QRCodeGenerator 
            url={getTrainingUrl(training.id)} 
            trainingTitle={training.title}
          />
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Attendance Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-blue-600">{state.participants.length}</div>
                <p className="text-gray-600">Registered Participants</p>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={handleExportList}
                  disabled={!state.participants.length}
                >
                  Export List
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      
      <ParticipantList 
        participants={state.participants} 
        onExport={handleExportList}
      />
    </div>
  );
};

export default TrainingDetails;