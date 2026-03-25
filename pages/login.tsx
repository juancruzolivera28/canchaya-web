import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit() {
    setCargando(true);
    setError('');
    setMensaje('');

    if (modo === 'registro') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre } }
      });
      if (error) setError(error.message);
      else setMensaje('¡Cuenta creada! Revisá tu email para confirmar.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('Email o contraseña incorrectos');
      else router.push('/');
    }
    setCargando(false);
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ backgroundColor: '#f5f5f5' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0a6b52', paddingTop: 'calc(env(safe-area-inset-top) + 40px)' }} className="px-6 pb-10 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          ⚽
        </div>
        <h1 className="text-white text-3xl font-bold tracking-tight">CanchaYa</h1>
        <p className="text-sm mt-1" style={{ color: '#9FE1CB' }}>Reservá tu cancha en segundos</p>
      </div>

      {/* Card */}
      <div className="flex-1 px-4 -mt-5">
        <div className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setModo('login')}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: modo === 'login' ? 'white' : 'transparent',
                color: modo === 'login' ? '#0a6b52' : '#999',
                boxShadow: modo === 'login' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Ingresar
            </button>
            <button
              onClick={() => setModo('registro')}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: modo === 'registro' ? 'white' : 'transparent',
                color: modo === 'registro' ? '#0a6b52' : '#999',
                boxShadow: modo === 'registro' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Campos */}
          {modo === 'registro' && (
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Nombre completo</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Juan García"
                className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-900 bg-white outline-none transition-all"
                style={{ border: '1.5px solid #e5e5e5' }}
                onFocus={e => e.target.style.borderColor = '#0a6b52'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              type="email"
              className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-900 bg-white outline-none transition-all"
              style={{ border: '1.5px solid #e5e5e5' }}
              onFocus={e => e.target.style.borderColor = '#0a6b52'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Contraseña</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              type="password"
              className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-900 bg-white outline-none transition-all"
              style={{ border: '1.5px solid #e5e5e5' }}
              onFocus={e => e.target.style.borderColor = '#0a6b52'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>

          {error && (
            <div className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {mensaje && (
            <div className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC' }}>
              <p className="text-green-700 text-sm">{mensaje}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={cargando}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all"
            style={{ backgroundColor: cargando ? '#9FE1CB' : '#0a6b52' }}
          >
            {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar →' : 'Crear cuenta →'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 text-sm font-bold mt-3"
            style={{ color: '#999' }}
          >
            Continuar sin cuenta
          </button>

        </div>
      </div>

      <div className="pb-8" />
    </div>
  );
}
