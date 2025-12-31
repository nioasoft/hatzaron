import Link from "next/link";
import {
  FileText,
  Users,
  Bell,
  BarChart3,
  Upload,
  PieChart,
  FolderX,
  Clock,
  Calendar,
  Frown,
  ArrowLeft,
} from "lucide-react";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Button } from "@/components/ui/button";
import { MARKETING } from "@/lib/constants/hebrew";
import type { LucideIcon } from "lucide-react";

const featureIcons: LucideIcon[] = [FileText, Users, Bell, BarChart3, Upload, PieChart];
const painPointIcons: LucideIcon[] = [FolderX, Clock, Calendar, Frown];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {MARKETING.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {MARKETING.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/register">{MARKETING.hero.ctaPrimary}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">{MARKETING.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {MARKETING.painPoints.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {MARKETING.painPoints.items.map((item, index) => {
              const Icon = painPointIcons[index]!;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background border"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
                    <Icon className="h-5 w-5 text-destructive" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {MARKETING.features.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MARKETING.features.items.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={featureIcons[index]!}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {MARKETING.howItWorks.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {MARKETING.howItWorks.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                {index < MARKETING.howItWorks.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 start-0 w-full">
                    <ArrowLeft className="h-6 w-6 text-muted-foreground absolute start-0 -translate-x-1/2" />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {MARKETING.cta.title}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {MARKETING.cta.subtitle}
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
          >
            <Link href="/register">{MARKETING.cta.button}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
