'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

// Fix leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/750/750536.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

export default function DeliveryMap({ orderId, initialLat, initialLng }: { orderId: string, initialLat?: number, initialLng?: number }) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const { token } = useAuth();

  useEffect(() => {
    // Connect to websocket
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to socket for live tracking');
      // Request to join the order room for live updates
      socket.emit('join-order', { orderId, token });
    });

    socket.on('partnerLocationUpdate', (data: { lat: number, lng: number, timestamp: string }) => {
      console.log('Location update received:', data);
      setPosition([data.lat, data.lng]);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, token]);

  if (!position) {
    return (
      <div className="h-64 bg-muted/50 rounded-xl border flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm">Waiting for delivery partner's GPS signal...</p>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-xl border overflow-hidden relative z-0">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={deliveryIcon}>
          <Popup>
            Delivery Partner is here
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
