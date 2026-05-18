import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ruler, Plus, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteMeasurementButton } from "@/components/account/DeleteMeasurementButton";

export default async function MeasurementsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?redirect=/account/measurements");
  }

  const { data: profiles } = await supabase
    .from("measurement_profiles")
    .select("*")
    .eq("email", user.email)
    .order("created_at", { ascending: false });

  return (
    <div className="container-atelier py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-heading font-semibold mb-2">
                Measurements
              </h1>
              <p className="text-on-surface-variant">
                Save your measurements for faster custom orders
              </p>
            </div>
            <Link
              href="/fit-guide"
              className="inline-flex items-center gap-2 px-4 py-2 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Profile
            </Link>
          </div>
        </div>

        {/* Measurement Profiles */}
        {!profiles || profiles.length === 0 ? (
          <div className="text-center py-12 bg-surface-container">
            <Ruler className="w-12 h-12 mx-auto text-on-surface-variant mb-4" />
            <h2 className="text-lg font-medium mb-2">No measurement profiles</h2>
            <p className="text-on-surface-variant mb-6 max-w-sm mx-auto">
              Add your measurements to make custom ordering faster. You can save
              multiple profiles for different garment types.
            </p>
            <Link
              href="/fit-guide"
              className="inline-block px-6 py-3 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
            >
              Add Measurements
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => {
              const measurements = profile.measurements as Record<
                string,
                number | string
              > | null;

              return (
                <div
                  key={profile.id}
                  className="bg-surface border border-outline-variant p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">
                        {profile.profile_name || "My Measurements"}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        {profile.garment_category
                          ? `For ${profile.garment_category}`
                          : "General"}{" "}
                        •{" "}
                        {profile.measurement_method === "body"
                          ? "Body measurements"
                          : "Garment measurements"}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Added{" "}
                        {new Date(profile.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/fit-guide?edit=${profile.id}`}
                        className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteMeasurementButton profileId={profile.id} />
                    </div>
                  </div>

                  {/* Measurements Summary */}
                  {measurements && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      {Object.entries(measurements)
                        .filter(([_, value]) => value)
                        .slice(0, 6)
                        .map(([key, value]) => (
                          <div key={key}>
                            <span className="text-on-surface-variant capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>{" "}
                            <span className="font-medium">
                              {value}
                              {typeof value === "number"
                                ? profile.unit === "cm"
                                  ? " cm"
                                  : '"'
                                : ""}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}

                  {profile.fit_preference && (
                    <p className="text-sm text-on-surface-variant mt-4">
                      Fit preference:{" "}
                      <span className="capitalize">{profile.fit_preference}</span>
                    </p>
                  )}

                  {profile.notes && (
                    <p className="text-sm text-on-surface-variant mt-2 italic">
                      &quot;{profile.notes}&quot;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-6 bg-secondary/5 border border-secondary/20">
          <h3 className="font-medium mb-2">Measurement Tips</h3>
          <ul className="text-sm text-on-surface-variant space-y-1">
            <li>
              • Save separate profiles for shirts vs. trousers for best results
            </li>
            <li>• Update your measurements if your body changes significantly</li>
            <li>
              • Include notes about fit preferences (e.g., &quot;I prefer slim fit
              shirts&quot;)
            </li>
            <li>
              • Not sure how to measure?{" "}
              <Link href="/fit-guide" className="text-secondary hover:underline">
                See our fit guide
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
