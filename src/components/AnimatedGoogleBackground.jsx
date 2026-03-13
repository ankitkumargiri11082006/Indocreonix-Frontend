import './AnimatedGoogleBackground.css';

export default function AnimatedGoogleBackground({ photoUrl }) {
  return (
    <div className="google-bg-wrapper">
      {/* Slowly panning photorealistic white architectural background */}
      <div 
        className="google-bg-photo" 
        style={{ backgroundImage: `url(${photoUrl})` }}
      />
      
      {/* Soft white premium fade to guarantee text readability */}
      <div className="google-bg-overlay" />
      
      {/* Moving Google Color Orbs floating in the glass */}
      <div className="google-orb orb-blue"></div>
      <div className="google-orb orb-red"></div>
      <div className="google-orb orb-yellow"></div>
      <div className="google-orb orb-green"></div>
      
      {/* Minimal Tech Grid Pattern overlaid */}
      <div className="google-bg-grid"></div>
    </div>
  )
}
