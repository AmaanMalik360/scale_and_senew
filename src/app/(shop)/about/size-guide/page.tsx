import PageHeader from "../../../../components/about/PageHeader";
import ContentSection from "../../../../components/about/ContentSection";
import { Button } from "../../../../components/ui/button";
import AboutSidebar from "../../../../components/about/AboutSidebar";

export default function SizeGuide() {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>
      
      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
      <PageHeader 
        title="Size Guide" 
        subtitle="Find your perfect fit with our comprehensive sizing guide"
      />
      
      <ContentSection title="Ring Sizing">
        <div className="space-y-8">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-6">How to Measure Your Ring Size</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Method 1: Using a Ring You Own</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Select a ring that fits the intended finger</li>
                  <li>Measure the inside diameter of the ring</li>
                  <li>Use our size chart below to find your size</li>
                </ol>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Method 2: Measuring Your Finger</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Wrap a string around your finger</li>
                  <li>Mark where the string overlaps</li>
                  <li>Measure the length and use our chart</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">US Size</th>
                  <th className="text-left p-4">Diameter (mm)</th>
                  <th className="text-left p-4">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">5</td>
                  <td className="p-4">15.7</td>
                  <td className="p-4">49.3</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">6</td>
                  <td className="p-4">16.5</td>
                  <td className="p-4">51.8</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">7</td>
                  <td className="p-4">17.3</td>
                  <td className="p-4">54.4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">8</td>
                  <td className="p-4">18.1</td>
                  <td className="p-4">56.9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Necklace Sizing">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-light text-foreground">Length Guide</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Choker</span>
                <span>14-16 inches</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Princess</span>
                <span>17-19 inches</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Matinee</span>
                <span>20-24 inches</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Opera</span>
                <span>28-34 inches</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-light text-foreground">Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Consider your neck size and height</li>
              <li>Longer necklaces elongate the torso</li>
              <li>Layer multiple lengths for versatility</li>
              <li>Consider pendant size when choosing length</li>
            </ul>
          </div>
        </div>
      </ContentSection>
      </main>
    </div>
  );
}
