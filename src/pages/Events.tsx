
import React, { useState } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Mock events data
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      description: 'Join industry leaders for the latest in technology trends and innovations.',
      date: '2024-08-15',
      time: '09:00',
      venue: 'Convention Center, San Francisco',
      capacity: 500,
      price: 299,
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      organizerId: '1',
      organizerName: 'Tech Events Corp',
      ticketsSold: 234,
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Music Festival Summer 2024',
      description: 'Three days of amazing music with top artists from around the world.',
      date: '2024-07-20',
      time: '16:00',
      venue: 'Golden Gate Park, San Francisco',
      capacity: 10000,
      price: 149,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop',
      organizerId: '1',
      organizerName: 'Music Festivals Inc',
      ticketsSold: 7500,
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Art Workshop Series',
      description: 'Learn painting techniques from professional artists in a hands-on workshop.',
      date: '2024-06-10',
      time: '14:00',
      venue: 'Art Studio Downtown',
      capacity: 25,
      price: 75,
      category: 'Art',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop',
      organizerId: '1',
      organizerName: 'Creative Workshops',
      ticketsSold: 18,
      status: 'published',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    }
  ];

  const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Sports', 'Food'];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
                           event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <EventCard key={event.id} event={event} />
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
