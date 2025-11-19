import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Prompt Manage - AI Prompt Management for Teams'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617', // slate-950
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1E293B 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1E293B 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '20%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '20%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Main Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            zIndex: 10,
          }}
        >
          {/* Logo & Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '40px',
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '16px 32px',
              borderRadius: '100px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Inlined Logo SVG */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" rx="4" fill="#3B82F6" />
              <rect y="18" width="16" height="16" rx="4" fill="#3B82F6" />
              <rect x="18" y="18" width="16" height="16" rx="4" fill="#3B82F6" />
              <path
                d="M24.6247 10.3333C24.5651 10.1026 24.4449 9.89207 24.2764 9.72359C24.1079 9.55511 23.8974 9.43485 23.6667 9.37533L19.5767 8.32067C19.5069 8.30086 19.4455 8.25883 19.4017 8.20096C19.358 8.14309 19.3343 8.07253 19.3343 8C19.3343 7.92746 19.358 7.85691 19.4017 7.79904C19.4455 7.74116 19.5069 7.69914 19.5767 7.67933L23.6667 6.624C23.8973 6.56454 24.1078 6.44438 24.2763 6.27602C24.4447 6.10767 24.565 5.89726 24.6247 5.66667L25.6793 1.57667C25.6989 1.50661 25.7409 1.44489 25.7989 1.40093C25.8568 1.35696 25.9276 1.33317 26.0003 1.33317C26.0731 1.33317 26.1438 1.35696 26.2018 1.40093C26.2597 1.44489 26.3017 1.50661 26.3213 1.57667L27.3753 5.66667C27.4348 5.89738 27.5551 6.10793 27.7236 6.27641C27.8921 6.44489 28.1026 6.56515 28.3333 6.62467L32.4233 7.67867C32.4937 7.69807 32.5557 7.74 32.5999 7.79805C32.6441 7.85609 32.668 7.92704 32.668 8C32.668 8.07296 32.6441 8.1439 32.5999 8.20195C32.5557 8.25999 32.4937 8.30193 32.4233 8.32133L28.3333 9.37533C28.1026 9.43485 27.8921 9.55511 27.7236 9.72359C27.5551 9.89207 27.4348 10.1026 27.3753 10.3333L26.3207 14.4233C26.301 14.4934 26.2591 14.5551 26.2011 14.5991C26.1431 14.643 26.0724 14.6668 25.9997 14.6668C25.9269 14.6668 25.8562 14.643 25.7982 14.5991C25.7402 14.5551 25.6983 14.4934 25.6787 14.4233L24.6247 10.3333Z"
                fill="#3B82F6"
                stroke="#3B82F6"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              Prompt Manage
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.1,
              marginBottom: '32px',
              maxWidth: '1000px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              background: 'linear-gradient(to bottom right, #ffffff 0%, #94a3b8 100%)',
              backgroundClip: 'text',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              color: 'transparent' as any,
            }}
          >
            AI Prompt Management for Teams
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: '32px',
              color: '#94A3B8',
              textAlign: 'center',
              marginBottom: '64px',
              maxWidth: '800px',
              lineHeight: 1.5,
            }}
          >
            Organize, test, and collaborate on prompts for ChatGPT, Claude & more.
          </div>

          {/* Footer / Business Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#64748B',
                fontWeight: 600,
              }}
            >
              promptmanage.com
            </div>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#475569',
              }}
            />
            <div
              style={{
                fontSize: '24px',
                color: '#64748B',
                fontWeight: 600,
              }}
            >
              Enterprise Ready
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
