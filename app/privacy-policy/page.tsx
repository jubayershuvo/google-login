import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">Privacy Policy</h1>

        <section className="space-y-4 text-gray-700">
          <p>
            This app uses Google OAuth to access your Gmail account with <strong>read-only access</strong> 
            (<code>https://www.googleapis.com/auth/gmail.readonly</code>).
          </p>
          <p>
            We only read emails to display your inbox. We do NOT send, modify, or delete any emails.
          </p>
          <p>
            Your Gmail data is stored securely and never shared with third parties. You can revoke access anytime via your Google Account settings.
          </p>
          <p>
            Contact us at <a href="mailto:support@example.com" className="text-indigo-600 underline">support@example.com</a> for questions.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-600 font-semibold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
