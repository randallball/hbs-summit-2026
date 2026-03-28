import Link from 'next/link'

export default function Header() {
  return (
    <header
      style={{
        background: 'linear-gradient(180deg, #fffef8 0%, #ffffff 100%)',
        borderBottom: '2px solid var(--crimson)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        textAlign: 'center',
      }}
    >
      {/* Logos row: HBS Summit + Greenberg Traurig */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 4,
          flexWrap: 'wrap',
        }}
      >
        <img
          src="/logo.png"
          alt="HBS"
          width={72}
          height={72}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            objectFit: 'contain',
          }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
          }}
        />

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 40,
            background: '#e0d8c8',
          }}
        />

        {/* Greenberg Traurig sponsor lockup */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span
            style={{
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#888',
            }}
          >
            Sponsored by
          </span>
          <img
            src="/sponsors/greenberg-traurig-black.png"
            alt="Greenberg Traurig"
            style={{
              height: 28,
              width: 'auto',
              objectFit: 'contain',
            }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      </div>

      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--crimson)',
          margin: 0,
        }}
      >
        Harvard Business School
      </p>

      <h1
        className="playfair"
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--charcoal)',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        Entrepreneurship Summit 2026
      </h1>

      <p
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          margin: 0,
        }}
      >
        March 29 &middot; 30+ Founders &middot; $5B+ Raised
      </p>

      <Link
        href="https://HBSentrepreneurshipsummit.eventbrite.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 4,
          display: 'inline-block',
          padding: '8px 18px',
          background: 'var(--crimson)',
          color: 'white',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        Get Tickets &rarr;
      </Link>
    </header>
  )
}
