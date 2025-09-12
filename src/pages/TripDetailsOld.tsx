import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getAdminTrips, getTripAvailableDates, AdminTrip } from "@/lib/adminStorage";
import { getTripSections, saveTripSections, TripSections, ItineraryDay } from "@/lib/tripSections";
import ImageGallery from "@/components/ImageGallery";
import FloatingInfoCards from "@/components/FloatingInfoCards";
import FloatingBookingWidget from "@/components/FloatingBookingWidget";
import ModernAccordion from "@/components/ModernAccordion";
import CustomerReviews from "@/components/CustomerReviews";
import SEO from "@/components/SEO";
import { ArrowLeft, Share2, Heart } from "lucide-react";

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<AdminTrip | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripSections, setTripSections] = useState<TripSections | null>(null);

  useEffect(() => {
    if (tripId) {
      const trips = getAdminTrips();
      const foundTrip = trips.find(t => t.id === tripId && t.is_active);
      setTrip(foundTrip || null);
      
      if (foundTrip) {
        const dates = getTripAvailableDates(tripId);
        setAvailableDates(dates);
        
        // Load trip sections
        const sections = getTripSections(tripId);
        setTripSections(sections);
      }
    }
    setLoading(false);
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist or is no longer available.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inclusions = [
    "Professional Trek Leader & Local Guide",
    "All Meals (Breakfast, Lunch, Dinner)",
    "Accommodation (Tents/Homestay)",
    "Transportation from Base Camp",
    "First Aid Kit & Safety Equipment",
    "All Permits & Entry Fees",
    "Group Equipment (Tents, Sleeping Bags)",
    "Certificate of Completion"
  ];

  const exclusions = [
    "Transportation to Base Camp",
    "Personal Trekking Gear",
    "Travel Insurance",
    "Personal Expenses",
    "Tips for Guide/Porter",
    "Emergency Evacuation",
    "Anything not mentioned in inclusions"
  ];

  // Generate dynamic itinerary based on trip duration and category
  const itinerary = trip ? generateItinerary(trip) : [];

  const handleSectionSave = (field: keyof TripSections, content: string | string[] | ItineraryDay[]) => {
    if (!tripSections) return;
    
    const updatedSections = { ...tripSections, [field]: content };
    setTripSections(updatedSections);
    saveTripSections(updatedSections);
  };

  return (
    <>
      <SEO 
        title={`${trip.title} - Trek A Tour`}
        description={trip.shortDesc}
        image={trip.image}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          {trip.image && (
            <img 
              src={trip.image} 
              alt={trip.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getDifficultyColor(trip.difficulty)}>
                    {trip.difficulty}
                  </Badge>
                  <Badge variant="secondary">{trip.category}</Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{trip.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {trip.region}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {trip.duration}
                  </div>
                  <EditableRating tripId={trip.id} />
                </div>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold">₹{trip.basePrice.toLocaleString()}</span>
                  <span className="text-lg ml-2 opacity-90">per person</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Trip Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {trip.shortDesc}
                  </p>
                  
                  {trip.highlights && trip.highlights.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Trip Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {trip.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs Section */}
              <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
                  <TabsTrigger value="policy">Policy</TabsTrigger>
                  <TabsTrigger value="essentials">Essentials</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                </TabsList>
                
                <TabsContent value="itinerary" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Route className="h-5 w-5 mr-2" />
                        Detailed Itinerary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tripSections && (
                        <EditableItinerary
                          itinerary={tripSections.itinerary}
                          onSave={(content) => handleSectionSave('itinerary', content)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="inclusions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tripSections && (
                        <EditableSection
                          title="Inclusions"
                          content={tripSections.inclusions}
                          onSave={(content) => handleSectionSave('inclusions', content)}
                          type="list"
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="exclusions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tripSections && (
                        <EditableSection
                          title="Exclusions"
                          content={tripSections.exclusions}
                          onSave={(content) => handleSectionSave('exclusions', content)}
                          type="list"
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="policy" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Policies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {tripSections && (
                        <>
                          <EditableSection
                            title="Cancellation Policy"
                            content={tripSections.cancellationPolicy}
                            onSave={(content) => handleSectionSave('cancellationPolicy', content)}
                            type="textarea"
                          />
                          
                          <div className="border-t pt-6">
                            <EditableSection
                              title="Refund Policy"
                              content={tripSections.refundPolicy}
                              onSave={(content) => handleSectionSave('refundPolicy', content)}
                              type="textarea"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="essentials" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-amber-600">
                          <Info className="h-5 w-5 mr-2" />
                          Things to Remember
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {tripSections && (
                          <EditableSection
                            title="Important Reminders"
                            content={tripSections.thingsToRemember}
                            onSave={(content) => handleSectionSave('thingsToRemember', content)}
                            type="list"
                          />
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-600">
                          <Camera className="h-5 w-5 mr-2" />
                          Things to Bring
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {tripSections && (
                          <EditableSection
                            title="Essential Items"
                            content={tripSections.thingsToBring}
                            onSave={(content) => handleSectionSave('thingsToBring', content)}
                            type="list"
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="transport" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Route className="h-5 w-5 mr-2" />
                        Transportation Clause
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tripSections && (
                        <EditableSection
                          title="Transportation Details"
                          content={tripSections.transportationClause}
                          onSave={(content) => handleSectionSave('transportationClause', content)}
                          type="textarea"
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking & Date Selection */}
            <div className="space-y-6">
              {/* Dropdown Calendar */}
              <DropdownCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />

              {/* Booking Form */}
              <BookingFormAdvanced trip={trip} selectedDate={selectedDate} />

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* Customer Reviews Section */}
          <div className="mt-16">
            <CustomerReviews tripId={trip.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripDetails;
