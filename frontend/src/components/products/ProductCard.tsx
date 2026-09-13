import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  volume: string;
  brand: string;
  images: string[];
  stock: number;
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:border-primary transition-colors group bg-card/50 backdrop-blur-sm">
      <Link href={`/product/${product._id}`} className="flex-1">
        <div className="relative aspect-square bg-white flex items-center justify-center p-4">
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 z-10 bg-destructive hover:bg-destructive">
              {product.discount}% OFF
            </Badge>
          )}
          <img 
            src={product.images[0] || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=300'} 
            alt={product.name} 
            className="object-contain h-full w-full transform transition-transform group-hover:scale-105" 
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col gap-1">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.brand}</div>
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{product.name}</h3>
          <div className="text-sm text-muted-foreground">{product.volume}</div>
          <div className="mt-auto pt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            {product.mrp > product.price && (
              <span className="text-sm text-muted-foreground line-through">${product.mrp.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2" variant={product.stock > 0 ? "default" : "secondary"} disabled={product.stock <= 0}>
          <ShoppingCart className="h-4 w-4" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
