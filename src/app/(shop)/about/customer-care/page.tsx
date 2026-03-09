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
          subtitle="We're here to help with any questions or concerns"
        />
        
        <ContentSection title="Contact Us">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Get in Touch</h3>
              <p className="text-muted-foreground">
                Our customer care team is available Monday through Friday, 9 AM to 6 PM EST.
              </p>
              <div className="space-y-4">
                <p><strong>Email:</strong> care@lineajewelry.com</p>
                <p><strong>Phone:</strong> 1-800-LINEA (1-800-54632)</p>
                <p><strong>Live Chat:</strong> Available on our website</p>
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
                We offer standard shipping (5-7 days), express shipping (2-3 days), and overnight shipping. 
                Standard shipping is free on orders over $100.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We accept returns within 30 days of purchase. Items must be in their original condition 
                with all tags and packaging intact.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>How do I care for my jewelry?</AccordionTrigger>
              <AccordionContent>
                Store your jewelry in a soft pouch or lined box. Clean with a soft cloth and avoid 
                exposure to harsh chemicals or extreme temperatures.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ContentSection>
      </main>
    </div>
  );
}
