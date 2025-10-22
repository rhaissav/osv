interface LogoProps {
    className?: string;
    size?: number;
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="9.1429" cy="16.0000" r="9.1429" fill="#F47B20" />
            <circle cx="22.8571" cy="16.0000" r="9.1429" fill="#207CF4" />
            <path d="M16 9.9516 A9.1429 9.1429 0 0 0 16 22.0484 A9.1429 9.1429 0 0 0 16 9.9516Z" fill="#3CB371" />
        </svg>
    );
}

