import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <ClerkSignUp />
    </main>
  );
};

export default SignUp;

