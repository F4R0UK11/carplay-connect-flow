import { Zap, Shield, Wrench } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Pairing",
    description: "Connect in seconds — no cables.",
  },
  {
    icon: Shield,
    title: "Reliable",
    description: "Stable connection across miles.",
  },
  {
    icon: Wrench,
    title: "Easy Install",
    description: "Plug in, pair, go.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
