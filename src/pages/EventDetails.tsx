
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Ticket, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import QRCodeDisplay from '@/components/tickets/QRCodeDisplay';
import { toast } from 'sonner';
import { Event, Ticket as TicketType } from '@/types';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showTicket, setShowTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Load event from localStorage
  useEffect(() => {
    const getEventsFromStorage = () => {
      const events = localStorage.getItem('eventapp_events');
      return events ? JSON.parse(events) : [];
    };

    const events = getEventsFromStorage();
    const foundEvent = events.find((e: Event) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = ticketQuantity + change;
    if (newQuantity >= 1 && event && newQuantity <= (event.capacity - event.ticketsSold)) {
      setTicketQuantity(newQuantity);
    }
  };

  const handlePurchaseTicket = async () => {
    if (!user) {
      toast.error('Please login to purchase tickets');
      return;
    }

    if (!event) {
      toast.error('Event not found');
      return;
    }

    const availableTickets = event.capacity - event.ticketsSold;
    if (ticketQuantity > availableTickets) {
      toast.error(`Only ${availableTickets} tickets available`);
      return;
    }

    setIsLoading(true);
    
    // Mock ticket purchase for multiple tickets
    setTimeout(() => {
      const tickets: TicketType[] = [];
      
      for (let i = 0; i < ticketQuantity; i++) {
        const mockTicket: TicketType = {
          id: `ticket-${Date.now()}-${i}`,
          eventId: event.id,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          purchaseDate: new Date().toISOString(),
          price: event.price,
          qrCode: `${event.id}-${user.id}-${Date.now()}-${i}`,
          status: 'valid',
          seatNumber: `A-${Math.floor(Math.random() * 100) + 1 + i}`
        };
        tickets.push(mockTicket);
      }

      // Save tickets to localStorage
      const existingTickets = localStorage.getItem('eventapp_tickets');
      const allTickets = existingTickets ? JSON.parse(existingTickets) : [];
      allTickets.push(...tickets);
      localStorage.setItem('eventapp_tickets', JSON.stringify(allTickets));

      // Update event ticket count
      const events = JSON.parse(localStorage.getItem('eventapp_events') || '[]');
      const updatedEvents = events.map((e: Event) => {
        if (e.id === event.id) {
          return { ...e, ticketsSold: e.ticketsSold + ticketQuantity };
        }
        return e;
      });
      localStorage.setItem('eventapp_events', JSON.stringify(updatedEvents));

      // Update local event state
      setEvent(prev => prev ? { ...prev, ticketsSold: prev.ticketsSold + ticketQuantity } : null);

      setShowTicket(true);
      toast.success(`${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''} purchased successfully!`);
      setIsLoading(false);
    }, 2000);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Event not found</p>
        </div>
      </div>
    );
  }

  if (showTicket) {
    const mockTicket: TicketType = {
      id: `ticket-${Date.now()}`,
      eventId: event.id,
      userId: user?.id || '',
      userEmail: user?.email || '',
      userName: user?.name || '',
      purchaseDate: new Date().toISOString(),
      price: event.price * ticketQuantity,
      qrCode: `${event.id}-${user?.id}-${Date.now()}`,
      status: 'valid',
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

  const availableTickets = event.capacity - event.ticketsSold;
  const totalPrice = event.price * ticketQuantity;

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
                    <p className="text-lg font-semibold">${event.price} per ticket</p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Ticket className="w-5 h-5" />
                    <span>Purchase Tickets</span>
                  </CardTitle>
                  <CardDescription>
                    {availableTickets} tickets available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user && availableTickets > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Number of Tickets</Label>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={ticketQuantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={availableTickets}
                            value={ticketQuantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value >= 1 && value <= availableTickets) {
                                setTicketQuantity(value);
                              }
                            }}
                            className="w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(1)}
                            disabled={ticketQuantity >= availableTickets}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Total Price</span>
                      <span className="font-semibold">${totalPrice}</span>
                    </div>
                    
                    <Button
                      onClick={handlePurchaseTicket}
                      disabled={isLoading || !user || availableTickets === 0}
                      className="w-full"
                    >
                      {isLoading ? 'Processing...' : 
                       availableTickets === 0 ? 'Sold Out' :
                       user ? `Purchase ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}` : 'Login to Purchase'}
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
