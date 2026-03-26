import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

const DIAS = [
  { id: '1', nombre: 'Sáb', numero: '22' },
  { id: '2', nombre: 'Hoy', numero: '23' },
  { id: '3', nombre: 'Lun', numero: '24' },
  { id: '4', nombre: 'Mar', numero: '25' },
  { id: '5', nombre: 'Mié', numero: '26' },
  { id: '6', nombre: 'Jue', numero: '27' },
];

export default function Panel() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [cancha, setCancha] = useState<any>(null);
  const [diaActivo, setDiaActivo] = useState('2');
  const [cargando, setCargando] = useState(true);
  const [reservas, setReservas] = useState<any[]>([]);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevaReserva, setNuevaReserva] = useState({ nombre: '', hora: '08:00', pagado: false });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUsuario(session.user);
      const { data: canchaData } = await supabase
        .from('canchas').select('*').eq('dueno_id', session.user.id).single();
      setCancha(canchaData);
      if (canchaData) {
        const { data: reservasData } = await supabase
          .from('reservas').select('*').eq('cancha_id', canchaData.id)
          .order('created_at', { ascending: false });
        setReservas(reservasData || []);
      }
      setCargando(false);
    });
  }, []);

  async function agregarReservaManual() {
    if (!nuevaReserva.nombre || !cancha) return;
    setGuardando(true);
    const { data, error } = await supabase.from('reservas').insert({
      cancha_id: cancha.id,
      nombre_jugador: nuevaReserva.nombre,
      pagado: nuevaReserva.pagado,
      horario_id: null,
    }).select().single();
    if (!error && data) {
      setReservas([data, ...reservas]);
      setMostrarAgregar(false);
      setNuevaReserva({ nombre: '', hora: '08:00', pagado: false });
    }
    setGuardando(false);
  }

  if (cargando) return (
    <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-3 animate-pulse" style={{ backgroundColor: '#0a6b52' }} />
        <p className="text-gray-400 text-sm">Cargando panel...</p>
      </div>
    </div>
  );

  const reservasHoy = reservas.length;
  const ingresosMes = reservas.filter(r => r.pagado).length * (cancha?.precio_por_hora || 8500);
  const pendientes = reservas.filter(r => !r.pagado).length;
  const nombre = usuario?.user_metadata?.nombre || usuario?.email?.split('@')[0] || 'Dueño';

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>

      <div style={{ backgroundColor: '#0a6b52', paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }} className="px-4 pb-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Buen día, {nombre} 👋</p>
            <h1 className="text-white text-xl font-bold">{cancha?.nombre || 'Mi Cancha'}</h1>
            <p className="text-xs mt-0.5" style={{ color: '#9FE1CB' }}>📍 {cancha?.direccion}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-white text-xs font-bold px-3 py-2 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            Ver app
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <p className="text-white text-2xl font-bold">{reservasHoy}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>reservas</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <p className="text-white text-lg font-bold">${ingresosMes > 0 ? (ingresosMes / 1000).toFixed(0) + 'k' : '0'}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>ingresos</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <p className="text-white text-2xl font-bold">{pendientes}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>pendientes</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 pb-10">

        {/* Agenda */}
        <div className="bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800 text-sm">Agenda</h2>
            <button
              onClick={() => setMostrarAgregar(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl text-white"
              style={{ backgroundColor: '#0a6b52' }}
            >
              + Agregar
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
            {DIAS.map(dia => (
              <button
                key={dia.id}
                onClick={() => setDiaActivo(dia.id)}
                className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor: diaActivo === dia.id ? '#0a6b52' : '#f5f5f5',
                  color: diaActivo === dia.id ? 'white' : '#666',
                }}
              >
                <span className="text-xs opacity-70">{dia.nombre}</span>
                <span className="text-sm font-bold">{dia.numero}</span>
              </button>
            ))}
          </div>

          {reservas.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-gray-400 text-sm">No hay reservas todavía</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {reservas.map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f9f9f9' }}>
                  <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: r.pagado ? '#0a6b52' : '#EF9F27' }} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{r.nombre_jugador}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(r.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} · Fútbol 5 · 1 hora
                    </p>
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
              ))}
            </div>
          )}
        </div>

        {/* Precios */}
        <div className="bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800 text-sm">Precios por turno</h2>
            <button className="text-xs font-bold" style={{ color: '#0a6b52' }}>Editar</button>
          </div>
          {[
            { turno: 'Mañana', horario: '08:00 – 12:00', precio: 7000 },
            { turno: 'Tarde', horario: '12:00 – 18:00', precio: cancha?.precio_por_hora || 8500 },
            { turno: 'Noche', horario: '18:00 – 23:00', precio: 10000 },
            { turno: 'Fin de semana', horario: 'Todo el día', precio: 9500 },
          ].map((p, i) => (
            <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-bold text-gray-700">{p.turno}</p>
                <p className="text-xs text-gray-400">{p.horario}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: '#0a6b52' }}>${p.precio.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Ingresos */}
        <div className="bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <h2 className="font-bold text-gray-800 text-sm mb-3">Ingresos del mes</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl p-3" style={{ backgroundColor: '#f0fdf8' }}>
              <p className="text-xs text-gray-500 mb-1">Cobrado</p>
              <p className="text-lg font-bold" style={{ color: '#0a6b52' }}>
                ${(reservas.filter(r => r.pagado).length * (cancha?.precio_por_hora || 8500)).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#fffbeb' }}>
              <p className="text-xs text-gray-500 mb-1">Pendiente</p>
              <p className="text-lg font-bold" style={{ color: '#92600A' }}>
                ${(reservas.filter(r => !r.pagado).length * (cancha?.precio_por_hora || 8500)).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[35, 42, 28, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg" style={{ height: `${h}px`, backgroundColor: i === 3 ? '#0a6b52' : '#D1FAE5' }} />
                <span className="text-xs text-gray-400">S{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info de la cancha */}
        <div className="bg-white rounded-2xl p-4 mb-8" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800 text-sm">Mi cancha</h2>
            <button className="text-xs font-bold" style={{ color: '#0a6b52' }}>Editar info</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              cancha?.tipo || 'Fútbol 5',
              cancha?.techada ? '🏠 Techada' : '☀️ Al aire libre',
              cancha?.iluminada ? '💡 Iluminada' : null,
            ].filter(Boolean).map(t => (
              <span key={t} className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">{t}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Modal agregar reserva */}
      {mostrarAgregar && (
        <div className="fixed inset-0 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-sm" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 className="font-bold text-gray-800 text-lg mb-4">Agregar reserva manual</h2>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Nombre del jugador</label>
              <input
                value={nuevaReserva.nombre}
                onChange={e => setNuevaReserva({ ...nuevaReserva, nombre: e.target.value })}
                placeholder="Ej: Martín García"
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 outline-none"
                style={{ border: '1.5px solid #e5e5e5' }}
              />
            </div>
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ backgroundColor: '#f5f5f5' }}>
              <input
                type="checkbox"
                id="pagado"
                checked={nuevaReserva.pagado}
                onChange={e => setNuevaReserva({ ...nuevaReserva, pagado: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="pagado" className="text-sm font-bold text-gray-700">Ya pagó en efectivo</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMostrarAgregar(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-gray-600"
                style={{ backgroundColor: '#f5f5f5' }}
              >
                Cancelar
              </button>
              <button
                onClick={agregarReservaManual}
                disabled={guardando || !nuevaReserva.nombre}
                className="flex-2 py-3.5 rounded-xl font-bold text-white text-sm"
                style={{ backgroundColor: '#0a6b52', flex: 2 }}
              >
                {guardando ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}