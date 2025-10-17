interface LogoProps {
    className?: string;
    size?: number;
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Círculo principal (azul) */}
            <circle cx="16" cy="16" r="14" fill="url(#gradient1)" />

            {/* Círculos menores interconectados (verde e laranja) */}
            <circle cx="12" cy="12" r="4" fill="url(#gradient2)" opacity="0.9" />
            <circle cx="20" cy="20" r="4" fill="url(#gradient3)" opacity="0.9" />
            <circle cx="20" cy="12" r="3" fill="url(#gradient2)" opacity="0.7" />
            <circle cx="12" cy="20" r="3" fill="url(#gradient3)" opacity="0.7" />

            {/* Linhas de conexão */}
            <line x1="12" y1="12" x2="20" y2="20" stroke="white" strokeWidth="1.5" opacity="0.6" />
            <line x1="20" y1="12" x2="12" y2="20" stroke="white" strokeWidth="1.5" opacity="0.6" />

            {/* Gradientes */}
            <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#fdba74" />
                </linearGradient>
            </defs>
        </svg>
    );
}