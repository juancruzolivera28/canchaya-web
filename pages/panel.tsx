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

const RESERVAS_DEMO = [
  { id: '1', hora: '08:00', nombre: 'Martín García', pagado: true, tipo: 'reserva' },
  { id: '2', hora: '10:00', nombre: 'Equipo Los Pumas', pagado: true, tipo: 'reserva' },
  { id: '3', hora: '12:00', nombre: null, pagado: false, tipo: 'libre' },
  { id: '4', hora: '14:00', nombre: 'Mantenimiento', pagado: false, tipo: 'bloqueado' },
  { id: '5', hora: '16:00', nombre: 'Lucía Fernández', pagado: false, tipo: 'reserva' },
  { id: '6', hora: '18:00', nombre: 'Club Atlético', pagado: true, tipo: 'reserva' },
  { id: '7', hora: '20:00', nombre: null, pagado: false, tipo: 'libre' },
];

export default function Panel() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [cancha, setCancha] = useState<any>(null);
  const [diaActivo, setDiaActivo] = useState('2');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUsuario(session.user);
      const { data } = await supabase
        .from('canchas')
        .select('*')
        .eq('dueno_id', session.user.id)
        .single();
      setCancha(data);
      setCargando(false);
    });
  }, []);

  if (cargando) return (
    <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Cargando panel...</p>
    </div>
  );

  const reservasHoy = RESERVAS_DEMO.filter(r => r.tipo === 'reserva').length;
  const ingresosHoy = RESERVAS_DEMO.filter(r => r.tipo === 'reserva' && r.pagado).length * (cancha?.precio_por_hora || 8500);

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-100">

      <div style={{ backgroundColor: '#085041' }} className="px-4 pt-12 pb-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/70 text-xs">Buen día, dueño</p>
            <h1 className="text-white text-xl font-bold">{cancha?.nombre || 'Mi Cancha'}</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-white/80 text-xs px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            Ver app
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <p className="text-white/60 text-xs mb-1">Hoy</p>
            <p className="text-white text-xl font-bold">{reservasHoy}</p>
            <p className="text-white/50 text-xs">reservas</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <p className="text-white/60 text-xs mb-1">Este mes</p>
            <p className="text-white text-lg font-bold">$318k</p>
            <p className="text-green-300 text-xs">↑ 12%</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <p className="text-white/60 text-xs mb-1">Ocupación</p>
            <p className="text-white text-xl font-bold">78%</p>
            <p className="text-white/50 text-xs">promedio</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800">Agenda de hoy</h2>
          <button className="text-xs font-bold" style={{ color: '#1D9E75' }}>Ver semana →</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {DIAS.map(dia => (
            <button
              key={dia.id}
              onClick={() => setDiaActivo(dia.id)}
              className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-xs"
              style={{
                backgroundColor: diaActivo === dia.id ? '#085041' : 'white',
                borderColor: diaActivo === dia.id ? '#085041' : '#E0E0E0',
                color: diaActivo === dia.id ? 'white' : '#1A1A1A',
              }}
            >
              <span className="opacity-70">{dia.nombre}</span>
              <span className="font-bold text-sm">{dia.numero}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {RESERVAS_DEMO.map(r => (
            <div
              key={r.id}
              className="bg-white rounded-xl p-3 flex items-center gap-3"
              style={{
  opacity: r.tipo === 'libre' ? 0.6 : 1,
  border: r.tipo === 'libre' ? '1px dashed #E0E0E0' : 'none',
  borderLeft: r.tipo !== 'libre' ? `4px solid ${r.tipo === 'reserva' ? '#1D9E75' : '#888'}` : undefined,
}}
            >
              <span className="text-sm font-bold text-gray-500 w-12">{r.hora}</span>
              <div className="flex-1">
                {r.tipo === 'libre' ? (
                  <p className="text-sm text-gray-400">Horario libre</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-800">{r.nombre}</p>
                    <p className="text-xs text-gray-400">Fútbol 5 · 1 hora</p>
                  </>
                )}
              </div>
              {r.tipo === 'reserva' && (
                <span
                  className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: r.pagado ? '#E1F5EE' : '#FAEEDA',
                    color: r.pagado ? '#085041' : '#633806',
                  }}
                >
                  {r.pagado ? 'Pagado' : 'Pendiente'}
                </span>
              )}
              {r.tipo === 'bloqueado' && (
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-500">
                  Bloqueado
                </span>
              )}
              {r.tipo === 'libre' && (
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: '#1D9E75' }}>
                  + Agregar
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">Precios por turno</h2>
            <button className="text-xs font-bold" style={{ color: '#1D9E75' }}>Editar →</button>
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            {[
              { turno: 'Mañana (08:00 – 12:00)', precio: 7000 },
              { turno: 'Tarde (12:00 – 18:00)', precio: cancha?.precio_por_hora || 8500 },
              { turno: 'Noche (18:00 – 23:00)', precio: 10000 },
              { turno: 'Fin de semana', precio: 9500 },
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{p.turno}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">${p.precio.toLocaleString()}</span>
                  <button className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-500">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">Ingresos del mes</h2>
            <button className="text-xs font-bold" style={{ color: '#1D9E75' }}>Ver detalle →</button>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Cobrado online</p>
                <p className="text-lg font-bold text-gray-800">$214k</p>
                <p className="text-xs" style={{ color: '#1D9E75' }}>↑ 18%</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">En cancha</p>
                <p className="text-lg font-bold text-gray-800">$104k</p>
                <p className="text-xs text-gray-400">32 reservas</p>
              </div>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[35, 42, 28, 55].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${h}px`,
                      backgroundColor: i === 3 ? '#1D9E75' : '#9FE1CB',
                    }}
                  />
                  <span className="text-xs text-gray-400">S{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
