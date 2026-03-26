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

const HORARIOS = [
  { id: '1', hora: '08:00', ocupado: true },
  { id: '2', hora: '09:00', ocupado: true },
  { id: '3', hora: '10:00', ocupado: false },
  { id: '4', hora: '11:00', ocupado: true },
  { id: '5', hora: '12:00', ocupado: false },
  { id: '6', hora: '13:00', ocupado: false },
  { id: '7', hora: '14:00', ocupado: true },
  { id: '8', hora: '15:00', ocupado: true },
  { id: '9', hora: '16:00', ocupado: false },
  { id: '10', hora: '17:00', ocupado: false },
  { id: '11', hora: '18:00', ocupado: false },
  { id: '12', hora: '19:00', ocupado: true },
  { id: '13', hora: '20:00', ocupado: false },
  { id: '14', hora: '21:00', ocupado: false },
  { id: '15', hora: '22:00', ocupado: true },
];

export default function Home() {
  const router = useRouter();
  const [zonaActiva, setZonaActiva] = useState('Todas');
  const [canchas, setCanchas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<any>(null);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });
    cargarCanchas();
    return () => subscription.unsubscribe();
  }, []);

  async function cargarCanchas() {
    setCargando(true);
    const { data } = await supabase.from('canchas').select('*').order('rating', { ascending: false });
    if (data) setCanchas(data);
    setCargando(false);
  }

  const zonas = ['Todas', ...Array.from(new Set(canchas.map(c => c.zona)))];
  const [busqueda, setBusqueda] = useState('');

