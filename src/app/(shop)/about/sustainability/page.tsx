import PageHeader from "../../../../components/about/PageHeader";
import ContentSection from "../../../../components/about/ContentSection";
import AboutSidebar from "../../../../components/about/AboutSidebar";

export default function Sustainability() {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>
      
      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
      <PageHeader 
        title="Sustainability" 
        subtitle="Building better leather goods with responsible sourcing and mindful production"
      />
      
      <ContentSection title="Our Environmental Commitment">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-xl font-light text-foreground">Ethical Sourcing</h3>
            <p className="text-muted-foreground leading-relaxed">
              We work with suppliers who can provide clarity on leather origin, treatment, and handling. We prioritize partners that follow responsible practices and consistent quality standards.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-light text-foreground">Low-Waste Crafting</h3>
            <p className="text-muted-foreground leading-relaxed">
              We optimize cutting patterns and production batches to reduce material waste, and we repurpose usable offcuts for small accessories wherever possible.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Sustainable Practices">
        <div className="space-y-8">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Small-Batch Production</h3>
            <p className="text-muted-foreground leading-relaxed">
              We intentionally keep production runs focused to avoid overstock and unnecessary inventory waste. This helps us maintain better quality control and reduce excess manufacturing.
            </p>
          </div>
          
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Long Product Life</h3>
            <p className="text-muted-foreground leading-relaxed">
              Durable construction is part of our sustainability strategy. Products that last longer reduce replacement cycles and encourage conscious buying over fast consumption.
            </p>
          </div>
        </div>
      </ContentSection>
      </main>
    </div>
  );
}
