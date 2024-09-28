// File: app/auth/signin/page.tsx
import SignInForm from '@/components/SignInForm'; // Import the SignIn component

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <SignInForm />
    </div>
  );
}
