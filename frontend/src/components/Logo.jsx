export default function Logo({ className = "h-8 w-8" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#2563EB" />
      
      {/* AI Brain Icon */}
      <path 
        d="M50 25C38.954 25 30 33.954 30 45C30 50.523 32.386 55.523 36.25 59L36.25 65C36.25 66.381 37.369 67.5 38.75 67.5H61.25C62.631 67.5 63.75 66.381 63.75 65V59C67.614 55.523 70 50.523 70 45C70 33.954 61.046 25 50 25Z" 
        fill="white" 
        opacity="0.9"
      />
      
      {/* Neural Network Nodes */}
      <circle cx="42" cy="40" r="2.5" fill="#2563EB" />
      <circle cx="50" cy="38" r="2.5" fill="#2563EB" />
      <circle cx="58" cy="40" r="2.5" fill="#2563EB" />
      <circle cx="45" cy="48" r="2.5" fill="#2563EB" />
      <circle cx="55" cy="48" r="2.5" fill="#2563EB" />
      
      {/* Connection Lines */}
      <line x1="42" y1="40" x2="45" y2="48" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="50" y1="38" x2="45" y2="48" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="50" y1="38" x2="55" y2="48" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="58" y1="40" x2="55" y2="48" stroke="#2563EB" strokeWidth="1.5" />
      
      {/* Briefcase Bottom */}
      <rect x="40" y="60" width="20" height="8" rx="1" fill="#2563EB" />
      
      {/* Sparkle Effect */}
      <path 
        d="M72 30L73 33L76 34L73 35L72 38L71 35L68 34L71 33Z" 
        fill="#FCD34D" 
      />
      <path 
        d="M28 55L29 57L31 58L29 59L28 61L27 59L25 58L27 57Z" 
        fill="#FCD34D" 
      />
    </svg>
  )
}
