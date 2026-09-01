const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <img 
          src="/products/new-assets/Red%20HandBag%20Crocodile%20%20(2).png" 
          alt="Scale and Senew exotic leather bag" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="">
        <h2 className="text-sm font-normal text-foreground mb-1">
          Modern Exotic Craft
        </h2>
        <p className="text-sm font-light text-foreground">
          Statement wallets and bags crafted from premium exotic textures.
        </p>
      </div>
    </section>
  );
};

export default LargeHero;