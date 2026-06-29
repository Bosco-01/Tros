import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex bg-white text-neutral-950">
      {/* 
        Left Side Panel - Visual Image Card 
        Hidden on mobile/tablet screens (<1024px) to guarantee fully responsive behavior. 
      */}
      <div className="hidden lg:flex w-1/2 p-6 pr-3 h-screen">
        <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden shadow-sm bg-neutral-900 select-none">
          {/* 
            Placeholder image matching your Figma draft layout.
            You can manually replace this URL with your local asset path inside `/public` anytime.
          */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] hover:scale-[1.03]"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />

          {/* Rich dual-tone gradient overlay matching the Figma colors (Vibrant purple to deep bronze-gold) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#6312E1]/85 via-[#6312E1]/50 to-[#473003]/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6312E1]/10 to-[#312001]/90" />
        </div>
      </div>

      {/* 
        Right Side Panel - Form Container 
        Centered, scrollable, and adjusts automatically on smaller viewports.
      */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 h-screen overflow-y-auto">
        <LoginForm />
      </div>
    </main>
  );
}
