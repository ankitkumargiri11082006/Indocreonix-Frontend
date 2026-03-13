import AnimatedGoogleBackground from './AnimatedGoogleBackground'

const themePhotos = {
  // Home: Clean, modern white architectural / abstract tech
  'theme-home': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
  
  // Services: Professional white/light server or code infrastructure
  'theme-services': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80',
  
  // About: Modern, bright corporate office / team environment
  'theme-about': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80',
  
  // Contact: Connectivity, bright tech communication
  'theme-contact': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=2000&q=80',
  
  // Careers: Bright, optimistic workspace, growth
  'theme-careers': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',
  
  'default': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80'
}

function PageHero({ eyebrow, title, subtitle, actions, metrics = [], visual = null, theme = '' }) {
  const photoUrl = themePhotos[theme] || themePhotos['default'];

  return (
    <section className={`clean-hero-section ${theme}`}>
      <AnimatedGoogleBackground photoUrl={photoUrl} />
      <div className="container">
        <div className="clean-hero-grid">
          <div className="clean-hero-copy">
            {eyebrow && <p className="clean-hero-eyebrow">{eyebrow}</p>}
            <h1 className="clean-hero-title">{title}</h1>
            <p className="clean-hero-subtitle">{subtitle}</p>
            {actions && <div className="clean-hero-actions">{actions}</div>}
            
            {metrics.length > 0 && (
              <div className="clean-hero-metrics">
                {metrics.map((metric) => (
                  <article className="clean-metric-chip" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </article>
                ))}
              </div>
            )}
          </div>
          
          {visual && (
            <div className="clean-hero-visual">
              {visual}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PageHero
