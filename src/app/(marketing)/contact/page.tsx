"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, MapPin, Mail, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { contactContent } from "@/content/contact";

const contactSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Please select a subject"),
  order_number: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine((val) => val === true, "Consent is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { hero, channels, businessInfo, departments, form, cta } =
    contactContent;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, type: "contact" };
      console.log("Contact payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      toast.success(form.successMessage);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 border-2 border-secondary flex items-center justify-center mx-auto mb-8">
            <Check className="h-10 w-10 text-secondary" />
          </div>
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            Message Sent
          </span>
          <h1 className="text-headline-lg-mobile md:text-display-lg text-on-surface mb-8">
            We&apos;ll Be in Touch
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-12">
            {form.successMessage}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300"
            >
              Return Home
            </Link>
            <Link
              href="/shop"
              className="border border-outline-variant font-ui-button px-10 py-5 hover:border-secondary transition-colors duration-300"
            >
              Shop Menswear
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="container-atelier pt-24 md:pt-40 mb-16">
        <span className="text-label-caps text-secondary tracking-widest block mb-4">
          {hero.kicker}
        </span>
        <h1 className="text-display-lg text-on-surface leading-tight whitespace-pre-line">
          {hero.headline}
        </h1>
      </section>

      {/* Upper Split: Info Cards + Form Panel */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left: Info Cards */}
          <div className="lg:col-span-5 space-y-gutter">
            {/* Email Card */}
            <div className="bronze-border p-8 bg-surface-container">
              <span className="text-label-caps text-secondary block mb-2">
                {channels.primary.title}
              </span>
              <p className="text-body-md text-on-surface-variant mb-4">
                {channels.primary.description}
              </p>
              <a
                href={`mailto:${channels.primary.email}`}
                className="text-body-lg text-on-surface hover:text-secondary transition-colors inline-flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                {channels.primary.email}
              </a>
              <p className="text-sm text-on-surface-variant mt-2">
                {channels.primary.responseTime}
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="border border-outline-variant p-8">
              <span className="text-label-caps text-secondary block mb-2">
                {channels.whatsapp.title}
              </span>
              <p className="text-body-md text-on-surface-variant mb-6">
                {channels.whatsapp.description}
              </p>
              <WhatsAppButton
                context="general"
                label={channels.whatsapp.cta.text}
                variant="outline"
                size="md"
                className="!font-ui-button !rounded-none border-outline-variant hover:!border-[#25D366]"
              />
              <p className="text-sm text-on-surface-variant mt-3">
                {channels.whatsapp.note}
              </p>
            </div>

            {/* Business Address */}
            <div className="border border-outline-variant p-8">
              <span className="text-label-caps text-secondary block mb-2">
                {businessInfo.title}
              </span>
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                <address className="not-italic text-body-md text-on-surface-variant">
                  <span className="block font-medium text-on-surface">
                    {businessInfo.company}
                  </span>
                  {businessInfo.address.line1}
                  <br />
                  {businessInfo.address.line2}
                  <br />
                  {businessInfo.address.country}
                </address>
              </div>
              <p className="text-sm text-on-surface-variant mt-4">
                {businessInfo.note}
              </p>
            </div>
          </div>

          {/* Right: Form Panel */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container p-8 md:p-12">
              <span className="text-label-caps text-secondary block mb-4">
                {form.title}
              </span>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-2">
                    {form.fields.fullName.label} *
                  </label>
                  <input
                    type="text"
                    {...register("full_name")}
                    className="w-full bg-surface border border-outline-variant px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                    placeholder={form.fields.fullName.placeholder}
                  />
                  {errors.full_name && (
                    <p className="text-error text-sm mt-1">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-2">
                    {form.fields.email.label} *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-surface border border-outline-variant px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                    placeholder={form.fields.email.placeholder}
                  />
                  {errors.email && (
                    <p className="text-error text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-2">
                    {form.fields.subject.label} *
                  </label>
                  <select
                    {...register("subject")}
                    className="w-full bg-surface border border-outline-variant px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-secondary"
                  >
                    <option value="">Select subject</option>
                    {form.fields.subject.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-error text-sm mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-2">
                    {form.fields.orderNumber.label}
                  </label>
                  <input
                    type="text"
                    {...register("order_number")}
                    className="w-full bg-surface border border-outline-variant px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                    placeholder={form.fields.orderNumber.placeholder}
                  />
                </div>

                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-2">
                    {form.fields.message.label} *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full bg-surface border border-outline-variant px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary resize-none"
                    placeholder={form.fields.message.placeholder}
                  />
                  {errors.message && (
                    <p className="text-error text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    id="consent"
                    className="mt-1 w-4 h-4 accent-secondary"
                  />
                  <label
                    htmlFor="consent"
                    className="text-body-md text-on-surface-variant"
                  >
                    {form.consent.label}
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-error text-sm">{errors.consent.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      {form.submit}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Contacts */}
      <section className="container-atelier mb-block-gap">
        <span className="text-label-caps text-secondary tracking-widest block mb-6">
          {departments.title}
        </span>
        <details className="border border-outline-variant p-6 bg-surface">
          <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
            View specialist email contacts
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mt-6">
            {departments.items.map((dept) => (
              <div key={dept.department} className="border border-outline-variant p-6">
                <h3 className="text-body-lg font-medium text-on-surface mb-2">
                  {dept.department}
                </h3>
                <p className="text-body-md text-on-surface-variant mb-4">
                  {dept.description}
                </p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-sm text-secondary hover:underline inline-flex items-center gap-2"
                >
                  {dept.email}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* CTA */}
      <section className="border-y border-outline-variant py-32 mb-block-gap">
        <div className="container-atelier">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-6">
              <span className="text-label-caps text-secondary tracking-widest block mb-4">
                {cta.kicker}
              </span>
              <h2 className="text-display-lg text-on-surface mb-4">
                {cta.headline}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {cta.description}
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={cta.primaryCta.href}
                className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
              >
                {cta.primaryCta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
