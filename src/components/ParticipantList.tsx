import React from 'react';
import { Participant } from '../types';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Download, UserCheck } from 'lucide-react';
import Button from './ui/Button';

interface ParticipantListProps {
  participants: Participant[];
  onExport?: () => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ 
  participants,
  onExport = () => {}
}) => {
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Participants</h2>
          <p className="text-sm text-gray-600">{participants.length} registered</p>
        </div>
        <Button 
          variant="outline"
          size="sm"
          className="mt-2 sm:mt-0"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={onExport}
        >
          Export List
        </Button>
      </CardHeader>
      <CardBody className="p-0">
        {participants.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <UserCheck className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No participants have registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {participant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {participant.company || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(participant.registeredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ParticipantList;