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
          backgroundColor: '#0F172A',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1E293B 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1E293B 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Main Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3B82F6' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3B82F6' }} />
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3B82F6' }} />
              </div>
            </div>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
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
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
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
              marginBottom: '48px',
              maxWidth: '800px',
            }}
          >
            Organize, test, and collaborate on prompts for ChatGPT, Claude & more
          </div>

          {/* Product UI Preview - Simulated Cards */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                width: '280px',
                height: '140px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                  Marketing Copy
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  Generate engaging social media posts...
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ✓ Used 247 times
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                width: '280px',
                height: '140px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                  Code Review
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  Analyze code quality and suggest...
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ✓ Used 189 times
              </div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                width: '280px',
                height: '140px',
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                  Customer Support
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  Respond to customer inquiries...
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ✓ Used 412 times
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
