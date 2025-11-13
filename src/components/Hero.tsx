import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-carplay.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                CarPlay, without the wires.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Wireless adapters, plug-and-play screens, and accessories that make your car feel new.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link to="#products">Shop Wireless Adapters</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="#compatibility">Check Compatibility</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
              <img
                src={heroImage}
                alt="Wireless CarPlay adapter in car dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
