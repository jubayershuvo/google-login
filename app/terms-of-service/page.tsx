import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">Terms of Service</h1>

        <section className="space-y-4 text-gray-700">
          <p>
            By using this app, you agree to our rules and understand that we only access your Gmail account 
            with <strong>read-only access</strong>. We do not send or modify emails.
          </p>
          <p>
            Your account data is handled securely. You can revoke access anytime through Google Account settings.
          </p>
          <p>
            This app is provided as-is. We are not responsible for any Gmail account issues caused outside of our app.
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
