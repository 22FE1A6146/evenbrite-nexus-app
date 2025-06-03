
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'attendee';
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  price: number;
  category: string;
  image: string;
  organizerId: string;
  organizerName: string;
  ticketsSold: number;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  purchaseDate: string;
  price: number;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
  seatNumber?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  layout?: string;
}

export interface Analytics {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  checkInRate: number;
  eventStats: {
    eventId: string;
    eventTitle: string;
    ticketsSold: number;
    revenue: number;
    checkIns: number;
  }[];
}
