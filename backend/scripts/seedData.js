
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Ticket = require('../models/Ticket');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Venue.deleteMany({});
    await Ticket.deleteMany({});

    console.log('Existing data cleared...');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.create([
      {
        name: 'John Organizer',
        email: 'organizer@example.com',
        password: hashedPassword,
        role: 'organizer'
      },
      {
        name: 'Jane Attendee',
        email: 'attendee@example.com',
        password: hashedPassword,
        role: 'attendee'
      },
      {
        name: 'Mike Events',
        email: 'mike@example.com',
        password: hashedPassword,
        role: 'organizer'
      },
      {
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'attendee'
      }
    ]);

    console.log('Users created...');

    const organizer1 = users[0];
    const organizer2 = users[2];
    const attendee1 = users[1];
    const attendee2 = users[3];

    // Create venues
    const venues = await Venue.create([
      {
        name: 'Grand Conference Center',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        capacity: 500,
        layout: 'theater',
        amenities: ['parking', 'wifi', 'av_equipment', 'wheelchair_accessible'],
        owner: organizer1._id
      },
      {
        name: 'Tech Hub Auditorium',
        address: {
          street: '456 Tech Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        capacity: 300,
        layout: 'classroom',
        amenities: ['wifi', 'av_equipment', 'catering'],
        owner: organizer2._id
      }
    ]);

    console.log('Venues created...');

    // Create events
    const events = await Event.create([
      {
        title: 'React Conference 2024',
        description: 'The biggest React conference of the year featuring talks from industry experts, workshops, and networking opportunities.',
        date: new Date('2024-12-15'),
        time: '09:00',
        venue: venues[0].name,
        capacity: 300,
        price: 99.99,
        category: 'conference',
        image: 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=React+Conf',
        organizer: organizer1._id,
        organizerName: organizer1.name,
        status: 'published',
        ticketsSold: 0
      },
      {
        title: 'JavaScript Workshop: Advanced Concepts',
        description: 'Hands-on workshop covering advanced JavaScript concepts including closures, prototypes, async programming, and more.',
        date: new Date('2024-12-20'),
        time: '14:00',
        venue: venues[1].name,
        capacity: 50,
        price: 149.99,
        category: 'workshop',
        image: 'https://via.placeholder.com/400x300/059669/ffffff?text=JS+Workshop',
        organizer: organizer2._id,
        organizerName: organizer2.name,
        status: 'published',
        ticketsSold: 0
      },
      {
        title: 'Tech Networking Night',
        description: 'Connect with fellow developers, designers, and tech professionals in a relaxed networking environment.',
        date: new Date('2024-12-25'),
        time: '18:00',
        venue: 'Downtown Tech Lounge',
        capacity: 100,
        price: 25.00,
        category: 'networking',
        image: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Networking',
        organizer: organizer1._id,
        organizerName: organizer1.name,
        status: 'published',
        ticketsSold: 0
      },
      {
        title: 'Annual Tech Concert',
        description: 'Music and technology come together in this unique concert experience featuring electronic artists.',
        date: new Date('2024-12-30'),
        time: '20:00',
        venue: 'City Music Hall',
        capacity: 1000,
        price: 75.00,
        category: 'concert',
        image: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Tech+Concert',
        organizer: organizer2._id,
        organizerName: organizer2.name,
        status: 'draft',
        ticketsSold: 0
      }
    ]);

    console.log('Events created...');

    // Create some sample tickets
    const tickets = await Ticket.create([
      {
        event: events[0]._id,
        user: attendee1._id,
        userEmail: attendee1.email,
        userName: attendee1.name,
        price: events[0].price,
        qrCode: `${events[0]._id}-${attendee1._id}-${Date.now()}-1`,
        purchaseReference: 'TXN-001',
        status: 'valid'
      },
      {
        event: events[1]._id,
        user: attendee2._id,
        userEmail: attendee2.email,
        userName: attendee2.name,
        price: events[1].price,
        qrCode: `${events[1]._id}-${attendee2._id}-${Date.now()}-2`,
        purchaseReference: 'TXN-002',
        status: 'valid'
      }
    ]);

    console.log('Tickets created...');

    // Update ticket counts for events
    await events[0].updateTicketCount();
    await events[1].updateTicketCount();

    console.log('Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Organizer: organizer@example.com / password123');
    console.log('Attendee: attendee@example.com / password123');
    console.log('Organizer 2: mike@example.com / password123');
    console.log('Attendee 2: sarah@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
