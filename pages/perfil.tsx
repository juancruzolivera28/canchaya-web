import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUsuario(session.user);
      setCargando(false);
    });
  }, []);

  const nombre = usuario?.user_metadata?.nombre || usuario?.email?.split('@')[0] || 'Usuario';
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <div className="max-w-sm mx-auto min-h-screen pb-24" style={{ backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: '#0a6b52', paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }} className="px-4 pb-8">
        <h1 className="text-white text-xl font-bold">Mi perfil</h1>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl p-5 mb-3 flex items-center gap-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#0a6b52' }}>
            {inicial}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{nombre}</p>
            <p className="text-sm text-gray-400">{usuario?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden mb-3" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          {[
            { label: 'Mis reservas', ruta: '/reservas', emoji: '📅' },
            { label: 'Panel del dueño', ruta: '/panel', emoji: '🏟️' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.ruta)}
              className="w-full flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0 active:bg-gray-50"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-bold text-gray-700 flex-1 text-left">{item.label}</span>
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>

        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ backgroundColor: 'white', color: '#E24B4A', border: '1.5px solid #FCA5A5', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
        >
          Cerrar sesión
        </button>
      </div>

      <NavBar activa="perfil" />
    </div>
  );
}
