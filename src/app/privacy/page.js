"use client";
import { useRouter } from "next/navigation";
import PublicShell from "../components/PublicShell";

export default function Privacy() {
  const router = useRouter();
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: January 2026</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
            <p>When you use Qevora, we collect the information you provide during registration (name, email, phone, role) and the business details you enter when running scans. We also collect basic usage data to improve our service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Your Information</h2>
            <p>We use your information to generate AI readiness reports, improve our analysis, and communicate with you about your account. We never sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Data Security</h2>
            <p>Your data is protected with industry-standard security measures, including encrypted passwords and secure connections. Access to your organizations and reports is restricted to your account.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. AI Processing</h2>
            <p>Business details you submit are processed by AI models to generate your reports. We recommend not submitting highly sensitive information during scans.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Your Rights</h2>
            <p>You can view, update, or delete your data at any time from your dashboard. To request full account deletion, contact us using the details on our Contact page.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Contact</h2>
            <p>For any privacy-related questions, please reach out through our Contact page.</p>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}