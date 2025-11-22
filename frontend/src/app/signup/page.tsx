import AuthLayout from '@/components/layout/AuthLayout';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
    return (
        <AuthLayout title="Create your account">
            <SignupForm />
        </AuthLayout>
    );
}
