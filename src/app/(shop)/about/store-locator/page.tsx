import PageHeader from "../../../../components/about/PageHeader";
import ContentSection from "../../../../components/about/ContentSection";
import StoreMap from "../../../../components/about/StoreMap";
import AboutSidebar from "../../../../components/about/AboutSidebar";

export default function StoreLocator() {
  const stores = [
    {
      name: "LINEA Madison Avenue",
      address: "789 Madison Avenue, New York, NY 10065",
      phone: "+1 (212) 555-0123",
      hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
      services: ["Personal Shopping", "Custom Design", "Repairs", "Appraisals"]
    },
    {
      name: "LINEA Beverly Hills",
      address: "456 Rodeo Drive, Beverly Hills, CA 90210",
      phone: "+1 (310) 555-0456",
      hours: "Mon-Sat: 10AM-7PM, Sun: 11AM-5PM",
      services: ["Personal Shopping", "Custom Design", "Repairs"]
    }
  ];

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>
      
      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Store Locator" 
          subtitle="Visit our flagship stores and experience LINEA in person"
        />
        
        <ContentSection>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Our Locations</h3>
              {stores.map((store, index) => (
                <div key={index} className="border-b pb-6">
                  <h4 className="font-medium text-foreground mb-2">{store.name}</h4>
                  <p className="text-muted-foreground mb-2">{store.address}</p>
                  <p className="text-muted-foreground mb-2">{store.phone}</p>
                  <p className="text-muted-foreground mb-3">{store.hours}</p>
                  <div className="flex flex-wrap gap-2">
                    {store.services.map((service, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-96 lg:h-full min-h-96">
              <StoreMap />
            </div>
          </div>
        </ContentSection>
      </main>
    </div>
  );
}
