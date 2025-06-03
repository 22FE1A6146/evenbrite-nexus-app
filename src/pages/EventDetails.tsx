
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Ticket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import QRCodeDisplay from '@/components/tickets/QRCodeDisplay';
import { toast } from 'sonner';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showTicket, setShowTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock event data - in real app, fetch by ID
  const event = {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join industry leaders for the latest in technology trends and innovations. This comprehensive conference will cover artificial intelligence, blockchain technology, cloud computing, and the future of digital transformation. Network with professionals, attend hands-on workshops, and gain insights from keynote speakers who are shaping the tech landscape.',
    date: '2024-08-15',
    time: '09:00',
    venue: 'Convention Center, San Francisco',
    capacity: 500,
    price: 299,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    organizerId: '1',
    organizerName: 'Tech Events Corp',
    ticketsSold: 234,
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePurchaseTicket = async () => {
    if (!user) {
      toast.error('Please login to purchase tickets');
      return;
    }

    setIsLoading(true);
    
    // Mock ticket purchase
    setTimeout(() => {
      const mockTicket = {
        id: `ticket-${Date.now()}`,
        eventId: event.id,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        purchaseDate: new Date().toISOString(),
        price: event.price,
        qrCode: `${event.id}-${user.id}-${Date.now()}`,
        status: 'valid' as const,
        seatNumber: `A-${Math.floor(Math.random() * 100) + 1}`
      };

      setShowTicket(true);
      toast.success('Ticket purchased successfully!');
      setIsLoading(false);
    }, 2000);
  };

  if (showTicket) {
    const mockTicket = {
      id: `ticket-${Date.now()}`,
      eventId: event.id,
      userId: user?.id || '',
      userEmail: user?.email || '',
      userName: user?.name || '',
      purchaseDate: new Date().toISOString(),
      price: event.price,
      qrCode: `${event.id}-${user?.id}-${Date.now()}`,
      status: 'valid' as const,
      seatNumber: `A-${Math.floor(Math.random() * 100) + 1}`
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowTicket(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Event</span>
            </Button>
          </div>
          <QRCodeDisplay ticket={mockTicket} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/events">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-gray-600">Organized by {event.organizerName}</p>
              </div>
              <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                {event.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <p>{event.venue}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <p>{event.ticketsSold}/{event.capacity} tickets sold</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <p className="text-lg font-semibold">${event.price}</p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Ticket className="w-5 h-5" />
                    <span>Purchase Ticket</span>
                  </CardTitle>
                  <CardDescription>
                    Join this amazing event for just ${event.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Ticket Price</span>
                      <span className="font-semibold">${event.price}</span>
                    </div>
                    
                    <Button
                      onClick={handlePurchaseTicket}
                      disabled={isLoading || !user}
                      className="w-full"
                    >
                      {isLoading ? 'Processing...' : user ? 'Purchase Ticket' : 'Login to Purchase'}
                    </Button>
                    
                    {!user && (
                      <p className="text-sm text-gray-600 text-center">
                        <Link to="/login" className="text-primary hover:underline">
                          Login
                        </Link>{' '}
                        or{' '}
                        <Link to="/register" className="text-primary hover:underline">
                          register
                        </Link>{' '}
                        to purchase tickets
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">About This Event</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
