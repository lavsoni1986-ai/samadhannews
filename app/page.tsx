import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: {
    default: "समाधान NEWS | खबर वही जो सही",
    template: "%s | समाधान NEWS",
  },
  description: "समाधान NEWS – भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म। राजनीति, राष्ट्रीय, अंतर्राष्ट्रीय, राज्य, व्यापार, तकनीक, खेल, मनोरंजन, स्वास्थ्य और शिक्षा की ताज़ा खबरें। खबर वही जो सही।",
  keywords: ["समाधान न्यूज", "Samadhaan News", "हिंदी समाचार", "ताज़ा खबर", "Breaking News", "राजनीति", "राष्ट्रीय", "खेल", "मनोरंजन", "तकनीक"],
  alternates: { canonical: "https://samadhaannews.in" },
};

export default function Home() {
  return <HomeContent />;
}
