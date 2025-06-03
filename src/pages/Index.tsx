
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Ticket, BarChart3, QrCode, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create, manage, and promote your events with ease'
    },
    {
      icon: Ticket,
      title: 'Smart Ticketing',
      description: 'Generate QR codes and manage ticket sales seamlessly'
    },
    {
      icon: Users,
      title: 'Attendee Management',
      description: 'Track registrations and manage attendee data'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your event performance and sales'
    },
    {
      icon: QrCode,
      title: 'QR Check-in',
      description: 'Quick and contactless event check-in process'
    },
    {
      icon: Mail,
      title: 'Email Notifications',
      description: 'Automated email reminders and confirmations'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            EventBrite Nexus
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your complete event management solution
          </p>
          <p className="text-lg mb-10 text-blue-200 max-w-3xl mx-auto">
            Create, manage, and sell tickets for your events. From conferences to concerts, 
            manage everything in one powerful platform with analytics, QR codes, and seamless check-in.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-primary">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Browse Events
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From creation to completion, our platform provides all the tools you need 
              to make your events successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary rounded-full w-fit">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to create amazing events?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of event organizers who trust EventBrite Nexus 
            to power their events.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
