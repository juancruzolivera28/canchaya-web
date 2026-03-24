import { useState } from 'react';

const ZONAS = [
  { id: '1', nombre: 'Todas', canchas: 18 },
  { id: '2', nombre: 'Centro', canchas: 6 },
  { id: '3', nombre: 'Villa Cabello', canchas: 4 },
  { id: '4', nombre: 'Itaembé Miní', canchas: 3 },
  { id: '5', nombre: 'Miguel Lanús', canchas: 3 },
  { id: '6', nombre: 'Yaboty', canchas: 2 },
];

const CANCHAS = [
  { id: '1', nombre: 'Complejo El Potrillo', zona: 'Centro', rating: 4.8, label: 'Excelente', precio: 8500, tipo: 'Fútbol 5', techada: true },
  { id: '2', nombre: 'Canchas La Ribera', zona: 'Centro', rating: 4.5, label: 'Muy buena', precio: 7000, tipo: 'Fútbol 7', techada: false },
  { id: '3', nombre: 'Complejo Norte FC', zona: 'Villa Cabello', rating: 4.2, label: 'Buena', precio: 6000, tipo: 'Fútbol 5', techada: false },
  { id: '4', nombre: 'Sportiva Itaembé', zona: 'Itaembé Miní', rating: 4.9, label: 'Excelente', precio: 9000, tipo: 'Fútbol 5', techada: true },
];

export default function Home() {
  const [zonaActiva, setZonaActiva] = useState('1');
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<any>(null);

  const canchasFiltradas = zonaActiva === '1'
    ? CANCHAS
    : CANCHAS.filter(c => c.zona === ZONAS.find(z => z.id === zonaActiva)?.nombre);

  if (canchaSeleccionada) {
    return <DetalleCancha cancha={canchaSeleccionada} onVolver={() => setCanchaSeleccionada(null)} />;
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-100">
      {/* Header */}
      <div style={{ backgroundColor: '#085041' }} className="px-4 pt-12 pb-4">
        <h1 className="text-white text-2xl font-bold">CanchaYa</h1>
        <p style={{ color: '#9FE1CB' }} className="text-sm">Posadas, Misiones</p>
        <input
          className="w-full mt-3 px-4 py-3 rounded-xl text-sm text-white placeholder-white/60 outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          placeholder="Buscar cancha, barrio, zona..."
        />
      </div>

      {/* Banner */}
      <div className="mx-4 mt-4 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#E1F5EE' }}>
        <div>
          <p className="font-bold text-sm" style={{ color: '#085041' }}>Reserva este fin de semana</p>
          <p className="text-xs mt-0.5" style={{ color: '#1D9E75' }}>20% off en canchas seleccionadas</p>
        </div>
        <button className="text-white text-sm font-bold px-4 py-2 rounded-lg" style={{ backgroundColor: '#1D9E75' }}>
          Ver oferta
        </button>
      </div>

      {/* Zonas */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-gray-800 mb-3">Zonas de Posadas</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {ZONAS.map(zona => (
            <button
              key={zona.id}
              onClick={() => setZonaActiva(zona.id)}
              className="flex-shrink-0 px-4 py-2 rounded-xl border text-sm flex flex-col items-center"
              style={{
                backgroundColor: zonaActiva === zona.id ? '#085041' : 'white',
                borderColor: zonaActiva === zona.id ? '#085041' : '#E0E0E0',
                color: zonaActiva === zona.id ? 'white' : '#1A1A1A',
              }}
            >
              <span className="font-bold">{zona.nombre}</span>
              <span className="text-xs opacity-70">{zona.canchas} canchas</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canchas */}
      <div className="px-4 mt-4 pb-8">
        <h2 className="font-bold text-gray-800 mb-3">Canchas disponibles hoy</h2>
        {canchasFiltradas.map(cancha => (
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
                <span className="text-xs text-gray-500">{cancha.label}</span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#E1F5EE', color: '#085041' }}>
                  {cancha.tipo}
                </span>
                {cancha.techada && (
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#E1F5EE', color: '#085041' }}>
                    Techada
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">desde <span className="text-base font-bold text-gray-800">${cancha.precio.toLocaleString()}</span></p>
            </div>
          </div>
        ))}
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

  const diaObj = DIAS.find(d => d.id === diaActivo);
  const horarioObj = HORARIOS.find(h => h.id === horarioSel);

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
        <p className="text-sm text-gray-500 mt-1">📍 {cancha.zona} · Posadas</p>

        <div className="flex items-center gap-3 mt-4 pb-4 border-b border-gray-200">
          <span className="text-white font-bold text-lg px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1D9E75' }}>
            {cancha.rating}
          </span>
          <div className="flex-1">
            <p className="font-bold text-gray-800">{cancha.label}</p>
            <p className="text-xs text-gray-500">142 calificaciones</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">1 hora desde</p>
            <p className="text-xl font-bold text-gray-800">${cancha.precio.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-gray-200">
          {['⚽ Fútbol 5', '🏠 Techada', '💡 Iluminada', '🚿 Vestuario'].map(a => (
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
                backgroundColor: diaActivo === dia.id ? '#085041' : 'white',
                borderColor: diaActivo === dia.id ? '#085041' : '#E0E0E0',
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
              <p className="text-sm font-bold" style={{ color: horarioSel === h.id ? '#085041' : h.ocupado ? '#999' : '#1A1A1A' }}>
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
            <span className="text-sm text-gray-800">${cancha.precio.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 my-2" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold text-gray-800">${cancha.precio.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pb-8">
          <button className="flex-1 py-3.5 rounded-xl border border-gray-300 font-bold text-gray-800 text-sm">
            Sin pagar
          </button>
          <button className="flex-2 flex-1 py-3.5 rounded-xl font-bold text-white text-sm" style={{ backgroundColor: '#085041', flexGrow: 2 }}>
            Pagar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
