
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { Ticket } from '@/types';

interface QRCodeDisplayProps {
  ticket: Ticket;
}

const QRCodeDisplay = ({ ticket }: QRCodeDisplayProps) => {
  const generateQRCode = (data: string) => {
    // Mock QR code generation - in real implementation, use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generateQRCode(ticket.qrCode);
    link.download = `ticket-${ticket.id}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Ticket',
          text: `My ticket for event ${ticket.eventId}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Your Event Ticket</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <img
            src={generateQRCode(ticket.qrCode)}
            alt="QR Code"
            className="w-48 h-48 border rounded-lg"
          />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Ticket ID: {ticket.id}</p>
          <p className="text-sm text-gray-600">Status: {ticket.status}</p>
          {ticket.seatNumber && (
            <p className="text-sm text-gray-600">Seat: {ticket.seatNumber}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleDownload} className="flex-1" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare} className="flex-1" variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
