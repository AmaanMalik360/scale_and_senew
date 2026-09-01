import PageHeader from "../../../../components/about/PageHeader";
import ContentSection from "../../../../components/about/ContentSection";
import ImageTextBlock from "../../../../components/about/ImageTextBlock";
import AboutSidebar from "../../../../components/about/AboutSidebar";

export default function OurStory() {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>
      
      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Our Story" 
          subtitle="A journey of craftsmanship, exotic leathers, and everyday utility"
        />
        
        <ContentSection>
          <ImageTextBlock
            image="/products/assets/Crocodile%20Leather%20Black%20Wallet.jpeg"
            imageAlt="Scale and Senew crocodile leather wallet"
            title="Built for Lasting Use"
            content="Scale and Senew began with a simple idea: everyday carry should feel premium, durable, and personal. We focus on exotic leather wallets, bags, and card holders made for people who value design, function, and long-term quality."
            imagePosition="left"
          />
        </ContentSection>

        <ContentSection title="Our Heritage">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Traditional Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our artisans hand-finish each wallet and bag with careful stitching, edge work, and structure control. We preserve proven leathercraft methods while refining details for modern daily use.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Responsible Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">
                We work with vetted suppliers and small-batch production partners to maintain traceability and consistency. Our goal is fewer, better-made products that stay in rotation for years.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Our Values">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Excellence</h3>
              <p className="text-muted-foreground">
                We pursue precision in cut, finish, and hardware selection for every release.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Authenticity</h3>
              <p className="text-muted-foreground">
                Every item reflects real leather character and honest craftsmanship.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Innovation</h3>
              <p className="text-muted-foreground">
                We keep evolving silhouettes, pocket layouts, and carry formats without losing timeless appeal.
              </p>
            </div>
          </div>
        </ContentSection>
      </main>
    </div>
  );
}
