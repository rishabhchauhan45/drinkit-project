'use client';

import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';

const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Incredible service! Ordered drinks for a house party and they arrived in exactly 25 minutes. The packaging was premium and everything was perfectly chilled.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Priya Patel',
    location: 'Bangalore',
    rating: 5,
    comment: 'The DrinkIt Black collection is amazing. Found a rare Japanese whiskey I had been looking for everywhere. Very professional delivery partners.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Vikram Singh',
    location: 'Delhi',
    rating: 4,
    comment: 'Great app UI, very easy to use. Love their AI recommendations which suggested a great wine pairing for my dinner. Will order again.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Loved by Thousands</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our customers have to say about their DrinkIt experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card key={t.id} className="bg-secondary/30 border-none shadow-none hover:shadow-soft-md transition-shadow">
              <CardContent className="p-8">
                <Rating value={t.rating} size="sm" className="mb-6" />
                <p className="text-foreground leading-relaxed mb-8">
                  &ldquo;{t.comment}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <Avatar src={t.avatar} fallback={t.name} size="lg" />
                  <div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
