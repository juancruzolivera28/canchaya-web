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
    <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col">
      <div style={{ backgroundColor: '#0a6b52' }} className="px-6 pt-16 pb-10 text-center">
        <h1 className="text-white text-3xl font-bold">CanchaYa</h1>
        <p style={{ color: '#9FE1CB' }} className="text-sm mt-1">Reservá tu cancha en segundos</p>
      </div>

      <div className="flex-1 px-6 pt-8">
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => setModo('login')}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{
              backgroundColor: modo === 'login' ? 'white' : 'transparent',
              color: modo === 'login' ? '#0a6b52' : '#666',
            }}
          >
            Ingresar
          </button>
          <button
            onClick={() => setModo('registro')}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{
              backgroundColor: modo === 'registro' ? 'white' : 'transparent',
              color: modo === 'registro' ? '#0a6b52' : '#666',
            }}
          >
            Registrarse
          </button>
        </div>

        {modo === 'registro' && (
          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Nombre completo</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Juan García"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 text-gray-900 bg-white"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            type="email"
           className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 text-gray-900 bg-white"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Contraseña</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            type="password"
           className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 text-gray-900 bg-white"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {mensaje && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-green-700 text-sm">{mensaje}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full py-4 rounded-xl font-bold text-white text-sm"
          style={{ backgroundColor: cargando ? '#9FE1CB' : '#0a6b52' }}
        >
          {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full py-4 text-sm font-bold mt-3"
          style={{ color: '#0a6b52' }}
        >
          Continuar sin cuenta →
        </button>
      </div>
    </div>
  );
}
