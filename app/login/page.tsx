'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        // Safe redirect to relative internal returnUrl
        const target = returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';
        router.push(target);
        router.refresh();
      } else {
        setErrorMessage(data?.error || 'Invalid email or password. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--navy-primary)',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(23, 78, 166, 0.3) 0%, transparent 70%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Brand Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Image
              src="/images/noblecare4u-logo.webp"
              alt="Noblecare4u"
              width={160}
              height={36}
              priority
              style={{ objectFit: 'contain', height: 'auto' }}
            />
          </div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--navy-primary)',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Care Operations Portal
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '4px',
            }}
          >
            Authorized Administrator Access Only
          </p>
        </div>

        {/* Generic Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email-input"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
              }}
            >
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="email-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@noblecare4u.com"
                aria-invalid={Boolean(errorMessage)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Password Field with Show/Hide */}
          <div>
            <label
              htmlFor="password-input"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--navy-primary)',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                aria-invalid={Boolean(errorMessage)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'var(--care-blue)',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security Note Footer */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}
        >
          Protected session with server-side validation. Unauthorized access attempts are monitored.
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--navy-primary)',
            color: '#ffffff',
          }}
        >
          Loading portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
