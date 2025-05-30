import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTraining } from '../context/TrainingContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';

const CreateTraining: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    mode: 'in-person',
    location: '',
    instructor: '',
    materials: '',
    accessCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createTraining, state } = useTraining();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Training title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (formData.mode === 'in-person' && !formData.location?.trim()) {
      newErrors.location = 'Location is required for in-person trainings';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await createTraining({
        title: formData.title,
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        mode: formData.mode as 'online' | 'in-person',
        location: formData.location || undefined,
        instructor: formData.instructor || undefined,
        materials: formData.materials || undefined,
        accessCode: formData.accessCode || undefined
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating training:', error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
        <h1 className="text-2xl font-bold">Create New Training</h1>
      </div>
      
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                <Input
                  id="title"
                  name="title"
                  label="Training Title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    required
                  />
                  
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleChange}
                    error={errors.startTime}
                    required
                  />
                  
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    label="End Time"
                    value={formData.endTime}
                    onChange={handleChange}
                    error={errors.endTime}
                    required
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Training Details</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Mode
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="mode"
                        value="in-person"
                        checked={formData.mode === 'in-person'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">In-person</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="mode"
                        value="online"
                        checked={formData.mode === 'online'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Online</span>
                    </label>
                  </div>
                </div>
                
                <Input
                  id="location"
                  name="location"
                  label={formData.mode === 'online' ? 'Meeting Link' : 'Location'}
                  placeholder={formData.mode === 'online' ? 'https://zoom.us/j/123456789' : 'Training Center, Room 101'}
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                  required={formData.mode === 'in-person'}
                />
                
                <Input
                  id="instructor"
                  name="instructor"
                  label="Instructor Name (optional)"
                  value={formData.instructor}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Additional Options</h2>
                
                <div className="mb-4">
                  <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
                    Materials/Notes (optional)
                  </label>
                  <textarea
                    id="materials"
                    name="materials"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.materials}
                    onChange={handleChange}
                  />
                </div>
                
                <Input
                  id="accessCode"
                  name="accessCode"
                  label="Access Code (optional)"
                  helper="If set, participants will need this code to register their attendance"
                  value={formData.accessCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-5 w-5" />}
                isLoading={state.isLoading}
              >
                Create Training
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateTraining;