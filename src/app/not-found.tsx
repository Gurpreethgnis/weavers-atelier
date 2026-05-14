import Link from "next/link";
import { HeroImage } from "@/components/layout/HeroImage";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center">
      <div className="container-atelier">
        <div className="grid grid-cols-12 gap-gutter items-center min-h-[80vh]">
          {/* Left Vertical Border */}
          <div className="col-span-1 hidden lg:flex justify-center h-full">
            <div className="w-px h-full bg-outline-variant" />
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-5 py-16 lg:py-0">
            <span className="text-label-caps text-secondary tracking-widest block mb-4">
              Structural Anomaly
            </span>
            <h1 className="text-[120px] md:text-[180px] lg:text-[220px] font-display leading-none text-on-surface mb-8">
              404
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-md mb-12">
              Void in geometry — the pattern you seek does not exist within our
              atelier. Perhaps it was never woven, or it has been carefully
              archived elsewhere.
            </p>

            <div className="space-y-4">
              <Link
                href="/instagram-looks"
                className="block font-ui-button text-on-surface hover:text-secondary transition-colors duration-300"
              >
                → Return to Archive
              </Link>
              <Link
                href="/"
                className="block font-ui-button text-on-surface hover:text-secondary transition-colors duration-300"
              >
                → Enter the Atelier
              </Link>
              <Link
                href="/how-it-works"
                className="block font-ui-button text-on-surface hover:text-secondary transition-colors duration-300"
              >
                → Heritage Home
              </Link>
            </div>
          </div>

          {/* Right Vertical Border */}
          <div className="col-span-1 hidden lg:flex justify-center h-full">
            <div className="w-px h-full bg-outline-variant" />
          </div>

          {/* Image Fragment */}
          <div className="col-span-12 lg:col-span-4 mt-12 lg:mt-0">
            <div className="bronze-border p-4">
              <div className="aspect-[3/4] relative">
                <HeroImage
                  src="/images/atelier/void-fragment.jpg"
                  alt="Abstract atelier detail"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* Right Vertical Border */}
          <div className="col-span-1 hidden lg:flex justify-center h-full">
            <div className="w-px h-full bg-outline-variant" />
          </div>
        </div>
      </div>
    </main>
  );
}
