import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Building2, Calendar, Users } from 'lucide-react';
import { Organization, mockOrganizations } from './mockData';

interface OrganizationSelectorProps {
  onSelectOrganization: (orgId: number) => void;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ 
  onSelectOrganization 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>(mockOrganizations);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredOrgs(mockOrganizations);
    } else {
      const filtered = mockOrganizations.filter(org => 
        org.name.toLowerCase().includes(term) || 
        org.type.toLowerCase().includes(term) || 
        org.location.toLowerCase().includes(term)
      );
      setFilteredOrgs(filtered);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Select Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search organizations by name, type, or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        <div className="overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-brand-orange/10 flex items-center justify-center mr-2">
                          <Building2 size={16} className="text-brand-orange" />
                        </div>
                        {org.name}
                      </div>
                    </TableCell>
                    <TableCell>{org.type}</TableCell>
                    <TableCell>{org.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1 text-gray-500" />
                        {org.studentsCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${org.completionRate}%` }}
                          />
                        </div>
                        {org.completionRate}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1 text-gray-500" />
                        {org.lastActive}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectOrganization(org.id)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No organizations found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationSelector; 