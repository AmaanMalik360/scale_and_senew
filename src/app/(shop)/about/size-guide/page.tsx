import PageHeader from "../../../../components/about/PageHeader";
import ContentSection from "../../../../components/about/ContentSection";
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
        subtitle="Compare wallet, card holder, and bag dimensions before you order"
      />
      
      <ContentSection title="Wallet & Card Holder Sizing">
        <div className="space-y-8">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-6">How to Compare Dimensions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Method 1: Compare With Your Current Wallet</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Place your current wallet flat on a table</li>
                  <li>Measure width, height, and folded thickness</li>
                  <li>Match against our size chart below</li>
                </ol>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Method 2: Check Carry Capacity</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Count how many cards you carry daily</li>
                  <li>Decide if you also carry cash and coins</li>
                  <li>Pick slim, standard, or long format accordingly</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product Type</th>
                  <th className="text-left p-4">Typical Size</th>
                  <th className="text-left p-4">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Slim Card Holder</td>
                  <td className="p-4">10 x 7 cm</td>
                  <td className="p-4">4-8 cards, minimal carry</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Bi-Fold Wallet</td>
                  <td className="p-4">11 x 9 cm</td>
                  <td className="p-4">Cards + folded cash</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Long Wallet</td>
                  <td className="p-4">19 x 10 cm</td>
                  <td className="p-4">Flat notes, receipts, cards</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Ladies Bag</td>
                  <td className="p-4">Small / Medium / Large</td>
                  <td className="p-4">Daily carry to occasion use</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Bag Fit Guide">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-light text-foreground">Capacity Guide</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Small Bag</span>
                <span>Phone + wallet + keys</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Medium Bag</span>
                <span>Essentials + makeup pouch</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Large Bag</span>
                <span>Daily essentials + extra storage</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Handle Drop</span>
                <span>Check product-specific listing</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-light text-foreground">Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Pick slim formats for front-pocket carry</li>
              <li>Choose long wallets if you carry full-length notes often</li>
              <li>For travel, prioritize zip closure and structured compartments</li>
              <li>Review dimensions on each product page before ordering</li>
            </ul>
          </div>
        </div>
      </ContentSection>
      </main>
    </div>
  );
}
