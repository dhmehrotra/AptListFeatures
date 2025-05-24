"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  MapPin,
  DollarSign,
  Home,
  Users,
  Car,
  Wifi,
  Dumbbell,
  Dog,
  Mic,
  MicOff,
  Calculator,
  FileText,
  CheckSquare,
  MessageCircle,
  Play,
  Zap,
  Leaf,
  GraduationCap,
} from "lucide-react"
import { ChevronDown, Settings, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDownIcon, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isSystemMessage?: boolean
}

interface Listing {
  id: string
  title: string
  price: string
  location: string
  badges: string[]
  match: string
  imageUrl: string
  bedrooms: number
  bathrooms: number
  sqft: string
  lat: number
  lng: number
  hasVideoTour?: boolean
  greenFeatures?: string[]
  schoolRating?: number
}

interface ConversationContext {
  recent_filters: string[]
  preferred_neighborhoods: string[]
  user_intents: string[]
  interaction_count: number
}

const mockListings = [
  {
    id: "1",
    title: "Spacious 2BR Near BART",
    price: "$2,850/month",
    location: "Mission District",
    badges: ["Pet-Friendly", "Gym", "Near Transit"],
    match: "92%",
    imageUrl:
      "https://images.unsplash.com/photo-1560448071-45ab3cba0e6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bedrooms: 2,
    bathrooms: 2,
    sqft: "1,100",
    lat: 37.7749,
    lng: -122.4194,
    hasVideoTour: true,
    greenFeatures: ["Solar Panels", "EV Charging"],
    schoolRating: 8,
  },
  {
    id: "2",
    title: "Modern Downtown Loft",
    price: "$2,400/month",
    location: "Downtown District",
    badges: ["Pet-Friendly", "Gym", "Rooftop"],
    match: "95%",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bedrooms: 2,
    bathrooms: 2,
    sqft: "1,200",
    lat: 37.7849,
    lng: -122.4094,
    hasVideoTour: true,
    greenFeatures: ["Green Certified"],
    schoolRating: 9,
  },
  {
    id: "3",
    title: "Cozy Garden Apartment",
    price: "$1,800/month",
    location: "Midtown",
    badges: ["Pet-Friendly", "Balcony", "Parking"],
    match: "88%",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bedrooms: 1,
    bathrooms: 1,
    sqft: "850",
    lat: 37.7649,
    lng: -122.4294,
    hasVideoTour: false,
    greenFeatures: ["EV Charging"],
    schoolRating: 7,
  },
]

const neighborhoodData = {
  "Mission District": {
    summary:
      "Known for vibrant culture, cafes, murals, and proximity to BART. Popular with creatives and young professionals.",
    schoolRating: 8,
    safetyScore: "Moderate",
    lifestyle: "Lively, urban, walkable",
    parks: ["Dolores Park", "Garfield Square"],
    aiMatch: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1583349461686-02929b0b3f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badges: ["Transit Access", "Cultural Hub", "Nightlife"],
    highlights: ["24th Street BART", "Mission Dolores", "Street Art Tours"],
  },
  "Noe Valley": {
    summary:
      "Quiet, family-friendly neighborhood with tree-lined streets and local boutiques. Perfect for those seeking a peaceful urban retreat.",
    schoolRating: 9,
    safetyScore: "High",
    lifestyle: "Quiet, family-oriented, residential",
    parks: ["Noe Valley Town Square", "Upper Noe Recreation Center"],
    aiMatch: 94,
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badges: ["Quiet Area", "Family-Friendly", "High Safety"],
    highlights: ["24th Street Shopping", "Local Cafes", "Farmers Market"],
  },
  SOMA: {
    summary:
      "Tech hub with modern high-rises, close to downtown and startup offices. Ideal for professionals and tech workers.",
    schoolRating: 7,
    safetyScore: "Moderate",
    lifestyle: "Urban, professional, modern",
    parks: ["Yerba Buena Gardens", "South Park"],
    aiMatch: 85,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badges: ["Tech Hub", "Modern Living", "Downtown Access"],
    highlights: ["Salesforce Tower", "AT&T Park", "Tech Companies"],
  },
}

