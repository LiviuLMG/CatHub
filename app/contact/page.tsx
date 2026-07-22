"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { SiGithub, } from "@icons-pack/react-simple-icons";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "liviulmg05@gmail.com",
    href: "mailto:liviulmg05@gmail.com",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    value: "github.com/LiviuLMG",
    href: "https://github.com/LiviuLMG",
  },
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/your-profile",
    href: "https://linkedin.com/in/your-profile",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (honeypot) {
      setSent(true);
      return;
    }

    setLoading(true);

    const supabase = createClient();

    // Salvăm mesajul în Supabase (istoric/backup)
    await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || null,
      message,
    });

    // Trimitem emailul real prin Resend
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error("Couldn't send message", { description: data.error });
      return;
    }

    toast.success("Message sent! I'll get back to you soon.");
    setSent(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Contact
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Let&apos;s get in touch
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Interested in this project, have feedback, or want to talk about an
          opportunity? Drop me a message, I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                <Send size={24} />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Message sent!
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Thanks for reaching out. I&apos;ll get back to you as soon as
                possible.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setSent(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px]"
                aria-hidden="true"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Job opportunity, feedback, question..."
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me what's on your mind..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" size="lg" disabled={loading} className="w-fit gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Sending..." : "Send message"}
                {!loading && <Send size={16} />}
              </Button>
            </form>
          )}
        </div>

        {/* Direct links */}
        <div className="flex flex-col gap-4">
          {contactLinks.map((link) => (

            <a key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <link.icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {link.label}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {link.value}
                </p>
              </div>
            </a>
          ))}

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} />
              <p className="text-sm">Based in Romania</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Open to remote opportunities and local positions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}