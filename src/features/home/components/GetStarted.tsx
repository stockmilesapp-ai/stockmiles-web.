import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import Container from "@/shared/components/Container";

function GetStarted() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-brand-green-500 to-brand-lavender-600 px-6 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start with your next trip
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Sign in with your Google account. No password to remember.
          </p>
          <div className="mt-8 flex justify-center">
            <GoogleSignInButton onDark />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default GetStarted;
