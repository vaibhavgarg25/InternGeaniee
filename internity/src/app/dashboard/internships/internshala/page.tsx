"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Building } from "lucide-react"
import { motion } from "framer-motion"
import { LayoutWrapper } from "../components/layout-wrapper"
import { InternshalaCredentials } from "../components/internshala-credentials"
import { PreferencesSectionBase, type PreferencesData } from "../components/preferences-section-base"

// Type definition for Internshala internship data
interface InternshalaInternship {
  id: string
  title: string
  company: string
  applicants: string
  days_left: string
  skills: string[]
  category: string
  scraped_at: string
  url: string | null
}

export default function InternshalaInternshipsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [internships, setInternships] = useState<InternshalaInternship[]>([])
const [preference, setPreferences] = useState<PreferencesData>()

  const startInternshalaScraper = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(" http://127.0.0.1:5000/api/internships/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preference),
      })

      if (!response.ok) {
        throw new Error("Scraping failed")
      }
    } catch (error) {
      console.error("Error scraping LinkedIn internships:", error)
    }
  }

  const fetchInternshalaInternships = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/internships/list", {
        method: "GET",
      })
      const data = await res.json()
      console.log(data)
      setInternships(data.data || [])
    } catch (error) {
      console.error("Error fetching internships:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handler that chains both functions together
  const handleScrape = async () => {
    await startInternshalaScraper()
    await fetchInternshalaInternships()
  }

  // Handle saving LinkedIn preferences
  const handleSavePreferences = (preferences: PreferencesData) => {
    console.log("Saving internshala preferences:", preferences)
    setPreferences(preferences)
    // In a real app, this would save the preferences to the backend
    // fetch('/api/preferences/linkedin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(preferences)
    // })

    alert("internshala preferences saved successfully!")
  }

  return (
    <LayoutWrapper title="Internshala Internships">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#f1eece]">Internshala Internships</h3>
        <Button
          onClick={handleScrape}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
              Scraping...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Scrape Now
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-[#a90519] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-[#f1eece]/70">Scraping Internshala internships...</span>
        </div>
      ) : internships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship) => (
            <motion.div
              key={internship.id}
              className="bg-[rgba(19,19,24,0.85)] text-[#f1eece] border border-[#f1eece]/20 rounded-xl p-4 shadow transition hover:scale-[1.01]"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col h-full">
                <h4 className="text-lg font-semibold text-[#f1eece]">{internship.title}</h4>
                <div className="flex items-center text-[#f1eece]/70 mt-1">
                  <Building size={16} className="mr-1" />
                  {internship.company}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-[#f1eece]/70 text-sm">
                    <span className="font-medium">Applicants:</span> {internship.applicants}
                  </div>
                  <div className="text-[#f1eece]/70 text-sm">
                    <span className="font-medium">Days Left:</span> {internship.days_left}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {internship.skills.map((skill, index) => (
                    <Badge key={index} className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto pt-3 flex justify-between items-center">
                  <Badge className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
                    {internship.category}
                  </Badge>
                  <div className="text-[#f1eece]/50 text-xs">
                    Scraped: {new Date(internship.scraped_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#f1eece]/50">
          <p>No Internshala internships found. Click "Scrape Now" to fetch the latest listings.</p>
        </div>
      )}

      {/* Internshala-specific preferences section */}
      <div className="mt-6">
        <PreferencesSectionBase onSave={handleSavePreferences} title="Internshala Application Preferences" />
      </div>

      {/* Internshala-specific credentials section */}
      <div className="mt-6">
        <InternshalaCredentials />
      </div>
    </LayoutWrapper>
  )
}
