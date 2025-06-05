import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to get events from localStorage
const getEventsFromStorage = () => {
  const events = localStorage.getItem('eventapp_events');
  return events ? JSON.parse(events) : [];
};

const Events = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on component mount and set up refresh
  useEffect(() => {
    const loadEvents = () => {
      const storedEvents = getEventsFromStorage();
      // Show only published events
      const publishedEvents = storedEvents.filter((event: Event) => event.status === 'published');
      setEvents(publishedEvents);
    };

    loadEvents();

    // Set up interval to refresh events every 5 seconds to catch ticket updates
    const interval = setInterval(loadEvents, 5000);

    return () => clearInterval(interval);
  }, []);

  const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Sports', 'Food'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
                           event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditEvent = (event: Event) => {
    // Redirect to organizer events page for editing
    window.location.href = '/organizer/events';
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    
    // Update localStorage
    const allEvents = getEventsFromStorage();
    const filteredAllEvents = allEvents.filter((event: Event) => event.id !== eventId);
    localStorage.setItem('eventapp_events', JSON.stringify(filteredAllEvents));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-gray-600">Find and attend amazing events in your area</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              showActions={user?.role === 'organizer' && event.organizerId === user?.id}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
