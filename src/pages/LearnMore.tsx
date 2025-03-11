import React from 'react';
import { Shield, Trophy, Users, Clock, Globe, Heart, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import PendingToursPage from '../components/PendingToursPage';

const LearnMore = () => {
    return (
        <div className="min-h-screen bg-white mt-16"> {/* Added mt-16 here */}

            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">
                            Your Journey Begins With Us
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 mb-8">
                            Discover why thousands of travelers choose our services for their unforgettable adventures
                        </p>
                    </div>
                </div>
            </div>

            {/* Move TourPackages here, after the hero section */}
            {/* <div className="py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Our Tour Packages</h2>
                <TourPackages />
            </div> */}


            {/* Key Features */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Shield className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                            <p className="text-gray-600">
                                All our tours are fully insured with 24/7 support and local guides
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Trophy className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Best Experience</h3>
                            <p className="text-gray-600">
                                Carefully curated itineraries ensuring unforgettable memories
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Users className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
                            <p className="text-gray-600">
                                Professional local guides with deep knowledge and passion
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Tours</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                            <p className="text-gray-600">Multiple departure dates and customizable itineraries</p>
                        </div>
                        <div className="text-center">
                            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Worldwide Destinations</h3>
                            <p className="text-gray-600">Hundreds of carefully selected locations globally</p>
                        </div>
                        <div className="text-center">
                            <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Personalized Service</h3>
                            <p className="text-gray-600">Tailored experiences for every traveler</p>
                        </div>
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Local Expertise</h3>
                            <p className="text-gray-600">Authentic experiences with local insights</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {[
                            {
                                q: "How do I book a tour?",
                                a: "Booking is easy! Simply browse our available tours, select your preferred date, and follow the booking process. You can also contact our support team for assistance."
                            },
                            {
                                q: "What's included in the tour price?",
                                a: "Our tour prices typically include accommodation, transportation, guided tours, and specified meals. Each tour listing details all inclusions."
                            },
                            {
                                q: "Can I customize my tour?",
                                a: "Yes! We offer customization options for most of our tours. Contact our team to discuss your specific requirements."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Start Your Adventure?</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of satisfied travelers who have experienced our tours
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/tours"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
                        >
                            View Tours
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;