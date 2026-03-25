// ─── YouTube Video Recommendations for Roadmap Skills ───
// Maps skill/step keywords to curated YouTube video recommendations

const VIDEO_RECOMMENDATIONS = {
  // ── Java ──
  'Java': [
    { title: 'Java Full Course for Beginners', url: 'https://www.youtube.com/watch?v=xk4_1vDrzzo', channel: 'Bro Code', duration: '12hr' },
    { title: 'Java Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', channel: 'Programming with Mosh', duration: '2.5hr' },
  ],
  'Learn Java': [
    { title: 'Java Full Course for Beginners', url: 'https://www.youtube.com/watch?v=xk4_1vDrzzo', channel: 'Bro Code', duration: '12hr' },
  ],

  // ── Spring Boot ──
  'Spring Boot': [
    { title: 'Spring Boot Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=9SGDpanrc8U', channel: 'Amigoscode', duration: '2hr' },
    { title: 'Spring Boot Full Course', url: 'https://www.youtube.com/watch?v=Nv2DERaMx-4', channel: 'Telusko', duration: '4hr' },
  ],
  'Learn Spring Core': [
    { title: 'Spring Framework Tutorial', url: 'https://www.youtube.com/watch?v=rMLP-NEPgnM', channel: 'Telusko', duration: '3hr' },
  ],
  'Understand Spring Boot basics': [
    { title: 'Spring Boot Quick Start', url: 'https://www.youtube.com/watch?v=9SGDpanrc8U', channel: 'Amigoscode', duration: '2hr' },
  ],
  'Build REST APIs': [
    { title: 'Build REST API with Spring Boot', url: 'https://www.youtube.com/watch?v=9SGDpanrc8U', channel: 'Amigoscode', duration: '2hr' },
    { title: 'REST API Concepts', url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk', channel: 'WebConcepts', duration: '8min' },
  ],

  // ── Hibernate & JPA ──
  'Hibernate': [
    { title: 'Hibernate Tutorial', url: 'https://www.youtube.com/watch?v=JR7-EdxDSf0', channel: 'Telusko', duration: '2.5hr' },
  ],
  'Learn ORM concepts': [
    { title: 'ORM Explained Simply', url: 'https://www.youtube.com/watch?v=dHQ-I7kr_SY', channel: 'Hussein Nasser', duration: '15min' },
  ],
  'Connect with database (JPA)': [
    { title: 'Spring Data JPA Tutorial', url: 'https://www.youtube.com/watch?v=8SGI_XS5OPw', channel: 'Daily Code Buffer', duration: '1hr' },
  ],

  // ── REST API ──
  'REST API': [
    { title: 'REST API Crash Course', url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk', channel: 'WebConcepts', duration: '8min' },
    { title: 'Build a REST API with Node.js', url: 'https://www.youtube.com/watch?v=fgTGADljAMk', channel: 'Web Dev Simplified', duration: '30min' },
  ],
  'Understand HTTP methods': [
    { title: 'HTTP Methods Explained', url: 'https://www.youtube.com/watch?v=tkfVQK6UxDI', channel: 'Web Dev Simplified', duration: '8min' },
  ],

  // ── React ──
  'React': [
    { title: 'React Full Course 2024', url: 'https://www.youtube.com/watch?v=CgkZ7MvWUAA', channel: 'freeCodeCamp', duration: '12hr' },
    { title: 'React JS Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=SqcY0GlETPk', channel: 'Programming with Mosh', duration: '1hr' },
  ],
  'Learn JavaScript basics': [
    { title: 'JavaScript Full Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', channel: 'freeCodeCamp', duration: '3.5hr' },
    { title: 'JavaScript in 100 Seconds', url: 'https://www.youtube.com/watch?v=DHjqpvDnNGE', channel: 'Fireship', duration: '2min' },
  ],
  'Understand React components': [
    { title: 'React Components Explained', url: 'https://www.youtube.com/watch?v=Y2hgEGPzTZY', channel: 'Web Dev Simplified', duration: '12min' },
  ],
  'State & Props': [
    { title: 'React State vs Props', url: 'https://www.youtube.com/watch?v=IYvD9oBCuJI', channel: 'Web Dev Simplified', duration: '10min' },
  ],

  // ── Node.js ──
  'Node.js': [
    { title: 'Node.js Full Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', channel: 'freeCodeCamp', duration: '8hr' },
    { title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', channel: 'Traversy Media', duration: '1.5hr' },
  ],
  'Understand Express': [
    { title: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', channel: 'Traversy Media', duration: '1hr' },
  ],

  // ── SQL & Databases ──
  'SQL': [
    { title: 'SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', channel: 'freeCodeCamp', duration: '4hr' },
    { title: 'MySQL Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', channel: 'Programming with Mosh', duration: '3hr' },
  ],
  'Learn basic queries': [
    { title: 'SQL Tutorial - Full Database Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', channel: 'freeCodeCamp', duration: '4hr' },
  ],
  'Joins & normalization': [
    { title: 'SQL Joins Explained', url: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw', channel: 'Web Dev Simplified', duration: '10min' },
  ],
  'MySQL': [
    { title: 'MySQL Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', channel: 'Programming with Mosh', duration: '3hr' },
  ],
  'Connect to database': [
    { title: 'Node.js MongoDB Tutorial', url: 'https://www.youtube.com/watch?v=fgTGADljAMk', channel: 'Web Dev Simplified', duration: '30min' },
  ],

  // ── Python ──
  'Python': [
    { title: 'Python Full Course', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', channel: 'Programming with Mosh', duration: '6hr' },
    { title: 'Python Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', channel: 'Programming with Mosh', duration: '1hr' },
  ],
  'Basics of Python': [
    { title: 'Python Full Course for Beginners', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', channel: 'Programming with Mosh', duration: '6hr' },
  ],
  'Libraries (Pandas, NumPy)': [
    { title: 'Pandas Tutorial', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', channel: 'Keith Galli', duration: '1hr' },
    { title: 'NumPy Tutorial', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', channel: 'freeCodeCamp', duration: '1hr' },
  ],

  // ── HTML/CSS ──
  'HTML': [
    { title: 'HTML Full Course', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', channel: 'freeCodeCamp', duration: '2hr' },
  ],
  'CSS': [
    { title: 'CSS Full Course', url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', channel: 'freeCodeCamp', duration: '6.5hr' },
  ],
  'JavaScript': [
    { title: 'JavaScript Full Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', channel: 'freeCodeCamp', duration: '3.5hr' },
    { title: 'Modern JavaScript Tutorial', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', channel: 'Programming with Mosh', duration: '1hr' },
  ],

  // ── DevOps ──
  'Docker': [
    { title: 'Docker Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', channel: 'freeCodeCamp', duration: '2hr' },
    { title: 'Docker in 100 Seconds', url: 'https://www.youtube.com/watch?v=Gjnup-PuquQ', channel: 'Fireship', duration: '2min' },
  ],
  'Kubernetes': [
    { title: 'Kubernetes Crash Course', url: 'https://www.youtube.com/watch?v=s_o8dwzRlu4', channel: 'TechWorld with Nana', duration: '1hr' },
  ],
  'Git': [
    { title: 'Git and GitHub for Beginners', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', channel: 'freeCodeCamp', duration: '1hr' },
  ],
  'AWS': [
    { title: 'AWS Certified Cloud Practitioner', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc', channel: 'freeCodeCamp', duration: '14hr' },
  ],
  'CI/CD': [
    { title: 'CI/CD Pipeline Tutorial', url: 'https://www.youtube.com/watch?v=scEDHsr3APg', channel: 'TechWorld with Nana', duration: '30min' },
  ],
  'Linux': [
    { title: 'Linux Full Course', url: 'https://www.youtube.com/watch?v=sWbUDq4S6Y8', channel: 'freeCodeCamp', duration: '5hr' },
  ],

  // ── Mobile Dev ──
  'Kotlin': [
    { title: 'Kotlin Full Course', url: 'https://www.youtube.com/watch?v=EExSSotojVI', channel: 'freeCodeCamp', duration: '2.5hr' },
  ],
  'Swift': [
    { title: 'Swift Programming Tutorial', url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q', channel: 'freeCodeCamp', duration: '3hr' },
  ],
  'React Native': [
    { title: 'React Native Tutorial', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', channel: 'Programming with Mosh', duration: '2hr' },
  ],
  'Flutter': [
    { title: 'Flutter Course for Beginners', url: 'https://www.youtube.com/watch?v=VPvVD8t02U8', channel: 'freeCodeCamp', duration: '37hr' },
  ],
  'Firebase': [
    { title: 'Firebase for Web', url: 'https://www.youtube.com/watch?v=q5J5ho7YUhA', channel: 'Fireship', duration: '12min' },
  ],

  // ── Advanced ──
  'Redux': [
    { title: 'Redux Toolkit Tutorial', url: 'https://www.youtube.com/watch?v=bbkBuqC1rU4', channel: 'Dave Gray', duration: '1hr' },
  ],
  'Tailwind CSS': [
    { title: 'Tailwind CSS Full Course', url: 'https://www.youtube.com/watch?v=ft30zcMlFao', channel: 'Dave Gray', duration: '3hr' },
  ],
  'MongoDB': [
    { title: 'MongoDB Crash Course', url: 'https://www.youtube.com/watch?v=-56x56UppqQ', channel: 'Web Dev Simplified', duration: '30min' },
  ],
  'Express': [
    { title: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', channel: 'Traversy Media', duration: '1hr' },
  ],
  'Microservices': [
    { title: 'Microservices Explained', url: 'https://www.youtube.com/watch?v=j1gU2oGFayY', channel: 'TechWorld with Nana', duration: '18min' },
  ],
  'Power BI': [
    { title: 'Power BI Full Course', url: 'https://www.youtube.com/watch?v=3u7MQz1EyPY', channel: 'Edureka', duration: '4hr' },
  ],
  'Statistics': [
    { title: 'Statistics Full Course', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28', channel: 'freeCodeCamp', duration: '8hr' },
  ],
  'Excel': [
    { title: 'Excel Full Course', url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', channel: 'freeCodeCamp', duration: '2.5hr' },
  ],

  // ── Generic fallbacks ──
  'Practice projects': [
    { title: '15 JavaScript Projects for Beginners', url: 'https://www.youtube.com/watch?v=3PHXvlpOkf4', channel: 'freeCodeCamp', duration: '8hr' },
  ],
  'Create mini project': [
    { title: 'Build Projects to Learn', url: 'https://www.youtube.com/watch?v=3PHXvlpOkf4', channel: 'freeCodeCamp', duration: '8hr' },
  ],
  'Mini projects': [
    { title: 'Python Projects for Beginners', url: 'https://www.youtube.com/watch?v=8ext9G7xspg', channel: 'freeCodeCamp', duration: '3hr' },
  ],
  'Build small apps': [
    { title: 'React Projects for Beginners', url: 'https://www.youtube.com/watch?v=a_7Z7C_JCyo', channel: 'freeCodeCamp', duration: '8hr' },
  ],
};

// Helper: find videos for a given step description
export function getVideosForStep(stepTitle, stepDescription) {
  const allVideos = [];
  const searchText = `${stepTitle} ${stepDescription}`.toLowerCase();
  
  for (const [keyword, videos] of Object.entries(VIDEO_RECOMMENDATIONS)) {
    if (searchText.includes(keyword.toLowerCase())) {
      videos.forEach(v => {
        if (!allVideos.find(existing => existing.url === v.url)) {
          allVideos.push(v);
        }
      });
    }
  }
  
  // Limit to 3 videos max per step
  return allVideos.slice(0, 3);
}

export default VIDEO_RECOMMENDATIONS;
