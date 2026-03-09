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
        subtitle="Creating beautiful jewelry while protecting our planet for future generations"
      />
      
      <ContentSection title="Our Environmental Commitment">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-xl font-light text-foreground">Ethical Sourcing</h3>
            <p className="text-muted-foreground leading-relaxed">
              We partner only with suppliers who share our commitment to ethical practices. Every gemstone and precious metal in our collection is sourced responsibly, with full transparency in our supply chain.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-light text-foreground">Recycled Materials</h3>
            <p className="text-muted-foreground leading-relaxed">
              We prioritize the use of recycled precious metals and ethically sourced gemstones, reducing our environmental impact while maintaining the highest quality standards.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Sustainable Practices">
        <div className="space-y-8">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Our Carbon Neutral Initiative</h3>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to becoming carbon neutral by 2025. This includes optimizing our manufacturing processes, using renewable energy, and investing in carbon offset programs.
            </p>
          </div>
          
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Waste Reduction</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our zero-waste initiative ensures that all materials are utilized efficiently. We recycle metal scraps, repurpose gemstone fragments, and use eco-friendly packaging materials.
            </p>
          </div>
        </div>
      </ContentSection>
      </main>
    </div>
  );
}
