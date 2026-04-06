import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <ClerkSignIn fallbackRedirectUrl="/home" />
    </main>
  );
};

export default SignIn;