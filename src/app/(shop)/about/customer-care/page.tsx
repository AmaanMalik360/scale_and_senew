import PageHeader from "../../../../components/about/PageHeader";
import ContentSection from "../../../../components/about/ContentSection";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion";
import AboutSidebar from "../../../../components/about/AboutSidebar";

export default function CustomerCare() {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>
      
      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Customer Care" 
          subtitle="Support for orders, care, shipping, and returns"
        />
        
        <ContentSection title="Contact Us">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Get in Touch</h3>
              <p className="text-muted-foreground">
                Our support team is available Monday through Saturday, 10 AM to 7 PM PKT.
              </p>
              <div className="space-y-4">
                <p><strong>Email:</strong> care@scaleandsenew.com</p>
                <p><strong>Phone:</strong> +92 300 0000000</p>
                <p><strong>WhatsApp:</strong> Available for quick order support</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-light text-foreground">Send us a Message</h3>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" rows={4} />
                <Button>Send Message</Button>
              </form>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Frequently Asked Questions">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shipping">
              <AccordionTrigger>What are your shipping options?</AccordionTrigger>
              <AccordionContent>
                We offer standard and express delivery options based on your city. Delivery timelines are shared on order confirmation and can vary during peak periods.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                Returns are accepted for eligible products within the stated return window, provided the item is unused and in original condition. Custom or personalized pieces may not be returnable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>How do I care for exotic leather products?</AccordionTrigger>
              <AccordionContent>
                Keep your wallet or bag dry, store it away from direct sunlight, and wipe with a soft dry cloth. Avoid harsh chemicals and prolonged moisture exposure.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ContentSection>
      </main>
    </div>
  );
}
