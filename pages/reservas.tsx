import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';

export default function Reservas() {
  const router = useRouter();
  const [reservas, setReservas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUsuario(session.user);
      const { data } = await supabase
        .from('reservas')
        .select('*, canchas(nombre, zona, precio_por_hora)')
        .eq('nombre_jugador', session.user.user_metadata?.nombre || session.user.email)
        .order('created_at', { ascending: false });
      setReservas(data || []);
      setCargando(false);
    });
  }, []);

  return (
    <div className="max-w-sm mx-auto min-h-screen pb-24" style={{ backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: '#0a6b52', paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }} className="px-4 pb-5">
        <h1 className="text-white text-xl font-bold">Mis reservas</h1>
        <p className="text-xs mt-0.5" style={{ color: '#9FE1CB' }}>Historial de turnos reservados</p>
      </div>

      <div className="px-4 mt-4">
        {cargando ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : reservas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center mt-4">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-bold text-gray-700 mb-1">Sin reservas todavía</p>
            <p className="text-sm text-gray-400 mb-4">Reservá tu primera cancha y aparecerá acá</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ backgroundColor: '#0a6b52' }}
            >
              Buscar canchas
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reservas.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{r.canchas?.nombre || 'Cancha'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {r.canchas?.zona} · Posadas</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      backgroundColor: r.pagado ? '#E1F5EE' : '#FEF3CD',
                      color: r.pagado ? '#0a6b52' : '#92600A',
                    }}
                  >
                    {r.pagado ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-bold" style={{ color: '#0a6b52' }}>
                    ${r.canchas?.precio_por_hora?.toLocaleString()}/h
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NavBar activa="reservas" />
    </div>
  );
}
