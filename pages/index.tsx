import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Home( ) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUsuario(session?.user ?? null);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUsuario(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
  const [zonaActiva, setZonaActiva] = useState('Todas');
  const [canchas, setCanchas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<any>(null);

  useEffect(() => {
    cargarCanchas();
  }, []);

  async function cargarCanchas() {
    setCargando(true);
    const { data, error } = await supabase.from('canchas').select('*');
    if (data) setCanchas(data);
    setCargando(false);
  }

  const zonas = ['Todas', ...Array.from(new Set(canchas.map(c => c.zona)))];

  const canchasFiltradas = zonaActiva === 'Todas'
    ? canchas
    : canchas.filter(c => c.zona === zonaActiva);

  if (canchaSeleccionada) {
    return <DetalleCancha cancha={canchaSeleccionada} onVolver={() => setCanchaSeleccionada(null)} />;
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-100">
      <div style={{ backgroundColor: '#0a6b52', paddingTop: 'calc(env(safe-area-inset-top) + 48px)' }} className="px-4 pb-4">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-white text-2xl font-bold">CanchaYa</h1>
      <p style={{ color: '#9FE1CB' }} className="text-sm">Posadas, Misiones</p>
    </div>
    <div className="flex items-center gap-2">
      {usuario && (
        <button
          onClick={() => router.push('/panel')}
          className="text-white text-xs font-bold px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          Mi panel
        </button>
      )}
      {usuario ? (
        <button
          onClick={async () => { await supabase.auth.signOut(); }}
          className="text-white text-xs font-bold px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
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
  <input
    className="w-full mt-3 px-4 py-3 rounded-xl text-sm text-white placeholder-white/60 outline-none"
    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
    placeholder="Buscar cancha, barrio, zona..."
  />
</div>

      <div className="mx-4 mt-4 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#E1F5EE' }}>
        <div>
          <p className="font-bold text-sm" style={{ color: '#0a6b52' }}>Reserva este fin de semana</p>
          <p className="text-xs mt-0.5" style={{ color: '#1D9E75' }}>20% off en canchas seleccionadas</p>
        </div>
        <button className="text-white text-sm font-bold px-4 py-2 rounded-lg" style={{ backgroundColor: '#1D9E75' }}>
          Ver oferta
        </button>
      </div>

      <div className="px-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3">Zonas de Posadas</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {zonas.map(zona => (
            <button
              key={zona}
              onClick={() => setZonaActiva(zona)}
              className="flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-bold"
              style={{
                backgroundColor: zonaActiva === zona ? '#0a6b52' : 'white',
                borderColor: zonaActiva === zona ? '#0a6b52' : '#E0E0E0',
                color: zonaActiva === zona ? 'white' : '#1A1A1A',
              }}
            >
              {zona}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 pb-8">
        <h2 className="font-bold text-gray-800 mb-3">Canchas disponibles hoy</h2>
        {cargando ? (
          <div className="text-center py-12 text-gray-400">Cargando canchas...</div>
        ) : (
          canchasFiltradas.map(cancha => (
            <div
              key={cancha.id}
              onClick={() => setCanchaSeleccionada(cancha)}
              className="bg-white rounded-xl border border-gray-200 mb-3 overflow-hidden cursor-pointer active:opacity-80"
            >
              <div className="h-32 flex items-center justify-center text-6xl" style={{ backgroundColor: '#D9F0E6' }}>
                ⚽
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-800">{cancha.nombre}</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-2">{cancha.zona} · Posadas</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#1D9E75' }}>
                    {cancha.rating}
                  </span>
                  <span className="text-xs text-gray-500">{cancha.rating >= 4.8 ? 'Excelente' : cancha.rating >= 4.5 ? 'Muy buena' : 'Buena'}</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#E1F5EE', color: '#0a6b52' }}>
                    {cancha.tipo}
                  </span>
                  {cancha.techada && (
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#E1F5EE', color: '#0a6b52' }}>
                      Techada
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">desde <span className="text-base font-bold text-gray-800">${cancha.precio_por_hora.toLocaleString()}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6" style={{ backgroundColor: '#E1F5EE' }}>
          ✅
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva confirmada!</h1>
        <p className="text-gray-500 mb-8">Tu turno en {cancha.nombre} quedó reservado.</p>
        <button
          onClick={onVolver}
          className="w-full py-4 rounded-xl font-bold text-white"
          style={{ backgroundColor: '#0a6b52' }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white">
      <div className="h-48 flex items-center justify-center text-8xl relative" style={{ backgroundColor: '#D9F0E6' }}>
        ⚽
        <button
          onClick={onVolver}
          className="absolute top-4 left-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-lg font-bold"
        >
          ←
        </button>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">{cancha.nombre}</h1>
        <p className="text-sm text-gray-500 mt-1">📍 {cancha.direccion} · {cancha.zona}</p>

        <div className="flex items-center gap-3 mt-4 pb-4 border-b border-gray-200">
          <span className="text-white font-bold text-lg px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1D9E75' }}>
            {cancha.rating}
          </span>
          <div className="flex-1">
            <p className="font-bold text-gray-800">{cancha.rating >= 4.8 ? 'Excelente' : 'Muy buena'}</p>
            <p className="text-xs text-gray-500">142 calificaciones</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">1 hora desde</p>
            <p className="text-xl font-bold text-gray-800">${cancha.precio_por_hora.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-gray-200">
          {[`⚽ ${cancha.tipo}`, cancha.techada ? '🏠 Techada' : null, cancha.iluminada ? '💡 Iluminada' : null, '🚿 Vestuario'].filter(Boolean).map(a => (
            <span key={a} className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">{a}</span>
          ))}
        </div>

        <h2 className="font-bold text-gray-800 mt-4 mb-3">Elegí el día</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {DIAS.map(dia => (
            <button
              key={dia.id}
              onClick={() => setDiaActivo(dia.id)}
              className="flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border"
              style={{
                backgroundColor: diaActivo === dia.id ? '#0a6b52' : 'white',
                borderColor: diaActivo === dia.id ? '#0a6b52' : '#E0E0E0',
                color: diaActivo === dia.id ? 'white' : '#1A1A1A',
              }}
            >
              <span className="text-xs opacity-70">{dia.nombre}</span>
              <span className="text-base font-bold">{dia.numero}</span>
            </button>
          ))}
        </div>

        <h2 className="font-bold text-gray-800 mt-4 mb-3">Elegí el horario</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {HORARIOS.map(h => (
            <button
              key={h.id}
              onClick={() => { if (!h.ocupado) setHorarioSel(h.id); }}
              className="py-2.5 rounded-xl border text-center"
              style={{
                backgroundColor: horarioSel === h.id && !h.ocupado ? '#E1F5EE' : h.ocupado ? '#F5F5F5' : 'white',
                borderColor: horarioSel === h.id && !h.ocupado ? '#1D9E75' : '#E0E0E0',
                borderWidth: horarioSel === h.id && !h.ocupado ? 2 : 1,
                opacity: h.ocupado ? 0.5 : 1,
              }}
            >
              <p className="text-sm font-bold" style={{ color: horarioSel === h.id ? '#0a6b52' : h.ocupado ? '#999' : '#1A1A1A' }}>
                {h.hora}
              </p>
              <p className="text-xs text-gray-400">
                {h.ocupado ? 'Ocupado' : horarioSel === h.id ? 'Elegido' : 'Libre'}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Turno</span>
            <span className="text-sm text-gray-800">{diaObj?.nombre} {diaObj?.numero} · {horarioObj?.hora} hs</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">1 hora · {cancha.tipo}</span>
            <span className="text-sm text-gray-800">${cancha.precio_por_hora.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 my-2" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold text-gray-800">${cancha.precio_por_hora.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pb-8">
          <button
            onClick={() => hacerReserva(false)}
            disabled={guardando}
            className="flex-1 py-3.5 rounded-xl border border-gray-300 font-bold text-gray-800 text-sm"
          >
            {guardando ? 'Guardando...' : 'Sin pagar'}
          </button>
          <button
            onClick={() => hacerReserva(true)}
            disabled={guardando}
            className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm"
            style={{ backgroundColor: '#0a6b52', flexGrow: 2 }}
          >
            {guardando ? 'Guardando...' : 'Pagar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}