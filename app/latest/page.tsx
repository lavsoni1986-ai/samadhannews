import type { Metadata } from "next";
import AllNews from "@/components/AllNews";

export const metadata: Metadata = {
  title: "ताज़ा खबरें – समाधान NEWS",
  description: "समाधान NEWS पर सभी ताज़ा हिंदी समाचार और अपडेट पढ़ें। खबर वही जो सही।",
  alternates: { canonical: "https://samadhaannews.in/latest" },
};

export default function LatestPage() {
  return <AllNews title="ताज़ा खबरें" subtitle="भारत और दुनिया की सभी ताज़ा खबरें" />;
}