export default function AIRentalAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your AI Rental Advisor. I can help you find the perfect apartment based on your preferences. What are you looking for?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [rentalResults, setRentalResults] = useState<Listing[]>([])
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState([2500])
  const [bedrooms, setBedrooms] = useState("")
  const [lifestyle, setLifestyle] = useState<string[]>([])
  const [greenFeatures, setGreenFeatures] = useState<string[]>([])
  const [schoolName, setSchoolName] = useState("")
  const [schoolRating, setSchoolRating] = useState([7])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isNextStepsExpanded, setIsNextStepsExpanded] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [smartFiltersEnabled, setSmartFiltersEnabled] = useState(false)
  const [showBudgetCalculator, setShowBudgetCalculator] = useState(false)
  const [showLeaModal, setShowLeaModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [leaProgress, setLeaProgress] = useState(65)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat") // "chat", "preferences", "profile"

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    recent_filters: ["pet-friendly", "near-transit"],
    preferred_neighborhoods: ["Mission District", "Castro"],
    user_intents: ["budget-conscious", "commute-friendly"],
    interaction_count: 0,
  })

  const [rightPanelTab, setRightPanelTab] = useState("preferences") // "preferences", "neighborhood", "profile"
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Mission District")
  const [isLoadingNeighborhood, setIsLoadingNeighborhood] = useState(false)

  // Add error handling for ResizeObserver
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message.includes("ResizeObserver loop completed with undelivered notifications")) {
        e.stopImmediatePropagation()
        return false
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  const locationSuggestions = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Denver, CO",
  ]

  const suggestionChips = [
    "Show me 2BRs under $3k",
    "Find listings near BART",
    "Tell me about neighborhoods",
    "Schedule a viewing this weekend",
    "Compare this to similar listings",
  ]

  // Add system message for agent memory
  useEffect(() => {
    if (conversationContext.interaction_count === 3) {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: "🎉 I've learned your top 3 preferences. My recommendations will keep improving!",
        sender: "ai",
        timestamp: new Date(),
        isSystemMessage: true,
      }
      setMessages((prev) => [...prev, systemMessage])
    }

    if (conversationContext.interaction_count === 5) {
      const contextMessage: Message = {
        id: `context-${Date.now()}`,
        content:
          "You've recently searched for pet-friendly listings near parks — should I prioritize these going forward?",
        sender: "ai",
        timestamp: new Date(),
        isSystemMessage: true,
      }
      setMessages((prev) => [...prev, contextMessage])
    }
  }, [conversationContext.interaction_count])

  const handleLocationChange = (value: string) => {
    setLocation(value)
    setShowSuggestions(value.length > 0)
  }

  const handleLifestyleChange = (value: string, checked: boolean) => {
    if (checked) {
      setLifestyle([...lifestyle, value])
    } else {
      setLifestyle(lifestyle.filter((item) => item !== value))
    }
  }

  const handleGreenFeaturesChange = (value: string, checked: boolean) => {
    if (checked) {
      setGreenFeatures([...greenFeatures, value])
    } else {
      setGreenFeatures(greenFeatures.filter((item) => item !== value))
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    requestAnimationFrame(() => {
      // Update conversation context
      setConversationContext((prev) => ({
        ...prev,
        interaction_count: prev.interaction_count + 1,
        recent_filters: [...prev.recent_filters, suggestion.toLowerCase()],
      }))

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: suggestion,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      // Simulate AI response after delay
      setTimeout(() => {
        let aiResponse = ""

        switch (suggestion) {
          case "Show me 2BRs under $3k":
            aiResponse =
              "Great! I found 8 two-bedroom apartments under $3,000 in your preferred areas. Here are the top matches based on your lifestyle preferences:"
            break
          case "Find listings near BART":
            aiResponse =
              "Perfect! I've filtered properties within a 10-minute walk of BART stations. These listings offer excellent transit connectivity for your commute:"
            break
          case "Tell me about neighborhoods":
            aiResponse =
              "I'd love to help you explore neighborhoods! I've analyzed the best areas based on your preferences. Check out the Neighborhood Guide for detailed insights."
            // Trigger tab switch
            setTimeout(() => {
              setRightPanelTab("neighborhood")
              handleNeighborhoodChange(getRecommendedNeighborhood())
            }, 1000)
            break
          case "Schedule a viewing this weekend":
            aiResponse =
              "I'd be happy to help schedule viewings! I can arrange tours for Saturday or Sunday. Which properties from your saved list would you like to see first?"
            break
          case "Compare this to similar listings":
            aiResponse =
              "I'll analyze comparable properties in the same area with similar features. Here's how your selected property stacks up against 5 similar listings:"
            break
          default:
            aiResponse = "I understand what you're looking for. Let me help you with that request!"
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)

        // Update recommendations based on suggestion
        if (suggestion === "Show me 2BRs under $3k" || suggestion === "Find listings near BART") {
          setTimeout(() => {
            setShowRecommendations(true)
            setRentalResults(mockListings.slice(0, 3))
          }, 500)
        }
      }, 2000)
    })
  }

  const handleLeaHandleThis = (listing: Listing) => {
    setSelectedListing(listing)
    setShowLeaModal(true)
  }

  const getStaticMapUrl = (lat: number, lng: number) => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x200&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`
  }

  const getMatchExplanation = (match: string) => {
    return `Match score based on: budget (${budget[0]}), location preferences, amenities, and lifestyle choices. This ${match} match means it meets most of your criteria.`
  }

  const filteredSuggestions = locationSuggestions.filter((city) => city.toLowerCase().includes(location.toLowerCase()))

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    setConversationContext((prev) => ({
      ...prev,
      interaction_count: prev.interaction_count + 1,
    }))

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I found some great options for you! Based on your preferences, here are the top recommendations:",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])

      // Add sample results
      setTimeout(() => {
        setShowRecommendations(true)
        setRentalResults(mockListings.slice(1, 3))
      }, 500)
    }, 1000)
  }

  const userPreferences = [
    { label: "Budget", value: "$1,500 - $2,500", icon: DollarSign },
    { label: "Bedrooms", value: "1-2 BR", icon: Home },
    { label: "Location", value: "Downtown, Midtown", icon: MapPin },
    { label: "Occupants", value: "2 people", icon: Users },
  ]

  const amenities = [
    { label: "Parking", icon: Car },
    { label: "WiFi", icon: Wifi },
    { label: "Gym", icon: Dumbbell },
    { label: "Pet Friendly", icon: Dog },
  ]

  const handleNeighborhoodChange = (neighborhood: string) => {
    setIsLoadingNeighborhood(true)
    setSelectedNeighborhood(neighborhood)

    // Simulate AI processing
    setTimeout(() => {
      setIsLoadingNeighborhood(false)
    }, 1500)
  }

  const getRecommendedNeighborhood = () => {
    if (lifestyle.includes("quiet")) return "Noe Valley"
    if (lifestyle.includes("transit")) return "Mission District"
    if (conversationContext.user_intents.includes("budget-conscious")) return "Mission District"
    return "Mission District"
  }

  return (
    <TooltipProvider>
      <div className="bg-white font-sans">
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }
          
          .shimmer {
            background: linear-gradient(
              90deg,
              rgba(92, 106, 196, 0.05) 0%,
              rgba(92, 106, 196, 0.15) 50%,
              rgba(92, 106, 196, 0.05) 100%
            );
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
            will-change: background-position;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .slide-in {
            animation: slideInUp 0.5s ease-out forwards;
            will-change: transform, opacity;
          }
          
          .slide-in-delay-1 {
            animation: slideInUp 0.5s ease-out 0.1s forwards;
            opacity: 0;
            will-change: transform, opacity;
          }
          
          .slide-in-delay-2 {
            animation: slideInUp 0.5s ease-out 0.2s forwards;
            opacity: 0;
            will-change: transform, opacity;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          .fade-in {
            animation: fadeIn 0.3s ease-out;
            will-change: opacity;
          }

          /* Optimize hover transforms to prevent layout thrashing */
          .hover-scale {
            transition: transform 0.3s ease;
            will-change: transform;
          }
          
          .hover-scale:hover {
            transform: scale(1.05);
          }

          @media (max-width: 768px) {
            .mobile-stack {
              flex-direction: column;
            }
            
            .mobile-hide {
              display: none;
            }
            
            .mobile-full {
              width: 100%;
            }
            
            .mobile-nav {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 60;
              background: white;
              border-top: 1px solid #e5e7eb;
              padding: 0.75rem;
            }
          }

          @media (min-width: 769px) {
            .desktop-only {
              display: block;
            }
            
            .mobile-only {
              display: none;
            }
          }
          
          /* Prevent ResizeObserver issues with transforms */
          * {
            transform-style: preserve-3d;
          }
        `}</style>

        {/* Sticky Header - Mobile Responsive */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Responsive */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#5C6AC4] rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden sm:inline">Apartment List AI Advisor</span>
                  <span className="sm:hidden">AI Advisor</span>
                </h1>
              </div>

              {/* Voice Mode Toggle and User Avatar - Mobile Responsive */}
              <div className="flex items-center gap-2 md:gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsVoiceMode(!isVoiceMode)}
                      className={`transition-all duration-200 ${
                        isVoiceMode
                          ? "bg-[#5C6AC4] text-white border-[#5C6AC4] hover:bg-[#4A5AB8]"
                          : "border-[#5C6AC4] text-[#5C6AC4] hover:bg-[#F4F5FA]"
                      }`}
                    >
                      {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      <span className="ml-2 hidden lg:inline">{isVoiceMode ? "Voice Mode" : "Switch to Voice"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="fade-in">
                    <p>{isVoiceMode ? "Switch to text mode" : "Switch to voice mode"}</p>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#F4F5FA]">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&query=professional headshot" />
                        <AvatarFallback className="bg-[#5C6AC4] text-white text-sm">JD</AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">John Doe</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 fade-in">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">john.doe@email.com</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="bg-[#F4F5FA] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Rental Advisor</h2>
            <p className="text-gray-600 mt-1">Find your perfect home with AI-powered recommendations</p>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="max-w-7xl mx-auto p-4 pb-32 md:pb-24">
          {/* Mobile Tab Content */}
          <div className="block md:hidden">
            {activeTab === "chat" && (
              <div className="space-y-6">
                {/* Chat Interface Card - Mobile */}
                <Card className="border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white relative overflow-hidden">
                    <div className="absolute inset-0 shimmer"></div>
                    <CardTitle className="text-xl font-bold flex items-center gap-3 relative z-10">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=40&width=40&query=friendly AI assistant woman" />
                        <AvatarFallback className="bg-white text-[#5C6AC4] font-bold">L</AvatarFallback>
                      </Avatar>
                      Meet Lea – Your AI Rental Advisor
                      <Badge className="bg-white/20 text-white border-white/30 ml-auto">🔮 AI Powered</Badge>
                    </CardTitle>
                    {/* Lea's Learning Progress */}
                    <div className="mt-3 relative z-10">
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <span>Learning your preferences:</span>
                        <Progress value={leaProgress} className="flex-1 h-2" />
                        <span>{leaProgress}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Chat Interface */}
                    <div className="space-y-4 mb-6">
                      {/* Lea's Messages */}
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 shimmer">
                          <p className="text-sm">Hi Dhruv! 👋 Ready to find your dream apartment?</p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 shimmer">
                          <p className="text-sm">
                            Tell me a bit about what you're looking for: city, budget, must-haves?
                          </p>
                        </div>
                      </div>

                      {/* User Messages and AI responses */}
                      {messages
                        .slice(1) // Skip the initial message
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} slide-in`}
                          >
                            <div
                              className={`max-w-[80%] p-4 rounded-2xl ${
                                message.sender === "user"
                                  ? "bg-[#7C3AED] text-white"
                                  : message.isSystemMessage
                                    ? "bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white shimmer"
                                    : "bg-gray-100 text-gray-800 shimmer"
                              } relative`}
                            >
                              {message.sender === "ai" && !message.isSystemMessage && (
                                <Badge className="absolute -top-2 -right-2 bg-[#5C6AC4] text-white text-xs">
                                  ✨ Smart Match
                                </Badge>
                              )}
                              {message.isSystemMessage && (
                                <Badge className="absolute -top-2 -right-2 bg-white/20 text-white text-xs">
                                  🧠 Learning
                                </Badge>
                              )}
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start slide-in">
                          <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 shimmer">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">Lea is typing...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Input */}
                      <div className="flex gap-3 mt-4">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={
                            isVoiceMode ? "Voice mode active - speak your message..." : "Type your message here..."
                          }
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1 rounded-2xl border-gray-300 focus:border-[#5C6AC4] focus:ring-[#5C6AC4] transition-all duration-200"
                          disabled={isTyping || isVoiceMode}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={isTyping || !inputValue.trim() || isVoiceMode}
                          className="bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white rounded-2xl px-6 disabled:opacity-50 transition-all duration-200 hover:scale-105"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Suggestion Chips */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {suggestionChips.map((chip, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(chip)}
                            disabled={isTyping}
                            className="px-4 py-2 bg-[#F4F5FA] text-[#5C6AC4] rounded-full text-sm font-medium hover:bg-[#5C6AC4] hover:text-white transition-all duration-200 border border-[#5C6AC4] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-md"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Smart Filters Suggestion */}
                    {conversationContext.recent_filters.length > 0 && !smartFiltersEnabled && (
                      <div className="bg-[#F4F5FA] border border-[#5C6AC4] rounded-lg p-4 mb-6 fade-in">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-700">
                            Lea can auto-filter future results for you based on your preferences.
                          </p>
                          <Button
                            onClick={() => setSmartFiltersEnabled(true)}
                            size="sm"
                            className="bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white"
                          >
                            ✅ Enable Smart Filters
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Smart Recommendations */}
                    {showRecommendations && (
                      <div className="border-t border-gray-200 pt-6 slide-in">
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations for You</h3>
                          <Badge className="bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white">
                            🔮 AI Recommendation
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {rentalResults.map((listing, index) => (
                            <div
                              key={listing.id}
                              className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shimmer ${
                                index === 0 ? "slide-in" : index === 1 ? "slide-in-delay-1" : "slide-in-delay-2"
                              }`}
                            >
                              <div className="relative">
                                <img
                                  src={listing.imageUrl || "/placeholder.svg"}
                                  alt={listing.title}
                                  loading="lazy"
                                  className="rounded-xl w-full h-48 object-cover hover-scale transition-transform duration-300 shadow-md"
                                />
                                {listing.hasVideoTour && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-sm rounded-xl">
                                    <Play className="w-8 h-8 mr-2" />
                                    Video Tour
                                  </div>
                                )}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className="absolute top-2 right-2 bg-[#4CAF50] text-white cursor-help">
                                      ✨ {listing.match} Match
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="fade-in max-w-xs">
                                    <p>{getMatchExplanation(listing.match)}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1">
                                  ✓ Verified Listing
                                </Badge>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-1">{listing.title}</h4>
                                <p className="text-[#5C6AC4] font-bold text-lg mb-1">{listing.price}</p>
                                <p className="text-gray-600 text-sm mb-3">{listing.location}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {listing.badges.map((badge, badgeIndex) => {
                                    const badgeColors = {
                                      "Pet-Friendly": "bg-[#4CAF50]",
                                      Gym: "bg-[#FF9800]",
                                      "Near Transit": "bg-[#2196F3]",
                                      Balcony: "bg-[#9C27B0]",
                                      Parking: "bg-[#FF5722]",
                                      Rooftop: "bg-[#795548]",
                                      Concierge: "bg-[#607D8B]",
                                    }
                                    return (
                                      <Badge
                                        key={badgeIndex}
                                        className={`${badgeColors[badge] || "bg-gray-500"} text-white text-xs px-2 py-1`}
                                      >
                                        {badge}
                                      </Badge>
                                    )
                                  })}
                                  {listing.greenFeatures?.map((feature, idx) => (
                                    <Badge key={idx} className="bg-green-600 text-white text-xs px-2 py-1">
                                      {feature === "Solar Panels"
                                        ? "☀️ Solar"
                                        : feature === "EV Charging"
                                          ? "🔌 EV"
                                          : feature === "Green Certified"
                                            ? "🌱 Green"
                                            : feature}
                                    </Badge>
                                  ))}
                                  {listing.schoolRating && (
                                    <Badge className="bg-purple-600 text-white text-xs px-2 py-1">
                                      🎓 {listing.schoolRating}/10
                                    </Badge>
                                  )}
                                </div>

                                {/* Mini Map Preview */}
                                <div className="mb-4">
                                  <iframe
                                    className="w-full h-32 rounded-md border"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.01},${listing.lat - 0.01},${listing.lng + 0.01},${listing.lat + 0.01}&layer=mapnik&marker=${listing.lat},${listing.lng}`}
                                    loading="lazy"
                                    title={`Map for ${listing.title}`}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Button className="w-full bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg">
                                    Schedule Tour
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="w-full border-[#5C6AC4] text-[#5C6AC4] hover:bg-[#5C6AC4] hover:text-white transition-all duration-300"
                                    onClick={() => handleLeaHandleThis(listing)}
                                  >
                                    🤖 Let Lea Handle This
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                {/* All right column content for mobile */}
                {/* Mini Renter Profile */}
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                    <CardTitle className="text-[#5C6AC4]">Your Renter Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="bg-[#f9f9fc] rounded-xl p-4">
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#5C6AC4]" />
                          Budget: ${budget[0].toLocaleString()}/mo
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#5C6AC4]" />
                          Neighborhoods: {conversationContext.preferred_neighborhoods.join(", ")}
                        </li>
                        <li className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-[#5C6AC4]" />
                          Beds: {bedrooms || "Any"}
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#5C6AC4]" />
                          Priorities: {conversationContext.recent_filters.slice(0, 3).join(", ")}
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* My Preferences Card */}
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                    <CardTitle className="text-[#5C6AC4]">My Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-6">
                    {/* Location */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        value={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        placeholder="Enter city (e.g., San Francisco)"
                        className="w-full transition-all duration-200 focus:scale-105"
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto fade-in">
                          {filteredSuggestions.map((city, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-[#F4F5FA] cursor-pointer text-sm transition-colors duration-150"
                              onClick={() => {
                                setLocation(city)
                                setShowSuggestions(false)
                              }}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range: ${budget[0].toLocaleString()}/month
                      </label>
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={5000}
                        min={1000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>$1,000</span>
                        <span>$5,000</span>
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                      <Select value={bedrooms} onValueChange={setBedrooms}>
                        <SelectTrigger className="w-full transition-all duration-200 focus:scale-105">
                          <SelectValue placeholder="Select bedrooms" />
                        </SelectTrigger>
                        <SelectContent className="fade-in">
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="1br">1 Bedroom</SelectItem>
                          <SelectItem value="2br">2 Bedrooms</SelectItem>
                          <SelectItem value="3br">3 Bedrooms</SelectItem>
                          <SelectItem value="3plus">3+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* School District Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        School Considerations
                      </label>
                      <div className="space-y-3">
                        <Input
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="Search by school name"
                          className="w-full"
                        />
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Minimum school rating: {schoolRating[0]}/10
                          </label>
                          <Slider
                            value={schoolRating}
                            onValueChange={setSchoolRating}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Lifestyle Preferences</label>
                      <div className="space-y-3">
                        {[
                          { id: "pet-friendly", label: "Pet Friendly" },
                          { id: "gym", label: "Gym/Fitness Center" },
                          { id: "quiet", label: "Quiet Neighborhood" },
                          { id: "near-parks", label: "Near Parks" },
                          { id: "parking", label: "Parking Available" },
                          { id: "transit", label: "Near Public Transit" },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-2 hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150"
                          >
                            <Checkbox
                              id={item.id}
                              checked={lifestyle.includes(item.id)}
                              onCheckedChange={(checked) => handleLifestyleChange(item.id, checked as boolean)}
                            />
                            <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Green Features Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        Green Features
                      </label>
                      <div className="space-y-3">
                        {[
                          { id: "solar", label: "Green-certified / Solar Panels" },
                          { id: "ev-charging", label: "EV Charging Station" },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-2 hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150"
                          >
                            <Checkbox
                              id={item.id}
                              checked={greenFeatures.includes(item.id)}
                              onCheckedChange={(checked) => handleGreenFeaturesChange(item.id, checked as boolean)}
                            />
                            <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg">
                      Update Preferences
                    </Button>
                  </CardContent>
                </Card>

                {/* Renter Toolkit */}
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                    <CardTitle className="text-[#5C6AC4]">Renter Toolkit</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Dialog open={showBudgetCalculator} onOpenChange={setShowBudgetCalculator}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                          <Calculator className="w-4 h-4" />
                          Budget Calculator
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Budget Calculator</DialogTitle>
                          <DialogDescription>Calculate your ideal rent based on income and savings.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Monthly Income</label>
                            <Input placeholder="$5,000" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Current Savings</label>
                            <Input placeholder="$10,000" />
                          </div>
                          <div className="bg-[#F4F5FA] p-4 rounded-lg">
                            <p className="text-sm font-medium">Recommended Budget: $1,500 - $1,800/month</p>
                            <p className="text-xs text-gray-600 mt-1">Based on 30% of income rule</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                      <FileText className="w-4 h-4" />
                      Lease Comparison Tool
                    </Button>

                    <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                      <CheckSquare className="w-4 h-4" />
                      Application Checklist
                    </Button>

                    <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                      <MessageCircle className="w-4 h-4" />
                      Ask Lea Anything
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Lea's Next Steps */}
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                  <CardHeader
                    className="bg-[#F4F5FA] border-b border-gray-200 cursor-pointer shimmer"
                    onClick={() => setIsNextStepsExpanded(!isNextStepsExpanded)}
                  >
                    <CardTitle className="text-[#5C6AC4] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        Lea's Next Steps for You
                        <Badge className="bg-[#5C6AC4] text-white text-xs">🔮 AI Insights</Badge>
                      </div>
                      {isNextStepsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                  {isNextStepsExpanded && (
                    <CardContent className="p-4 fade-in">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                          <div className="text-lg">🕓</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">Scheduled tour for 3 PM on Thursday</p>
                            <p className="text-xs text-gray-600 mt-1">Luxury Downtown Loft - Financial District</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                          <div className="text-lg">📝</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">Drafted rental application for 2 units</p>
                            <p className="text-xs text-gray-600 mt-1">Ready to submit when you're ready</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                          <div className="text-lg">📍</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">
                              Recommending a quieter neighborhood based on your profile
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Brooklyn Heights might be perfect for you</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                          <div className="text-lg">💰</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">Found 3 new listings within your budget</p>
                            <p className="text-xs text-gray-600 mt-1">All include your must-have amenities</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 border-[#5C6AC4] text-[#5C6AC4] hover:bg-[#5C6AC4] hover:text-white transition-all duration-300 hover-scale"
                      >
                        View All Tasks
                      </Button>
                    </CardContent>
                  )}
                </Card>

                {/* User Profile */}
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                    <CardTitle className="text-[#5C6AC4]">Your Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48&query=professional headshot" />
                        <AvatarFallback className="bg-[#5C6AC4] text-white">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-600">Premium Member</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150">
                        <span className="text-gray-600">Searches this month</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex justify-between text-sm hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150">
                        <span className="text-gray-600">Saved properties</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex justify-between text-sm hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150">
                        <span className="text-gray-600">Tours scheduled</span>
                        <span className="font-semibold">3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Desired Amenities */}
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                    <CardTitle className="text-[#5C6AC4]">Desired Amenities</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {amenities.map((amenity, index) => {
                        const IconComponent = amenity.icon
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-all duration-200 hover-scale"
                          >
                            <IconComponent className="w-4 h-4 text-[#5C6AC4]" />
                            <span className="text-sm text-gray-700">{amenity.label}</span>
                          </div>
                        )
                      })}
                    </div>
                    <Button className="w-full mt-4 bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg">
                      Update Preferences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chat Interface and Results (65% width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meet Lea - AI Rental Advisor Card */}
              <Card className="border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white relative overflow-hidden">
                  <div className="absolute inset-0 shimmer"></div>
                  <CardTitle className="text-xl font-bold flex items-center gap-3 relative z-10">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&query=friendly AI assistant woman" />
                      <AvatarFallback className="bg-white text-[#5C6AC4] font-bold">L</AvatarFallback>
                    </Avatar>
                    Meet Lea – Your AI Rental Advisor
                    <Badge className="bg-white/20 text-white border-white/30 ml-auto">🔮 AI Powered</Badge>
                  </CardTitle>
                  {/* Lea's Learning Progress */}
                  <div className="mt-3 relative z-10">
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <span>Learning your preferences:</span>
                      <Progress value={leaProgress} className="flex-1 h-2" />
                      <span>{leaProgress}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Chat Interface */}
                  <div className="space-y-4 mb-6">
                    {/* Lea's Messages */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 shimmer">
                        <p className="text-sm">Hi Dhruv! 👋 Ready to find your dream apartment?</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 shimmer">
                        <p className="text-sm">
                          Tell me a bit about what you're looking for: city, budget, must-haves?
                        </p>
                      </div>
                    </div>

                    {/* User Messages and AI responses */}
                    {messages
                      .slice(1) // Skip the initial message
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} slide-in`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              message.sender === "user"
                                ? "bg-[#7C3AED] text-white"
                                : message.isSystemMessage
                                  ? "bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white shimmer"
                                  : "bg-gray-100 text-gray-800 shimmer"
                            } relative`}
                          >
                            {message.sender === "ai" && !message.isSystemMessage && (
                              <Badge className="absolute -top-2 -right-2 bg-[#5C6AC4] text-white text-xs">
                                ✨ Smart Match
                              </Badge>
                            )}
                            {message.isSystemMessage && (
                              <Badge className="absolute -top-2 -right-2 bg-white/20 text-white text-xs">
                                🧠 Learning
                              </Badge>
                            )}
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start slide-in">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100 text-gray-800 shimmer">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">Lea is typing...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* User Input */}
                    <div className="flex gap-3 mt-4">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          isVoiceMode ? "Voice mode active - speak your message..." : "Type your message here..."
                        }
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 rounded-2xl border-gray-300 focus:border-[#5C6AC4] focus:ring-[#5C6AC4] transition-all duration-200"
                        disabled={isTyping || isVoiceMode}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isTyping || !inputValue.trim() || isVoiceMode}
                        className="bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white rounded-2xl px-6 disabled:opacity-50 transition-all duration-200 hover-scale"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Suggestion Chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {suggestionChips.map((chip, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(chip)}
                          disabled={isTyping}
                          className="px-4 py-2 bg-[#F4F5FA] text-[#5C6AC4] rounded-full text-sm font-medium hover:bg-[#5C6AC4] hover:text-white transition-all duration-200 border border-[#5C6AC4] disabled:opacity-50 disabled:cursor-not-allowed hover-scale hover:shadow-md"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smart Filters Suggestion */}
                  {conversationContext.recent_filters.length > 0 && !smartFiltersEnabled && (
                    <div className="bg-[#F4F5FA] border border-[#5C6AC4] rounded-lg p-4 mb-6 fade-in">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                          Lea can auto-filter future results for you based on your preferences.
                        </p>
                        <Button
                          onClick={() => setSmartFiltersEnabled(true)}
                          size="sm"
                          className="bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white"
                        >
                          ✅ Enable Smart Filters
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Smart Recommendations */}
                  {showRecommendations && (
                    <div className="border-t border-gray-200 pt-6 slide-in">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations for You</h3>
                        <Badge className="bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white">
                          🔮 AI Recommendation
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rentalResults.map((listing, index) => (
                          <div
                            key={listing.id}
                            className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shimmer ${
                              index === 0 ? "slide-in" : index === 1 ? "slide-in-delay-1" : "slide-in-delay-2"
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={listing.imageUrl || "/placeholder.svg"}
                                alt={listing.title}
                                loading="lazy"
                                className="rounded-xl w-full h-48 object-cover hover-scale transition-transform duration-300 shadow-md"
                              />
                              {listing.hasVideoTour && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-sm rounded-xl">
                                  <Play className="w-8 h-8 mr-2" />
                                  Video Tour
                                </div>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="absolute top-2 right-2 bg-[#4CAF50] text-white cursor-help">
                                    ✨ {listing.match} Match
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="fade-in max-w-xs">
                                  <p>{getMatchExplanation(listing.match)}</p>
                                </TooltipContent>
                              </Tooltip>
                              <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1">
                                ✓ Verified Listing
                              </Badge>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">{listing.title}</h4>
                              <p className="text-[#5C6AC4] font-bold text-lg mb-1">{listing.price}</p>
                              <p className="text-gray-600 text-sm mb-3">{listing.location}</p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {listing.badges.map((badge, badgeIndex) => {
                                  const badgeColors = {
                                    "Pet-Friendly": "bg-[#4CAF50]",
                                    Gym: "bg-[#FF9800]",
                                    "Near Transit": "bg-[#2196F3]",
                                    Balcony: "bg-[#9C27B0]",
                                    Parking: "bg-[#FF5722]",
                                    Rooftop: "bg-[#795548]",
                                    Concierge: "bg-[#607D8B]",
                                  }
                                  return (
                                    <Badge
                                      key={badgeIndex}
                                      className={`${badgeColors[badge] || "bg-gray-500"} text-white text-xs px-2 py-1`}
                                    >
                                      {badge}
                                    </Badge>
                                  )
                                })}
                                {listing.greenFeatures?.map((feature, idx) => (
                                  <Badge key={idx} className="bg-green-600 text-white text-xs px-2 py-1">
                                    {feature === "Solar Panels"
                                      ? "☀️ Solar"
                                      : feature === "EV Charging"
                                        ? "🔌 EV"
                                        : feature === "Green Certified"
                                          ? "🌱 Green"
                                          : feature}
                                  </Badge>
                                ))}
                                {listing.schoolRating && (
                                  <Badge className="bg-purple-600 text-white text-xs px-2 py-1">
                                    🎓 {listing.schoolRating}/10
                                  </Badge>
                                )}
                              </div>

                              {/* Mini Map Preview */}
                              <div className="mb-4">
                                <iframe
                                  className="w-full h-32 rounded-md border"
                                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.01},${listing.lat - 0.01},${listing.lng + 0.01},${listing.lat + 0.01}&layer=mapnik&marker=${listing.lat},${listing.lng}`}
                                  loading="lazy"
                                  title={`Map for ${listing.title}`}
                                />
                              </div>

                              <div className="space-y-2">
                                <Button className="w-full bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg">
                                  Schedule Tour
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full border-[#5C6AC4] text-[#5C6AC4] hover:bg-[#5C6AC4] hover:text-white transition-all duration-300"
                                  onClick={() => handleLeaHandleThis(listing)}
                                >
                                  🤖 Let Lea Handle This
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tabbed Interface (35% width) */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <Card className="border border-gray-200">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setRightPanelTab("preferences")}
                    className={`flex-1 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                      rightPanelTab === "preferences"
                        ? "border-[#5C6AC4] text-[#5C6AC4] bg-[#F4F5FA]"
                        : "border-transparent text-gray-600 hover:text-[#5C6AC4] hover:border-[#5C6AC4]"
                    }`}
                  >
                    Preferences
                  </button>
                  <button
                    onClick={() => setRightPanelTab("neighborhood")}
                    className={`flex-1 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                      rightPanelTab === "neighborhood"
                        ? "border-[#5C6AC4] text-[#5C6AC4] bg-[#F4F5FA]"
                        : "border-transparent text-gray-600 hover:text-[#5C6AC4] hover:border-[#5C6AC4]"
                    }`}
                  >
                    🧠 Neighborhood Guide
                  </button>
                  <button
                    onClick={() => setRightPanelTab("profile")}
                    className={`flex-1 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                      rightPanelTab === "profile"
                        ? "border-[#5C6AC4] text-[#5C6AC4] bg-[#F4F5FA]"
                        : "border-transparent text-gray-600 hover:text-[#5C6AC4] hover:border-[#5C6AC4]"
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </Card>

              {/* Tab Content */}
              {rightPanelTab === "preferences" && (
                <div className="space-y-6">
                  {/* Mini Renter Profile */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                      <CardTitle className="text-[#5C6AC4]">Your Renter Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="bg-[#f9f9fc] rounded-xl p-4">
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#5C6AC4]" />
                            Budget: ${budget[0].toLocaleString()}/mo
                          </li>
                          <li className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#5C6AC4]" />
                            Neighborhoods: {conversationContext.preferred_neighborhoods.join(", ")}
                          </li>
                          <li className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-[#5C6AC4]" />
                            Beds: {bedrooms || "Any"}
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#5C6AC4]" />
                            Priorities: {conversationContext.recent_filters.slice(0, 3).join(", ")}
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* My Preferences Card - Keep existing content */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                      <CardTitle className="text-[#5C6AC4]">My Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-6">
                      {/* Location */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <Input
                          value={location}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          placeholder="Enter city (e.g., San Francisco)"
                          className="w-full transition-all duration-200 focus:scale-105"
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto fade-in">
                            {filteredSuggestions.map((city, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 hover:bg-[#F4F5FA] cursor-pointer text-sm transition-colors duration-150"
                                onClick={() => {
                                  setLocation(city)
                                  setShowSuggestions(false)
                                }}
                              >
                                {city}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Budget Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Range: ${budget[0].toLocaleString()}/month
                        </label>
                        <Slider
                          value={budget}
                          onValueChange={setBudget}
                          max={5000}
                          min={1000}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>$1,000</span>
                          <span>$5,000</span>
                        </div>
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                        <Select value={bedrooms} onValueChange={setBedrooms}>
                          <SelectTrigger className="w-full transition-all duration-200 focus:scale-105">
                            <SelectValue placeholder="Select bedrooms" />
                          </SelectTrigger>
                          <SelectContent className="fade-in">
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="1br">1 Bedroom</SelectItem>
                            <SelectItem value="2br">2 Bedrooms</SelectItem>
                            <SelectItem value="3br">3 Bedrooms</SelectItem>
                            <SelectItem value="3plus">3+ Bedrooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* School District Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          School Considerations
                        </label>
                        <div className="space-y-3">
                          <Input
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            placeholder="Search by school name"
                            className="w-full"
                          />
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Minimum school rating: {schoolRating[0]}/10
                            </label>
                            <Slider
                              value={schoolRating}
                              onValueChange={setSchoolRating}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lifestyle */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Lifestyle Preferences</label>
                        <div className="space-y-3">
                          {[
                            { id: "pet-friendly", label: "Pet Friendly" },
                            { id: "gym", label: "Gym/Fitness Center" },
                            { id: "quiet", label: "Quiet Neighborhood" },
                            { id: "near-parks", label: "Near Parks" },
                            { id: "parking", label: "Parking Available" },
                            { id: "transit", label: "Near Public Transit" },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2 hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150"
                            >
                              <Checkbox
                                id={item.id}
                                checked={lifestyle.includes(item.id)}
                                onCheckedChange={(checked) => handleLifestyleChange(item.id, checked as boolean)}
                              />
                              <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Green Features Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          Green Features
                        </label>
                        <div className="space-y-3">
                          {[
                            { id: "solar", label: "Green-certified / Solar Panels" },
                            { id: "ev-charging", label: "EV Charging Station" },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2 hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150"
                            >
                              <Checkbox
                                id={item.id}
                                checked={greenFeatures.includes(item.id)}
                                onCheckedChange={(checked) => handleGreenFeaturesChange(item.id, checked as boolean)}
                              />
                              <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg">
                        Update Preferences
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Renter Toolkit - Keep existing content */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                      <CardTitle className="text-[#5C6AC4]">Renter Toolkit</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Dialog open={showBudgetCalculator} onOpenChange={setShowBudgetCalculator}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                            <Calculator className="w-4 h-4" />
                            Budget Calculator
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Budget Calculator</DialogTitle>
                            <DialogDescription>
                              Calculate your ideal rent based on income and savings.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Monthly Income</label>
                              <Input placeholder="$5,000" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Current Savings</label>
                              <Input placeholder="$10,000" />
                            </div>
                            <div className="bg-[#F4F5FA] p-4 rounded-lg">
                              <p className="text-sm font-medium">Recommended Budget: $1,500 - $1,800/month</p>
                              <p className="text-xs text-gray-600 mt-1">Based on 30% of income rule</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                        <FileText className="w-4 h-4" />
                        Lease Comparison Tool
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                        <CheckSquare className="w-4 h-4" />
                        Application Checklist
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#F4F5FA]">
                        <MessageCircle className="w-4 h-4" />
                        Ask Lea Anything
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {rightPanelTab === "neighborhood" && (
                <div className="space-y-6">
                  {/* Neighborhood Selector */}
                  <Card className="border border-gray-200">
                    <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                      <CardTitle className="text-[#5C6AC4] flex items-center gap-2">
                        🧠 AI Neighborhood Guide
                        <Badge className="bg-[#5C6AC4] text-white text-xs">AI-Generated</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Select value={selectedNeighborhood} onValueChange={handleNeighborhoodChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select neighborhood" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(neighborhoodData).map((neighborhood) => (
                            <SelectItem key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  {/* Neighborhood Insights */}
                  <Card
                    className={`border border-gray-200 hover:shadow-md transition-all duration-300 ${isLoadingNeighborhood ? "shimmer" : ""}`}
                  >
                    <CardContent className="p-6">
                      {isLoadingNeighborhood ? (
                        <div className="space-y-4 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{selectedNeighborhood} Overview</h3>
                            <Badge className="bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] text-white">
                              {neighborhoodData[selectedNeighborhood].aiMatch}% Match
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed">
                            {neighborhoodData[selectedNeighborhood].summary}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {neighborhoodData[selectedNeighborhood].badges.map((badge, index) => (
                              <Badge key={index} className="bg-[#F4F5FA] text-[#5C6AC4] border border-[#5C6AC4]">
                                {badge}
                              </Badge>
                            ))}
                          </div>

                          <img
                            src={neighborhoodData[selectedNeighborhood].imageUrl || "/placeholder.svg"}
                            alt={selectedNeighborhood}
                            className="w-full h-40 object-cover rounded-lg shadow-md"
                            loading="lazy"
                          />

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🏫</span>
                                <span>Schools: {neighborhoodData[selectedNeighborhood].schoolRating}/10</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🛡️</span>
                                <span>Safety: {neighborhoodData[selectedNeighborhood].safetyScore}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🎯</span>
                                <span>Lifestyle: {neighborhoodData[selectedNeighborhood].lifestyle.split(",")[0]}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🌳</span>
                                <span>Parks: {neighborhoodData[selectedNeighborhood].parks.length}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#F4F5FA] rounded-lg p-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">Key Highlights:</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {neighborhoodData[selectedNeighborhood].highlights.map((highlight, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-[#5C6AC4] rounded-full"></span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Button
                            className="w-full bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg"
                            onClick={() => {
                              setShowRecommendations(true)
                              setRentalResults(
                                mockListings.filter((listing) =>
                                  listing.location.includes(selectedNeighborhood.split(" ")[0]),
                                ),
                              )
                            }}
                          >
                            Explore Listings in {selectedNeighborhood}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Compare Neighborhoods */}
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <Button
                        variant="outline"
                        className="w-full border-[#5C6AC4] text-[#5C6AC4] hover:bg-[#5C6AC4] hover:text-white"
                      >
                        Compare Neighborhoods
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {rightPanelTab === "profile" && (
                <div className="space-y-6">
                  {/* Lea's Next Steps */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardHeader
                      className="bg-[#F4F5FA] border-b border-gray-200 cursor-pointer shimmer"
                      onClick={() => setIsNextStepsExpanded(!isNextStepsExpanded)}
                    >
                      <CardTitle className="text-[#5C6AC4] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          Lea's Next Steps for You
                          <Badge className="bg-[#5C6AC4] text-white text-xs">🔮 AI Insights</Badge>
                        </div>
                        {isNextStepsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </CardTitle>
                    </CardHeader>
                    {isNextStepsExpanded && (
                      <CardContent className="p-4 fade-in">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                            <div className="text-lg">🕓</div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">Scheduled tour for 3 PM on Thursday</p>
                              <p className="text-xs text-gray-600 mt-1">Luxury Downtown Loft - Financial District</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                            <div className="text-lg">📝</div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">Drafted rental application for 2 units</p>
                              <p className="text-xs text-gray-600 mt-1">Ready to submit when you're ready</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                            <div className="text-lg">📍</div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                Recommending a quieter neighborhood based on your profile
                              </p>
                              <p className="text-xs text-gray-600 mt-1">Brooklyn Heights might be perfect for you</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-colors duration-200 shimmer">
                            <div className="text-lg">💰</div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">Found 3 new listings within your budget</p>
                              <p className="text-xs text-gray-600 mt-1">All include your must-have amenities</p>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full mt-4 border-[#5C6AC4] text-[#5C6AC4] hover:bg-[#5C6AC4] hover:text-white transition-all duration-300 hover-scale"
                        >
                          View All Tasks
                        </Button>
                      </CardContent>
                    )}
                  </Card>

                  {/* User Profile */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                      <CardTitle className="text-[#5C6AC4]">Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48&query=professional headshot" />
                          <AvatarFallback className="bg-[#5C6AC4] text-white">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">John Doe</h3>
                          <p className="text-sm text-gray-600">Premium Member</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150">
                          <span className="text-gray-600">Searches this month</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between text-sm hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150">
                          <span className="text-gray-600">Saved properties</span>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex justify-between text-sm hover:bg-[#F4F5FA] p-2 rounded transition-colors duration-150">
                          <span className="text-gray-600">Tours scheduled</span>
                          <span className="font-semibold">3</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Desired Amenities */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-[#F4F5FA] border-b border-gray-200">
                      <CardTitle className="text-[#5C6AC4]">Desired Amenities</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {amenities.map((amenity, index) => {
                          const IconComponent = amenity.icon
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-[#F4F5FA] rounded-lg hover:bg-[#E8EAF6] transition-all duration-200 hover-scale"
                            >
                              <IconComponent className="w-4 h-4 text-[#5C6AC4]" />
                              <span className="text-sm text-gray-700">{amenity.label}</span>
                            </div>
                          )
                        })}
                      </div>
                      <Button className="w-full mt-4 bg-[#5C6AC4] hover:bg-[#4A5AB8] text-white transition-all duration-300 hover-scale hover:shadow-lg">
                        Update Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lea Handle This Modal */}
        <Dialog open={showLeaModal} onOpenChange={setShowLeaModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🤖 Lea is handling this for you!</DialogTitle>
              <DialogDescription>I'm taking care of everything for {selectedListing?.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-[#F4F5FA] p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Contacted the landlord</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Scheduled a tour for this weekend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">🔄 Starting your application...</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                I'll send you updates as things progress. You can focus on other listings while I handle the details!
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mobile Navigation Bar */}
        <div className="mobile-nav md:hidden">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "chat" ? "bg-[#5C6AC4] text-white" : "text-gray-600"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Lea Chat</span>
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "preferences" ? "bg-[#5C6AC4] text-white" : "text-gray-600"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Preferences</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "profile" ? "bg-[#5C6AC4] text-white" : "text-gray-600"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </button>
          </div>
        </div>

        {/* Sticky Footer Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] rounded-lg flex items-center justify-center shimmer">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  This prototype showcases the power of <span className="text-[#5C6AC4] font-semibold">Lea</span>, your
                  AI-powered apartment concierge.
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-[#5C6AC4] to-[#7C3AED] hover:from-[#4A5AB8] to-[#6B2FB5] text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 hover-scale hover:shadow-lg shimmer whitespace-nowrap"
                    onClick={() => {
                      console.log("See Full Rental Journey clicked")
                    }}
                  >
                    See Full Rental Journey
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="fade-in">
                  <p>Explore the complete rental experience with Lea</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Add bottom padding to main content to prevent footer overlap - Mobile Responsive */}
        <div className="h-20 md:h-20"></div>
      </div>
    </TooltipProvider>
  )
}
