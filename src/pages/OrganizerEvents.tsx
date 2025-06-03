
import React, { useState } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/events/EventCard';
import EventForm from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const OrganizerEvents = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Conference 2024',
      description: 'Join industry leaders for the latest in technology trends.',
      date: '2024-08-15',
      time: '09:00',
      venue: 'Convention Center, San Francisco',
      capacity: 500,
      price: 299,
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      organizerId: user?.id || '1',
      organizerName: user?.name || 'Tech Events Corp',
      ticketsSold: 234,
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ]);

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      ));
      toast.success('Event updated successfully!');
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventData as Event,
        organizerId: user?.id || '1',
        organizerName: user?.name || 'Organizer',
        ticketsSold: 0,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEvents([...events, newEvent]);
      toast.success('Event created successfully!');
    }
    
    setShowForm(false);
    setEditingEvent(undefined);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const handleNewEvent = () => {
    setEditingEvent(undefined);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventForm
            event={editingEvent}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(undefined);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600">Manage your events and track performance</p>
          </div>
          <Button onClick={handleNewEvent} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't created any events yet.</p>
            <Button onClick={handleNewEvent}>Create Your First Event</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showActions={true}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEvents;
