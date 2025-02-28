import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// Define tour-related responses
const tourResponses: Record<string, string> = {
    // Greetings
    'hello': 'Hi! How can I help you with your tour planning today?',
    'hi': 'Hello! Looking to plan a tour? I can help!',
    'hey': 'Hey there! Ready to explore our amazing tours?',
    'good morning': 'Good morning! Ready to plan your adventure?',
    'good afternoon': 'Good afternoon! How can I assist with your tour plans?',
    'good evening': 'Good evening! Looking for the perfect tour?',

    // Booking & Reservations
    'booking': 'To book a tour, select your desired tour and click the "Book Now" button. Would you like me to show you our available tours?',
    'reserve': 'You can reserve your spot instantly through our secure booking system. Would you like to see available dates?',
    'availability': 'I can check tour availability for your preferred dates. Which tour interests you?',
    'schedule': 'Our tours run daily with multiple time slots. When would you like to go?',
    'group booking': 'We offer special rates for group bookings of 10 or more people. Would you like more information?',
    'private tour': 'Yes, we offer private tours for a more personalized experience. Would you like details?',

    // Pricing & Payment
    'price': 'Our tour prices vary depending on the destination and duration. Which tour are you interested in?',
    'cost': 'Tour costs include guide, transportation, and specified meals. Which tour would you like to know about?',
    'payment': 'We accept various payment methods including credit cards and PayPal. All payments are secure and encrypted.',
    'discount': 'We offer early bird discounts and special rates for groups. Would you like to know more?',
    'deposit': 'A 20% deposit is required to confirm your booking. The balance is due 14 days before the tour.',
    'refund': 'Refunds are processed within 3-5 business days after cancellation approval.',

    // Cancellation & Policies
    'cancel': 'Our cancellation policy allows free cancellation up to 24 hours before the tour. Would you like more details?',
    'reschedule': 'You can reschedule your tour up to 48 hours before the start time at no extra cost.',
    'policy': 'Our policies are designed to be flexible and customer-friendly. What specific policy would you like to know about?',
    'insurance': 'We recommend travel insurance for all tours. Would you like information about our preferred providers?',

    // Tour Information
    'guide': 'All our tours are led by professional, certified tour guides with extensive knowledge of the destinations.',
    'duration': 'Tour durations range from half-day trips to multi-day adventures. Which length interests you?',
    'itinerary': 'Each tour has a detailed itinerary available. Which tour would you like to know more about?',
    'included': 'Tour inclusions vary but typically cover transport, guide, and specified activities. Need specific details?',
    'transport': 'We provide comfortable, air-conditioned vehicles for all our tours.',
    'pickup': 'We offer hotel pickup and drop-off for most tours. Where are you staying?',

    // Special Requirements
    'wheelchair': 'Many of our tours are wheelchair accessible. Let me know which tour interests you for specific accessibility details.',
    'dietary': 'We can accommodate various dietary requirements. Please let us know your needs when booking.',
    'vegetarian': 'Yes, we can arrange vegetarian meal options on all our tours.',
    'children': 'Most tours are family-friendly with special rates for children under 12.',
    'senior': 'We offer senior discounts and can adjust tour pace as needed.',
    'fitness': 'Tour difficulty levels vary. Let me know your preferences for suitable recommendations.',

    // Weather & Seasons
    'weather': 'Tours operate in most weather conditions. The best season depends on your preferred activities.',
    'rain': 'We provide ponchos in case of rain, and have indoor alternatives for severe weather.',
    'best time': 'The best time for tours varies by destination. When are you planning to visit?',
    'season': 'Each season offers unique experiences. When are you planning to travel?',

    // Equipment & Preparation
    'bring': 'Recommended items include comfortable shoes, camera, and water. Need a complete packing list?',
    'wear': 'Comfortable clothing and walking shoes are recommended. Would you like specific suggestions?',
    'camera': 'Photography is welcomed on all tours! Some locations may have specific photo policies.',
    'baggage': 'Storage is available for small bags during day tours.',

    // Languages
    'language': 'Tours are available in English, Spanish, and Mandarin. Which language do you prefer?',
    'translator': 'We can arrange translators for other languages with advance notice.',
    'english': 'Yes, all our guides speak fluent English.',

    // Safety & COVID
    'safety': 'Your safety is our priority. All tours follow strict safety protocols.',
    'covid': 'We follow current health guidelines and maintain enhanced cleaning protocols.',
    'mask': 'Current mask requirements depend on local regulations. We will provide updates before your tour.',
    'sanitizer': 'Hand sanitizer is available throughout the tour.',

    // Casual Greetings & Phrases
    'sup': 'Hey there! Ready to plan an amazing tour?',
    'yo': 'Hi! Looking to explore some cool destinations?',
    'howdy': 'Howdy! Ready to plan your next adventure?',
    'help': 'I would be happy to help! What would you like to know about our tours?',
    'thanks': 'You are welcome! Is there anything else you would like to know?',
    'thank you': 'You are welcome! Let me know if you need anything else!',
    'bye': 'Goodbye! Feel free to come back if you have more questions!',
    'cya': 'See you! Have a great day!',

    // Common Questions
    'how much': 'Prices vary by tour. Which destination interests you?',
    'when': 'We have tours running throughout the day. When works best for you?',
    'where': 'We offer tours to various exciting destinations. Any specific place in mind?',
    'what time': 'Tours start at different times throughout the day. Morning, afternoon, or evening?',
    'how long': 'Tour lengths vary from a few hours to several days. How much time do you have?',
    'far': 'Distance varies by tour location. Which destination are you interested in?',
    'food': 'Many tours include meals or snacks. Any dietary preferences I should know about?',
    'eat': 'We can recommend great local food spots during the tour. Interested?',
    'drink': 'Water is provided on all tours. Some tours include additional beverages!',
    'bathroom': 'All tours include regular comfort breaks at clean facilities.',
    'wifi': 'Our tour vehicles have free WiFi, and most stop points have internet access.',
    'phone': 'You can reach our tour office at any time. Need the contact number?',
    'parking': 'Free parking is available at our tour starting points.',
    'meet': 'Meeting points are easily accessible. Where are you staying?',
    'start': 'Tours begin at convenient central locations. Need directions?',
    'walk': 'Walking distances vary by tour. We can match you with a suitable option!',
    'tired': 'Our tours include regular rest stops and comfortable transportation.',
    'hot': 'All our vehicles are air-conditioned, and we provide water.',
    'cold': 'Our vehicles are climate-controlled, and we recommend bringing layers.',
    'money': 'We accept cash and cards. Would you like our pricing details?',
    'cash': 'Yes, we accept cash payments at our office. Cards are also welcome!',
    'card': 'We accept all major credit and debit cards.',
    'expensive': 'We offer tours for various budgets. What is your preferred price range?',
    'cheap': 'We have tours to fit different budgets. Let me show you some options!',
    'deal': 'Check out our current special offers and group discounts!',
    'save': 'Book early for our best rates and special discounts!',
    'photo': 'Great photo opportunities throughout the tour! Our guides know the best spots.',
    'pics': 'You will get plenty of amazing photo opportunities!',
    'pictures': 'There are lots of perfect photo spots on our tours!',
    'restroom': 'Regular bathroom breaks are included in all tours.',
    'toilet': 'Do not worry, we make regular comfort stops during tours.',

    // Common Concerns
    'scared': 'Our experienced guides ensure a safe and comfortable experience.',
    'nervous': 'No need to worry! Our guides will take great care of you.',
    'worry': 'Your comfort and safety are our top priorities!',
    'sick': 'We can accommodate motion sickness and other health concerns.',
    'afraid': 'Our guides are trained to ensure everyone feels comfortable and safe.',
    'lost': 'Do not worry, our guides always keep the group together!',
    'late': 'We have flexible booking options if you need to change times.',


    // Default response
    'default': "I'm here to help with tour information! You can ask about bookings, prices, cancellations, or specific tours."
};

const Chatbox: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Add initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                text: "Hello! I'm your tour assistant. How can I help you today?",
                sender: 'bot'
            }]);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const findResponse = (input: string): string => {
        const lowercaseInput = input.toLowerCase();

        // Check for keywords in the input
        for (const [keyword, response] of Object.entries(tourResponses)) {
            if (lowercaseInput.includes(keyword)) {
                return response;
            }
        }
        return tourResponses.default;
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            text: input,
            sender: 'user' as const
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate response delay for natural feeling
        setTimeout(() => {
            const botResponse = {
                text: findResponse(input),
                sender: 'bot' as const
            };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 flex items-center gap-2"
                aria-label="Open chat"
            >
                <MessageCircle size={24} />
                <span className="text-sm font-medium hidden sm:inline">Need Help?</span>
            </button>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
                <div className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <h3 className="font-semibold">AI Tour Assistant</h3>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-blue-700 p-1 rounded-full transition-colors"
                    aria-label="Close chat"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`p-3 rounded-2xl ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                } max-w-[75%] shadow-sm`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl rounded-bl-none max-w-[75%] shadow-sm">
                            <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask me about tours..."
                        className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbox;