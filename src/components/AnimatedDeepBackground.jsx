import './AnimatedDeepBackground.css';

export default function AnimatedDeepBackground({ photoUrl }) {
  return (
    <div className="deep-bg-wrapper">
      {/* Slowly panning photorealistic dark tech background */}
      <div 
        className="deep-bg-photo" 
        style={{ backgroundImage: `url(${photoUrl})` }}
      />
      
      {/* Deep blue/black premium fade to guarantee text readability in dark mode */}
      <div className="deep-bg-overlay" />
      
      {/* Moving Deep Color Orbs floating in the glass */}
      <div className="deep-orb deep-orb-blue"></div>
      <div className="deep-orb deep-orb-purple"></div>
      <div className="deep-orb deep-orb-cyan"></div>
      
      {/* Minimal Tech Grid Pattern overlaid */}
      <div className="deep-bg-grid"></div>
    </div>
  )
}
