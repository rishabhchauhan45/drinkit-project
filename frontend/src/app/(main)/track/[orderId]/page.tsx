'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { MapPin, Navigation, Package, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function TrackingPage() {
  const { orderId } = useParams();
  const { token } = useAuth();
  
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [status, setStatus] = useState('Out for Delivery');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!orderId || !token) return;

    // Connect to backend WebSocket
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to tracking server');
      newSocket.emit('join-order', { orderId, token });
    });

    newSocket.on('partnerLocationUpdate', (data: { lat: number, lng: number, timestamp: string }) => {
      console.log('Location update:', data);
      setLocation({ lat: data.lat, lng: data.lng });
    });
    
    newSocket.on('order-update', (data) => {
      if (data.status) {
        setStatus(data.status);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [orderId, token]);

  const simulateTracking = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Track Order</h1>
            <p className="text-slate-500 font-mono text-sm mt-1">#{orderId}</p>
          </div>
          <Button onClick={simulateTracking} variant="outline" className="bg-white">
            Trigger Simulator
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tracking Status Card */}
          <Card className="lg:col-span-1 shadow-sm border-slate-100">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Delivery Status
              </h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800">Order Placed</h4>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 animate-pulse">
                    <Navigation className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-emerald-800">{status}</h4>
                    </div>
                    <p className="text-sm text-emerald-600/80">Rider is on the way</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Live Map Interface */}
          <Card className="lg:col-span-2 overflow-hidden shadow-sm border-slate-100 h-[500px] relative bg-slate-200">
            {/* We will use a mock UI map canvas instead of full Leaflet to keep dependencies simple for the interview demo */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent z-0"></div>
            
            <div className="relative z-10 w-full h-full p-6 flex flex-col">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg w-max flex gap-4 items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-bounce">
                  <MapPin />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Live Coordinates</p>
                  <p className="font-mono text-slate-800 font-medium">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Waiting for GPS...'}
                  </p>
                </div>
              </div>

              {location && (
                <div 
                  className="absolute transition-all duration-1000 ease-linear"
                  style={{ 
                    // Map simulated coordinates to screen space
                    left: `${((location.lng - 77.59) * 10000)}%`, 
                    top: `${((location.lat - 12.97) * 10000)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-emerald-600 h-6 w-6 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                       <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
