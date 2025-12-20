import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react';

// Validation schemas
const emailSchema = z.string().trim().email('Invalid email address').max(255);
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(128);
const nameSchema = z.string().trim().max(100).optional();

type AuthMode = 'login' | 'register' | 'forgot-password' | 'magic-link';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, signInWithMagicLink, resetPassword, user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    if (mode === 'login' || mode === 'register') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      try {
        nameSchema.parse(fullName);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.fullName = e.errors[0].message;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let result;

      switch (mode) {
        case 'login':
          result = await signIn(email, password);
          if (result.error) {
            toast({
              title: t('common.error'),
              description: result.error.message,
              variant: 'destructive',
            });
          } else {
            navigate('/dashboard');
          }
          break;

        case 'register':
          result = await signUp(email, password, fullName);
          if (result.error) {
            // Handle specific errors
            if (result.error.message.includes('already registered')) {
              toast({
                title: t('common.error'),
                description: 'This email is already registered. Please login instead.',
                variant: 'destructive',
              });
            } else {
              toast({
                title: t('common.error'),
                description: result.error.message,
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: t('common.success'),
              description: 'Account created successfully! Redirecting...',
            });
            navigate('/dashboard');
          }
          break;

        case 'forgot-password':
          result = await resetPassword(email);
          if (result.error) {
            toast({
              title: t('common.error'),
              description: result.error.message,
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('common.success'),
              description: t('auth.resetLinkSent'),
            });
            setMode('login');
          }
          break;

        case 'magic-link':
          result = await signInWithMagicLink(email);
          if (result.error) {
            toast({
              title: t('common.error'),
              description: result.error.message,
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('common.success'),
              description: t('auth.magicLinkSent'),
            });
          }
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">R</span>
          </div>
          <span className="text-2xl font-bold text-foreground">RiadPrix</span>
        </Link>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              {t('hero.title')}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-md">
            {t('hero.subtitle')}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Powered with licensed AirDNA data
        </p>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-foreground">RiadPrix</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'login' && t('auth.login')}
              {mode === 'register' && t('auth.register')}
              {mode === 'forgot-password' && t('auth.resetPassword')}
              {mode === 'magic-link' && t('auth.magicLink')}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {(mode === 'login' || mode === 'register') && (
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="orange"
              size="lg"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' && t('auth.login')}
              {mode === 'register' && t('auth.register')}
              {mode === 'forgot-password' && t('auth.sendResetLink')}
              {mode === 'magic-link' && t('auth.magicLink')}
            </Button>
          </form>

          {/* Mode switchers */}
          <div className="space-y-4">
            {mode === 'login' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t('auth.orContinueWith')}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMode('magic-link')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {t('auth.magicLink')}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('auth.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-primary hover:underline font-medium"
                  >
                    {t('auth.register')}
                  </button>
                </p>
              </>
            )}

            {mode === 'register' && (
              <p className="text-center text-sm text-muted-foreground">
                {t('auth.haveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline font-medium"
                >
                  {t('auth.login')}
                </button>
              </p>
            )}

            {(mode === 'forgot-password' || mode === 'magic-link') && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex items-center justify-center w-full text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('auth.backToLogin')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
