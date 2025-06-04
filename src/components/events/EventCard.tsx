
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard = ({ event, showActions = false, onEdit, onDelete }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
          <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
            {event.status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{event.ticketsSold}/{event.capacity} tickets sold</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>${event.price}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {showActions ? (
            <div className="flex space-x-2 w-full">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(event)} className="flex-1">
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete?.(event.id)} className="flex-1">
                Delete
              </Button>
            </div>
          ) : (
            <Link to={`/events/${event.id}`} className="flex-1">
              <Button className="w-full">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
