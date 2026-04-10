'use client';

import * as React from 'react';
import { Loader2, Mail, Lock, LogIn, BookOpen, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function LoginForm({ onLoginSuccess, onDemoMode }: { onLoginSuccess: (session: any) => void, onDemoMode: () => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'login' | 'signup' | 'forgot'>('login');
  const [message, setMessage] = React.useState<string | null>(null);
  const [logoError, setLogoError] = React.useState(false);
  const [churchLogo, setChurchLogo] = React.useState('/logo.png');
  const [churchName, setChurchName] = React.useState('EBD Digital');

  React.useEffect(() => {
    const savedLogo = localStorage.getItem('ebd_church_logo');
    if (savedLogo) setChurchLogo(savedLogo);
    const savedName = localStorage.getItem('ebd_church_name');
    if (savedName) setChurchName(savedName);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onLoginSuccess(data.session);
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setMessage('Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.');
      // Automatically switch to login or show success
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const redirectUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    onDemoMode();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto size-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-4 overflow-hidden shadow-xl shadow-primary/10 border border-slate-100 dark:border-slate-800 relative">
            {!logoError ? (
              <Image 
                src={churchLogo} 
                alt="Logo" 
                fill
                className="object-contain p-3" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <BookOpen className="size-12 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{churchName}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {view === 'login' ? 'Entre para gerenciar sua escola bíblica' : 
             view === 'signup' ? 'Crie sua conta para começar' : 'Recupere sua senha'}
          </p>
        </div>

        {view === 'login' || view === 'signup' ? (
          <form onSubmit={view === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Senha</label>
                {view === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[10px] font-bold text-primary uppercase hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            {message && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium text-primary text-center"
              >
                {message}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <LogIn className="size-5" />}
              {view === 'login' ? 'Entrar no Sistema' : 'Criar minha Conta'}
            </button>

            {view === 'login' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="w-full py-4 text-sm font-bold text-primary uppercase hover:bg-primary/10 rounded-xl transition-all border-2 border-primary/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <UserPlus className="size-5" />
                  NÃO TEM CONTA AINDA? - CADASTRE-SE
                </button>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail de Recuperação</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            {message && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium text-primary text-center"
              >
                {message}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Mail className="size-5" />}
              Enviar E-mail de Recuperação
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-xs font-bold text-slate-500 uppercase hover:text-primary transition-colors"
            >
              Voltar para o Login
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          {view !== 'login' && (
            <button
              type="button"
              onClick={() => setView('login')}
              className="text-sm font-bold text-primary uppercase hover:underline tracking-tight"
            >
              Já tem uma conta? Faça Login
            </button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#f6f8f7] dark:bg-[#102219] px-2 text-slate-500">Ou continue com</span>
          </div>
        </div>

        <button
          onClick={handleDemoAccess}
          className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Acessar modo Demonstração
        </button>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
          © 2026 EBD Digital • Gestão Inteligente
        </p>
      </motion.div>
    </div>
  );
}
