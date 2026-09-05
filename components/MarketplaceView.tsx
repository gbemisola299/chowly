"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function MarketplaceView({ restaurants }: { restaurants: any[] }) {
  // Dummy pagination logic (since we only have 10, we'll pretend there are more pages)
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = 10; // Dummy long pagination

  const currentRestaurants = restaurants.slice(
    ((page - 1) % 2) * itemsPerPage, 
    (((page - 1) % 2) + 1) * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-gray-900"
        >
          Discover top spots near you
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600"
        >
          Explore menus, place orders seamlessly, and enjoy the best food in town.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentRestaurants.map((restaurant, i) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link href={`/restaurant/${restaurant.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 h-full flex flex-col group cursor-pointer">
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  {restaurant.imageUrl ? (
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Utensils size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-white/90 text-black hover:bg-white border-0 shadow-sm font-semibold flex items-center gap-1 backdrop-blur-md">
                      <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      {restaurant.ratings}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold line-clamp-1">{restaurant.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm text-gray-500 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {restaurant.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Experience the best flavors at {restaurant.name}, offering a wide variety of dishes and drinks.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="py-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1))}} 
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[1, 2, 3].map(p => (
              <PaginationItem key={p}>
                <PaginationLink 
                  href="#" 
                  isActive={page === p}
                  onClick={(e) => { e.preventDefault(); setPage(p) }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            
            <PaginationItem>
              <PaginationLink 
                href="#" 
                isActive={page === totalPages}
                onClick={(e) => { e.preventDefault(); setPage(totalPages) }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1))}}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
