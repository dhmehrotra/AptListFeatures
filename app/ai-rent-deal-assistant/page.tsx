"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  DollarSign,
  Calendar,
  MapPin,
  Lightbulb,
  Copy,
  X,
  ChevronDown,
  MessageCircle,
  Minimize2,
} from "lucide-react"

export default function AIRentDealAssistant() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Welcome back! Ready to negotiate like a pro?",
    },
    {
      id: 2,
      type: "user",
      content: "Is $2,650 reasonable for this unit?",
    },
    {
      id: 3,
      type: "ai",
      content: "That's ~6% above local average. Want a strategy to counter-offer?",
    },
  ])

  const [showScriptModal, setShowScriptModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [visibleCards, setVisibleCards] = useState(new Set())
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Downtown")
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showFloatingChat, setShowFloatingChat] = useState(false)
  const [floatingMessage, setFloatingMessage] = useState("")

  const neighborhoods = ["Downtown", "SOMA", "Mission", "Noe Valley", "Castro", "Marina", "Richmond", "Sunset"]

  const comparisonUnits = [
    {
      id: 1,
      address: "456 Pine Street",
      price: "$2,200/month",
      savings: "$450 less",
      features: "1BR • 650 sq ft • No parking",
      distance: "0.3 miles away",
    },
    {
      id: 2,
      address: "789 Market Street",
      price: "$2,350/month",
      savings: "$300 less",
      features: "1BR • 700 sq ft • Parking included",
      distance: "0.5 miles away",
    },
  ]

  useEffect(() => {
    // Animate cards on load
    const timer = setTimeout(() => {
      setVisibleCards(new Set([0, 1, 2, 3, 4, 5, 6]))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
    }

    setMessages([...messages, newMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate AI response with typing indicator
    setTimeout(() => {
      setIsTyping(false)
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content:
          "Based on the market data, this property is priced 8% above market average. I recommend starting your negotiation at $2,450/month and highlighting the lack of parking as a negotiation point.",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 2000)
  }

  const handleFloatingChatSend = () => {
    if (!floatingMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: floatingMessage,
    }

    setMessages([...messages, newMessage])
    setFloatingMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: "I can help with that! Let me analyze the current market conditions for you.",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const copyToClipboard = async () => {
    const script = `Hi [Landlord Name],

Based on recent market data, I'd like to offer $2,450/month instead of $2,650.
I'm prepared to sign quickly and move in by [date].

Let me know if this works for you.

Thanks,
[Your Name]`

    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const TypingIndicator = () => (
    <div className="flex items-start gap-3 max-w-xs">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">L</span>
      </div>
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-md">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* Header - Match Feature 1 styling */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Lea – Your Rent Deal Advisor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Beta
              </Badge>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chat with Lea */}
            <div
              className={`transform transition-all duration-700 ${
                visibleCards.has(0) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                    Chat with Lea
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div className="flex items-start gap-3 max-w-xs lg:max-w-md">
                          {msg.type === "ai" && (
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">L</span>
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 ${
                              msg.type === "user"
                                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-md"
                                : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                  </div>

                  {/* Suggestion Chips */}
                  <div className="border-t border-gray-100 p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition-colors border border-purple-200">
                        Compare to market avg
                      </button>
                      <button className="px-4 py-2 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition-colors border border-purple-200">
                        Suggest offer price
                      </button>
                      <button className="px-4 py-2 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition-colors border border-purple-200">
                        Show rent trends
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask Lea anything about this rental..."
                        className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} className="bg-indigo-600 text-white hover:bg-indigo-700 px-6">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rent Forecast */}
            <div
              className={`transform transition-all duration-700 delay-100 ${
                visibleCards.has(1) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                      📉 Rent Forecast
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-100 text-purple-700 border border-purple-200">🔮 AI Prediction</Badge>

                      {/* Neighborhood Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setShowNeighborhoodDropdown(!showNeighborhoodDropdown)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm text-gray-700">View Rent Trends in {selectedNeighborhood}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>

                        {showNeighborhoodDropdown && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            {neighborhoods.map((neighborhood) => (
                              <button
                                key={neighborhood}
                                onClick={() => {
                                  setSelectedNeighborhood(neighborhood)
                                  setShowNeighborhoodDropdown(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                  selectedNeighborhood === neighborhood
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {neighborhood}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Chart */}
                  <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200">
                    <svg className="w-full h-full" viewBox="0 0 300 120">
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        points="20,80 60,75 100,70 140,65 180,60 220,55 260,50"
                      />
                      <polyline
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        points="0,40 300,40"
                      />
                      <polyline
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        points="0,80 300,80"
                      />
                      <circle cx="260" cy="50" r="4" fill="#6366f1" />
                    </svg>
                    <div className="absolute bottom-3 left-3 text-sm text-gray-500">
                      30-day trend in {selectedNeighborhood}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium">
                      📉 Rent expected to drop 3.2% over the next 60 days in {selectedNeighborhood}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Snapshot */}
            <div
              className={`transform transition-all duration-700 delay-200 ${
                visibleCards.has(2) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                      📈 Pricing Snapshot
                    </CardTitle>

                    {/* Comparison Toggle */}
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                        showComparison
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {showComparison ? "Hide" : "Compare"} Other Units in Area
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listing Price</span>
                        <span className="font-semibold text-gray-900">$2,650</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Neighborhood Avg</span>
                        <span className="font-semibold text-gray-900">$2,510</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Smart Offer</span>
                        <span className="font-semibold text-indigo-600">$2,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Forecasted Drop</span>
                        <span className="font-semibold text-green-600">-3.2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Units */}
            {showComparison && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <h3 className="text-lg font-semibold text-gray-900">💰 Cheaper Options Nearby</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparisonUnits.map((unit) => (
                    <Card
                      key={unit.id}
                      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{unit.address}</h4>
                              <p className="text-sm text-gray-600">{unit.distance}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-gray-900">{unit.price}</div>
                              <div className="text-sm text-green-600 font-medium">{unit.savings}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{unit.features}</div>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Optimal Timing */}
            <div
              className={`transform transition-all duration-700 delay-300 ${
                visibleCards.has(3) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    ⏳ Optimal Timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 mb-3 font-medium">🏠 Listings like this stay on market ~17 days</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div className="bg-indigo-600 h-3 rounded-full" style={{ width: "47%" }}></div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">8/17 days</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-800 font-medium">⚡ 9 days left before urgency rises</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Confidence Meter */}
            <div
              className={`transform transition-all duration-700 delay-400 ${
                visibleCards.has(4) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    🎯 Confidence Meter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">$2,450</span>
                      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <span className="font-medium text-green-600">High</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">$2,500</span>
                      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4">
                        <div className="bg-yellow-500 h-4 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <span className="font-medium text-yellow-600">Medium</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">$2,600+</span>
                      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4">
                        <div className="bg-red-500 h-4 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <span className="font-medium text-red-600">Low</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">💡 Best chances of acceptance are between $2,420–$2,480</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Calculator */}
            <div
              className={`transform transition-all duration-700 delay-500 ${
                visibleCards.has(5) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    🧾 Cost Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly rent × 12</span>
                      <span className="font-semibold text-gray-900">$29,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security deposit estimate</span>
                      <span className="font-semibold text-gray-900">$2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">First month + prorated</span>
                      <span className="font-semibold text-gray-900">$2,450</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900 text-lg">Total move-in cost</span>
                        <span className="font-bold text-indigo-600 text-xl">$4,900</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800 text-sm font-medium">💰 Based on your smart offer of $2,450/month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Offer Summary */}
            <div
              className={`transform transition-all duration-700 delay-600 ${
                visibleCards.has(6) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    <DollarSign className="h-6 w-6 text-indigo-600" />
                    Current Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed Price</span>
                      <span className="font-semibold text-gray-900">$2,650/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Offer</span>
                      <span className="font-semibold text-indigo-600">$2,450/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Potential Savings</span>
                      <span className="font-semibold text-green-600">$200/month</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">123 Oak Street, Downtown</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">Available March 1st</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Negotiation Tools */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                  <Lightbulb className="h-6 w-6 text-indigo-600" />
                  Negotiation Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3">
                    Generate Counter Offer
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3">
                    Market Comparison Report
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3">
                    Negotiation Script
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      📊 View comparable properties
                    </button>
                    <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      📝 Draft email to landlord
                    </button>
                    <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      📞 Schedule viewing
                    </button>
                    <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      💡 Get negotiation tips
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Negotiation Script Button */}
            <Button
              onClick={() => setShowScriptModal(true)}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-4 text-lg font-medium"
            >
              💬 Generate Negotiation Script
            </Button>

            {/* Success Probability */}
            <Card className="bg-purple-50 border border-purple-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">73%</div>
                  <div className="text-gray-700 font-medium">Negotiation Success Rate</div>
                  <div className="text-sm text-gray-500 mt-1">Based on similar properties</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Lea Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showFloatingChat ? (
          <Card className="w-80 bg-white border border-gray-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-semibold text-gray-900">Ask Lea</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowFloatingChat(false)} className="h-8 w-8 p-0">
                <Minimize2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-32 overflow-y-auto mb-3 space-y-2">
                {messages.slice(-2).map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-3 py-2 text-sm max-w-[200px] ${
                        msg.type === "user"
                          ? "bg-indigo-600 text-white rounded-lg rounded-tr-sm"
                          : "bg-gray-100 text-gray-900 rounded-lg rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-tl-sm">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={floatingMessage}
                  onChange={(e) => setFloatingMessage(e.target.value)}
                  placeholder="Quick question..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleFloatingChatSend()}
                />
                <Button
                  onClick={handleFloatingChatSend}
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setShowFloatingChat(true)}
            className="w-14 h-14 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Script Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Suggested Script to Send Your Landlord
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowScriptModal(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <textarea
                  readOnly
                  value={`Hi [Landlord Name],

Based on recent market data, I'd like to offer $2,450/month instead of $2,650.
I'm prepared to sign quickly and move in by [date].

Let me know if this works for you.

Thanks,
[Your Name]`}
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 resize-none focus:outline-none"
                />

                <Button
                  onClick={copyToClipboard}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    🤖 AI-Generated Script
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-gray-700 font-medium text-lg">Ready to submit your offer? Lea can guide you.</span>
            </div>
            <div className="relative">
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 text-lg font-medium"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                Proceed to Application
              </Button>

              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full right-0 mb-3 w-72 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg">
                  <div className="space-y-2">
                    <p className="font-medium">Next steps:</p>
                    <p>• Review your optimized offer</p>
                    <p>• Complete rental application</p>
                    <p>• Submit with negotiation script</p>
                  </div>
                  <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
