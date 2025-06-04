
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/events/EventCard';
import EventForm from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Helper functions to manage events in localStorage
const getEventsFromStorage = () => {
  const events = localStorage.getItem('eventapp_events');
  return events ? JSON.parse(events) : [];
};

const saveEventsToStorage = (events: Event[]) => {
  localStorage.setItem('eventapp_events', JSON.stringify(events));
};

const OrganizerEvents = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on component mount
  useEffect(() => {
    const storedEvents = getEventsFromStorage();
    // Filter events for current user
    const userEvents = storedEvents.filter((event: Event) => event.organizerId === user?.id);
    setEvents(userEvents);
  }, [user?.id]);

  const handleSaveEvent = (eventData: Partial<Event>) => {
    let updatedEvents: Event[];
    
    if (editingEvent) {
      // Update existing event
      const updatedEvent = { ...editingEvent, ...eventData, updatedAt: new Date().toISOString() };
      updatedEvents = events.map(event => 
        event.id === editingEvent.id ? updatedEvent : event
      );
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
      updatedEvents = [...events, newEvent];
      toast.success('Event created successfully!');
    }
    
    setEvents(updatedEvents);
    
    // Save all events (including other users' events) to localStorage
    const allEvents = getEventsFromStorage();
    const otherUsersEvents = allEvents.filter((event: Event) => event.organizerId !== user?.id);
    const allUpdatedEvents = [...otherUsersEvents, ...updatedEvents];
    saveEventsToStorage(allUpdatedEvents);
    
    setShowForm(false);
    setEditingEvent(undefined);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    
    // Update localStorage
    const allEvents = getEventsFromStorage();
    const filteredAllEvents = allEvents.filter((event: Event) => event.id !== eventId);
    saveEventsToStorage(filteredAllEvents);
    
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
