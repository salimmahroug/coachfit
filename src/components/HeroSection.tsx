import { Button } from "@/components/ui/button";
import { Play, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/fitness-hero.jpg";

interface HeroSectionProps {
  onStartNow?: () => void;
  onViewDemo?: () => void;
}

const HeroSection = ({ onStartNow, onViewDemo }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] flex items-center overflow-hidden py-8 sm:py-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-2xl">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <img
              src="/logo.png"
              alt="Coach Fit Logo"
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Créez des programmes
            <span className="bg-gradient-hero bg-clip-text text-transparent block">
              sur mesure
            </span>
            pour vos clients
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            L'outil intelligent qui transforme votre expertise en programmes
            d'entraînement personnalisés. Gagnez du temps, optimisez les
            résultats.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              variant="hero"
              size="lg"
              className="group"
              onClick={onStartNow}
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Commencer maintenant
            </Button>
            <Button variant="outline" size="lg" onClick={onViewDemo}>
              Voir la démo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  500+
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Clients actifs
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-energy" />
                <span className="text-xl sm:text-2xl font-bold text-energy">
                  95%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