const canchasFiltradas = canchas.filter(c => {
  const matchZona = zonaActiva === 'Todas' || c.zona === zonaActiva;
  const matchBusqueda = busqueda === '' || 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.zona.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.direccion?.toLowerCase().includes(busqueda.toLowerCase());
  return matchZona && matchBusqueda;
});

  if (canchaSeleccionada) {
    return <DetalleCancha cancha={canchaSeleccionada} onVolver={() => setCanchaSeleccionada(null)} />;
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0a6b52', paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }} className="px-4 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">CanchaYa</h1>
            <p className="text-xs mt-0.5" style={{ color: '#9FE1CB' }}>Posadas, Misiones</p>
          </div>
          <div className="flex items-center gap-2">
            {usuario && (
              <button
                onClick={() => router.push('/panel')}
                className="text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                Mi panel
              </button>
            )}
            {usuario ? (
              <button
                onClick={async () => { await supabase.auth.signOut(); }}
                className="text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                Salir
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="text-white text-sm font-bold px-4 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">🔍</span>
          <input
            className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm text-white placeholder-white/50 outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            value={busqueda}
onChange={e => setBusqueda(e.target.value)}
placeholder="Buscar cancha, barrio, zona..."
          />
        </div>
      </div>

      {/* Banner promo */}
      <div className="mx-4 mt-4 p-4 rounded-2xl flex items-center justify-between" style={{ backgroundColor: '#E1F5EE' }}>
        <div>
          <p className="font-bold text-sm" style={{ color: '#0a6b52' }}>Reserva este fin de semana</p>
          <p className="text-xs mt-0.5" style={{ color: '#1D9E75' }}>20% off en canchas seleccionadas</p>
        </div>
        <button className="text-white text-xs font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: '#0a6b52' }}>
          Ver oferta
        </button>
      </div>

      {/* Zonas */}
      <div className="px-4 mt-5">
        <h2 className="font-bold text-gray-800 mb-3 text-base">Zonas de Posadas</h2>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {zonas.map(zona => (
            <button
              key={zona}
              onClick={() => setZonaActiva(zona)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: zonaActiva === zona ? '#0a6b52' : 'white',
                color: zonaActiva === zona ? 'white' : '#555',
                border: zonaActiva === zona ? 'none' : '1px solid #e5e5e5',
                boxShadow: zonaActiva === zona ? '0 2px 8px rgba(10,107,82,0.3)' : 'none',
              }}
            >
              {zona}
            </button>
          ))}
        </div>
      </div>

      {/* Canchas */}
      <div className="px-4 mt-5 pb-10">
        <h2 className="font-bold text-gray-800 mb-3 text-base">Canchas disponibles hoy</h2>
        {cargando ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : canchasFiltradas.map(cancha => (
          <div
            key={cancha.id}
            onClick={() => setCanchaSeleccionada(cancha)}
            className="bg-white rounded-2xl mb-3 overflow-hidden cursor-pointer active:scale-98 transition-transform"
            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="h-36 flex items-center justify-center text-6xl relative" style={{ backgroundColor: '#D9F0E6' }}>
              ⚽
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: '#0a6b52' }}>
                ${cancha.precio_por_hora.toLocaleString()}/h
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-gray-800 text-base">{cancha.nombre}</p>
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs font-bold text-gray-700">{cancha.rating}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">📍 {cancha.zona} · Posadas</p>
              <div className="flex gap-2">
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#E1F5EE', color: '#0a6b52' }}>
                  {cancha.tipo}
                </span>
                {cancha.techada && (
                  <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#E1F5EE', color: '#0a6b52' }}>
                    Techada
                  </span>
                )}
                {cancha.iluminada && (
                  <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#E1F5EE', color: '#0a6b52' }}>
                    Iluminada
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function DetalleCancha({ cancha, onVolver }: { cancha: any; onVolver: () => void }) {
  const [diaActivo, setDiaActivo] = useState('2');
  const [horarioSel, setHorarioSel] = useState('9');
  const [guardando, setGuardando] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);

  const diaObj = DIAS.find(d => d.id === diaActivo);
  const horarioObj = HORARIOS.find(h => h.id === horarioSel);

  async function hacerReserva(pagar: boolean) {
    setGuardando(true);
    const { data: sesion } = await supabase.auth.getSession();
    const nombreJugador = sesion?.session?.user?.user_metadata?.nombre ||
                          sesion?.session?.user?.email ||
                          'Jugador';
    const { error } = await supabase.from('reservas').insert({
      cancha_id: cancha.id,
      nombre_jugador: nombreJugador,
      pagado: pagar,
      horario_id: null,
    });
    if (!error) setReservaExitosa(true);
    setGuardando(false);
  }

  if (reservaExitosa) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6" style={{ backgroundColor: '#E1F5EE' }}>
          ✅
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva confirmada!</h1>
        <p className="text-gray-400 mb-8 text-sm">Tu turno en <span className="font-bold text-gray-600">{cancha.nombre}</span> quedó reservado.</p>
        <button
          onClick={onVolver}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm"
          style={{ backgroundColor: '#0a6b52' }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>

      {/* Hero */}
      <div className="relative h-52 flex items-center justify-center text-8xl" style={{ backgroundColor: '#D9F0E6' }}>
        ⚽
        <button
          onClick={onVolver}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm"
        >
          ←
        </button>
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: '#0a6b52' }}>
          desde ${cancha.precio_por_hora.toLocaleString()}/h
        </div>
      </div>

      {/* Info */}
      <div className="bg-white px-4 pt-4 pb-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{cancha.nombre}</h1>
            <p className="text-xs text-gray-400 mt-1">📍 {cancha.direccion} · {cancha.zona}</p>
          </div>
          <div className="flex items-center gap-1 ml-3 bg-yellow-50 px-2 py-1 rounded-xl">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-bold text-gray-700">{cancha.rating}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {[`⚽ ${cancha.tipo}`, cancha.techada ? '🏠 Techada' : null, cancha.iluminada ? '💡 Iluminada' : null, '🚿 Vestuario'].filter(Boolean).map(a => (
            <span key={a} className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">{a}</span>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3">

        {/* Días */}
        <div className="bg-white rounded-2xl p-4 mb-3">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">Elegí el día</h2>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {DIAS.map(dia => (
              <button
                key={dia.id}
                onClick={() => setDiaActivo(dia.id)}
                className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor: diaActivo === dia.id ? '#0a6b52' : '#f5f5f5',
                  color: diaActivo === dia.id ? 'white' : '#555',
                }}
              >
                <span className="text-xs opacity-70">{dia.nombre}</span>
                <span className="text-base font-bold">{dia.numero}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-white rounded-2xl p-4 mb-3">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">Elegí el horario</h2>
          <div className="grid grid-cols-3 gap-2">
            {HORARIOS.map(h => (
              <button
                key={h.id}
                onClick={() => { if (!h.ocupado) setHorarioSel(h.id); }}
                className="py-2.5 rounded-xl text-center transition-all"
                style={{
                  backgroundColor: horarioSel === h.id && !h.ocupado ? '#0a6b52' : h.ocupado ? '#f5f5f5' : '#f9f9f9',
                  opacity: h.ocupado ? 0.4 : 1,
                  border: horarioSel === h.id && !h.ocupado ? 'none' : '1px solid #eee',
                }}
              >
                <p className="text-sm font-bold" style={{ color: horarioSel === h.id && !h.ocupado ? 'white' : h.ocupado ? '#aaa' : '#333' }}>
                  {h.hora}
                </p>
                <p className="text-xs" style={{ color: horarioSel === h.id && !h.ocupado ? 'rgba(255,255,255,0.8)' : '#aaa' }}>
                  {h.ocupado ? 'Ocupado' : horarioSel === h.id ? 'Elegido' : 'Libre'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Turno</span>
            <span className="text-sm font-bold text-gray-700">{diaObj?.nombre} {diaObj?.numero} · {horarioObj?.hora} hs</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-400">1 hora · {cancha.tipo}</span>
            <span className="text-sm text-gray-700">${cancha.precio_por_hora.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-100 mb-3" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold" style={{ color: '#0a6b52' }}>${cancha.precio_por_hora.toLocaleString()}</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pb-10">
          <button
            onClick={() => hacerReserva(false)}
            disabled={guardando}
            className="flex-1 py-4 rounded-2xl font-bold text-sm"
            style={{ backgroundColor: 'white', color: '#0a6b52', border: '2px solid #0a6b52' }}
          >
            {guardando ? 'Guardando...' : 'Sin pagar'}
          </button>
          <button
            onClick={() => hacerReserva(true)}
            disabled={guardando}
            className="font-bold text-white text-sm py-4 rounded-2xl"
            style={{ backgroundColor: '#0a6b52', flex: 2 }}
          >
            {guardando ? 'Guardando...' : 'Pagar ahora →'}
          </button>
        </div>

      </div>
    </div>
  );
}
