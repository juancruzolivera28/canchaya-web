import { useRouter } from 'next/router';

export default function NavBar({ activa }: { activa: 'home' | 'reservas' | 'perfil' }) {
  const router = useRouter();

  const items = [
    {
      id: 'home',
      label: 'Inicio',
      icon: (active: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? '#0a6b52' : '#999'} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      ruta: '/',
    },
    {
      id: 'reservas',
      label: 'Mis reservas',
      icon: (active: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? '#0a6b52' : '#999'} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      ruta: '/reservas',
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: (active: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? '#0a6b52' : '#999'} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      ruta: '/perfil',
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center px-4 pt-3"
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
        maxWidth: '384px',
        margin: '0 auto',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {items.map(item => {
        const active = activa === item.id;
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.ruta)}
            className="flex flex-col items-center gap-1"
          >
            {item.icon(active)}
            <span className="text-xs font-bold" style={{ color: active ? '#0a6b52' : '#999' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
