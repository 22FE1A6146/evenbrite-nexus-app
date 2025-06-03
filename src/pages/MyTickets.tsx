
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, QrCode, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types';
import QRCodeDisplay from '@/components/tickets/QRCodeDisplay';

const MyTickets = () => {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Mock tickets data
  const mockTickets: Ticket[] = [
    {
      id: 'ticket-1',
      eventId: '1',
      userId: user?.id || '1',
      userEmail: user?.email || 'attendee@example.com',
      userName: user?.name || 'Jane Attendee',
      purchaseDate: '2024-01-20',
      price: 299,
      qrCode: 'event1-user1-ticket1',
      status: 'valid',
      seatNumber: 'A-15'
    },
    {
      id: 'ticket-2',
      eventId: '2',
      userId: user?.id || '1',
      userEmail: user?.email || 'attendee@example.com',
      userName: user?.name || 'Jane Attendee',
      purchaseDate: '2024-01-18',
      price: 149,
      qrCode: 'event2-user1-ticket2',
      status: 'valid',
      seatNumber: 'B-42'
    }
  ];

  const mockEvents = {
    '1': {
      title: 'Tech Conference 2024',
      date: '2024-08-15',
      time: '09:00',
      venue: 'Convention Center, San Francisco',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'
    },
    '2': {
      title: 'Music Festival Summer 2024',
      date: '2024-07-20',
      time: '16:00',
      venue: 'Golden Gate Park, San Francisco',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=200&fit=crop'
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedTicket(null)}
              className="flex items-center space-x-2"
            >
              <span>← Back to My Tickets</span>
            </Button>
          </div>
          <QRCodeDisplay ticket={selectedTicket} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">View and manage your event tickets</p>
        </div>

        {mockTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You don't have any tickets yet.</p>
            <Button className="mt-4">Browse Events</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {mockTickets.map((ticket) => {
              const event = mockEvents[ticket.eventId as keyof typeof mockEvents];
              return (
                <Card key={ticket.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{event.title}</h3>
                          <p className="text-gray-600">Ticket ID: {ticket.id}</p>
                        </div>
                        <Badge variant={ticket.status === 'valid' ? 'default' : 'secondary'}>
                          {ticket.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.date)} at {event.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Price:</span> ${ticket.price}</p>
                          <p><span className="font-medium">Seat:</span> {ticket.seatNumber}</p>
                          <p><span className="font-medium">Purchased:</span> {formatDate(ticket.purchaseDate)}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => setSelectedTicket(ticket)}
                          className="flex items-center space-x-2"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>View QR Code</span>
                        </Button>
                        
                        <Button variant="outline" className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
