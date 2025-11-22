import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout title="Sign in to FlowOS">
            <LoginForm />
        </AuthLayout>
    );
}
