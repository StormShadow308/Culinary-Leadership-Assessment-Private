import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronRight, Award, Users, BarChart3, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slide-up");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Culinary Leadership
            <span className="text-brand-orange"> Assessment</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in delay-100">
            Transform your culinary leadership skills with our comprehensive
            assessment platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
            <Link
              to="/assessment"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors"
            >
              Start Assessment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/participant-dashboard"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-on-scroll opacity-0 translate-y-10">
            Comprehensive Assessment Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ChefHat,
                title: "Culinary Expertise",
                description:
                  "Evaluate and enhance your culinary leadership capabilities",
              },
              {
                icon: Award,
                title: "Skill Assessment",
                description:
                  "Identify strengths and areas for improvement in your leadership",
              },
              {
                icon: Users,
                title: "Team Management",
                description:
                  "Develop effective strategies for leading culinary teams",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description:
                  "Monitor your growth with detailed analytics and insights",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 animate-on-scroll opacity-0 translate-y-10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon
                  className="h-12 w-12 text-brand-orange mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/lovable-uploads/452bb85c-a9fd-4058-b2d1-124fa5d74c5a.png"
                alt="Chef preparing food"
                className="rounded-lg shadow-xl animate-on-scroll opacity-0 translate-y-10"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-blue/10 rounded-lg"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll opacity-0 translate-y-10">
                Benefits
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 animate-on-scroll opacity-0 translate-y-10">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-brand-orange" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Enhanced Leadership Skills</h3>
                    <p className="text-gray-600">
                      Develop crucial soft skills needed for successful kitchen management.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: "100ms" }}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-brand-blue" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Better Team Dynamics</h3>
                    <p className="text-gray-600">
                      Create a more collaborative and efficient kitchen environment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: "200ms" }}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-brand-orange" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
                    <p className="text-gray-600">
                      Make informed decisions about hiring and team development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll opacity-0 translate-y-10">
            Ready to Transform Your Leadership?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-on-scroll opacity-0 translate-y-10">
            Join thousands of culinary professionals who have enhanced their
            leadership skills through our assessment platform.
          </p>
          <Link
            to="/participant-dashboard"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors animate-on-scroll opacity-0 translate-y-10"
          >
            Begin Your Journey
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
