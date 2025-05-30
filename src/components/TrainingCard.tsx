import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Training } from '../types';
import { Card, CardBody, CardFooter } from './ui/Card';
import { Users, Calendar, Clock, MapPin, MonitorSmartphone } from 'lucide-react';
import Button from './ui/Button';

interface TrainingCardProps {
  training: Training;
  participantCount?: number;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ training, participantCount = 0 }) => {
  const navigate = useNavigate();
  
  // Format date
  const formattedDate = new Date(training.date).toLocaleDateString();
  
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardBody>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 truncate">
          {training.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            <span>{training.startTime} - {training.endTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MonitorSmartphone className="h-4 w-4 mr-2 text-blue-600" />
            <span>{training.mode === 'online' ? 'Online' : 'In-person'}</span>
          </div>
          
          {training.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <span className="truncate">{training.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            <span>{participantCount} participants</span>
          </div>
        </div>
      </CardBody>
      
      <CardFooter>
        <Button 
          variant="primary"
          className="w-full"
          onClick={() => navigate(`/training/${training.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrainingCard;