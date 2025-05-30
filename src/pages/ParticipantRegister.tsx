import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTraining } from '../context/TrainingContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ClipboardList, Check } from 'lucide-react';

const ParticipantRegister: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, fetchTrainings, fetchParticipants, addParticipant } = useTraining();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    accessCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trainingNotFound, setTrainingNotFound] = useState(false);
  
  useEffect(() => {
    const loadTrainingData = async () => {
      if (!state.trainings.length) {
        await fetchTrainings();
      }
      
      if (id) {
        const training = state.trainings.find(t => t.id === id);
        if (training) {
          document.title = `Register for ${training.title}`;
        } else {
          setTrainingNotFound(true);
        }
      }
    };
    
    loadTrainingData();
  }, [id, fetchTrainings, state.trainings]);
  
  const training = state.trainings.find(t => t.id === id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (training?.accessCode && formData.accessCode !== training.accessCode) {
      newErrors.accessCode = 'Invalid access code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !training || !id) return;
    
    setLoading(true);
    try {
      await addParticipant({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company || undefined,
        trainingId: id
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error registering attendance:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (trainingNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardBody className="py-8">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Training Not Found</h2>
            <p className="text-gray-600 mb-6">The training you're looking for doesn't exist or has expired.</p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardBody className="py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Attendance Registered!</h2>
            <p className="text-gray-600 mb-6">
              Thank you, {formData.firstName}! Your attendance for {training?.title} has been successfully recorded.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  if (!training) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Format date
  const formattedDate = new Date(training.date).toLocaleDateString();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ClipboardList className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Attendance Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {training.title} - {formattedDate}
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              
              <Input
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              
              <Input
                id="company"
                name="company"
                type="text"
                label="Company (optional)"
                value={formData.company}
                onChange={handleChange}
              />
              
              {training.accessCode && (
                <Input
                  id="accessCode"
                  name="accessCode"
                  type="text"
                  label="Access Code"
                  value={formData.accessCode}
                  onChange={handleChange}
                  error={errors.accessCode}
                  required
                />
              )}
              
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full"
              >
                Register Attendance
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ParticipantRegister;