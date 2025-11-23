// Translations object containing all text content in both languages
const translations = {
  en: {
    // Header & About
    "whoami": "whoami",
    "developer_title": "Junior Full-Stack Developer",
    "about_text": "Motivated and curious junior developer, passionate about continuous learning and solving complex problems. Specialized in Electronics, Computer Systems and Artificial Intelligence, I strive for excellence in all my projects.",
    "contact_sh": "./contact.sh",
    
    // Navigation
    "nav_about": "About",
    "nav_skills": "Skills",
    "nav_projects": "Projects",
    "nav_experience": "Experience",
    "nav_contact": "Contact",
    
    // Skills section
    "skills_cmd": "ls skills/",
    "skills_title": "Technical Skills",
    "skills_languages": "Programming Languages",
    "skills_frameworks": "Frameworks",
    "skills_databases": "Databases",
    "skills_tools": "Tools & Technologies",
    
    // Projects section
    "projects_cmd": "cd projects/ && ls -l",
    "projects_title": "Projects",
    "project_type_professional": "Professional Project",
    "project_type_academic": "Academic",
    "project_type_personal": "Personal",
    "view_source": "Source code",
    "view_demo": "View demo",
    
    // Gym app project
    "gym_app_title": "Web Application for Gym Referencing in Antananarivo",
    "gym_app_desc": "Created a web application to centralize gyms in Antananarivo, allowing users to find, compare and book gyms. Complete development with Next.js for the front-end and Laravel for the back-end, connected to a MySQL database.",
    
    // Garden project
    "garden_title": "Garden - Final Year Project",
    "garden_desc": "Design of an autonomous greenhouse with real-time monitoring via a mobile application. Responsible for the complete design and implementation of the application.",
    
    // Taktak project
    "taktak_title": "Taktak",
    "taktak_desc": "Taktak is an innovative application allowing users to exchange objects easily. Whether for a trade or a temporary exchange, Taktak facilitates connection between users for simple and efficient transactions.",
    
    // BluetoothDrone project
    "drone_title": "BluetoothDrone",
    "drone_desc": "Control interface for a drone via Bluetooth. Application developed to control embedded systems remotely.",
    
    // Leven project
    "leven_title": "Leven",
    "leven_desc": "Leven is a personal spell checker project in development, using Java Swing for the user interface. Though still being perfected, Leven aims to offer word suggestions to improve the quality of your texts.",
    
    // Experience section
    "exp_cmd": "cat experience.txt",
    "exp_title": "Professional Experience",
    "exp_etech_dev": "Full-Stack Developer - Internship",
    "exp_etech_desc": "Internship in Full-Stack development at a technology company. Participation in the development of modern web applications and practical application of advanced technologies.",
    "exp_frontend_dev": "Full-Stack Developer - CDI",
    "exp_fullstack_dev": "Full-Stack Developer - Fixed-term Contract",
    "exp_luminia_desc": "Participation in the frontend implementation of the company's website. Implementation of responsive interfaces and optimization of user experience.",
    "exp_haona_desc": "Contribution to the development of a mobile application for raising awareness among women about climate change in the Haute Matsiatra region. Frontend and backend development with Vue.js for KaiOS devices.",
    "exp_competitions": "Competitions",
    "exp_place": "place",
    "exp_a_project": "A 48h project for each weekend",
    
    // Dates
    "date_etech": "May 2024 - August 2024",
    "date_luminia": "November 2024 - November 2025",
    "date_haona": "January - April 2024",
    
    // Education dates
    "date_php_training": "May 2025",
    "date_licence": "2021 - 2025",
    
    // Education section
    "edu_cmd": "cat formation.txt",
    "edu_title": "Education",
    "edu_php_title": "Advanced PHP Training",
    "edu_php_desc": "Intensive training in PHP development with the Symfony framework. Learning best practices, MVC architecture, security and performance of web applications.",
    "edu_php_skills": "Skills acquired:",
    "edu_php_skill1": "Web application development with Symfony",
    "edu_php_skill2": "RESTful API design",
    "edu_php_skill3": "Performance optimization",
    "edu_php_skill4": "Web application security",
    "edu_php_skill5": "Unit and functional testing",
    "edu_licence_title": "Bachelor in Computer Science and Telecommunications",
    "edu_licence_desc": "Complete computer science training with specialization in software development and intelligent systems. Acquisition of skills in programming, databases and artificial intelligence.",
    
    // Certifications
    "cert_cmd": "ls certifications/",
    "cert_title": "Certifications",
    "view_on_accredible": "View on Accredible",
    
    // Contact form
    "contact_title": "Contact Me",
    "name_label": "Name",
    "email_label": "Email",
    "subject_label": "Subject",
    "message_label": "Message",
    "send_button": "Send",
    
    // Footer
    "footer_tagline": "Junior Full-Stack Developer<br>Passionate about creating innovative solutions",
    "footer_copyright": "© 2025 RAJAOHARIVONY Haritody Tonny Raldo. All rights reserved.",
    
    // Modal
    "close_cert": "Close certificate",
    "loading": "Loading...",
    "loading_in_progress": "Loading in progress...",
    "loading_error": "Loading error",
    "image_unavailable": "Image unavailable"
  },
  fr: {
    // Header & About
    "whoami": "whoami",
    "developer_title": "Développeur Full-Stack Junior",
    "about_text": "Développeur junior motivé et curieux, passionné par l'apprentissage continu et la résolution de problèmes complexes. Spécialisé en Électronique, Système Informatique et Intelligence Artificielle, je m'efforce d'atteindre l'excellence dans tous mes projets.",
    "contact_sh": "./contact.sh",
    
    // Navigation
    "nav_about": "À propos",
    "nav_skills": "Compétences",
    "nav_projects": "Projets",
    "nav_experience": "Expérience",
    "nav_contact": "Contact",
    
    // Skills section
    "skills_cmd": "ls skills/",
    "skills_title": "Compétences Techniques",
    "skills_languages": "Langages de programmation",
    "skills_frameworks": "Frameworks",
    "skills_databases": "Base de données",
    "skills_tools": "Outils & Technologies",
    
    // Projects section
    "projects_cmd": "cd projects/ && ls -l",
    "projects_title": "Projets",
    "project_type_professional": "Projet Professionnel",
    "project_type_academic": "Académique",
    "project_type_personal": "Personnel",
    "view_source": "Code source",
    "view_demo": "Voir la démo",
    
    // Gym app project
    "gym_app_title": "Application Web de Référencement des Salles de Sport à Antananarivo",
    "gym_app_desc": "Création d'une application web pour centraliser les salles de sport à Antananarivo, permettant aux utilisateurs de trouver, comparer et réserver des salles de sport. Développement complet avec Next.js pour le front-end et Laravel pour le back-end, connecté à une base de données MySQL.",
    
    // Garden project
    "garden_title": "Garden - Projet de fin d'études",
    "garden_desc": "Conception d'une serre autonome avec suivi en temps réel via une application mobile. Responsable de la conception et réalisation complète de l'application.",
    
    // Taktak project
    "taktak_title": "Taktak",
    "taktak_desc": "Taktak est une application innovante permettant aux utilisateurs d'échanger des objets facilement. Que ce soit pour un troc ou un échange temporaire, Taktak facilite la mise en relation entre les utilisateurs pour des transactions simples et efficaces.",
    
    // BluetoothDrone project
    "drone_title": "BluetoothDrone",
    "drone_desc": "Interface de commande d'un drone via Bluetooth. Application développée pour contrôler des systèmes embarqués à distance.",
    
    // Leven project
    "leven_title": "Leven",
    "leven_desc": "Leven est un projet personnel de correcteur orthographique en développement, utilisant Java Swing pour l'interface utilisateur. Bien que toujours en cours de perfectionnement, Leven vise à offrir des suggestions de mots pour améliorer la qualité de vos textes.",
    
    // Experience section
    "exp_cmd": "cat experience.txt",
    "exp_title": "Expériences Professionnelles",
    "exp_etech_dev": "Développeur Full-Stack - Stage",
    "exp_etech_desc": "Stage de développement Full-Stack dans une entreprise technologique. Participation au développement d'applications web modernes et mise en pratique des technologies avancées.",
    "exp_frontend_dev": "Développeur Full-Stack - CDI",
    "exp_fullstack_dev": "Développeur Full-Stack - CDD",
    "exp_luminia_desc": "Participation à la réalisation frontend du site web de l'entreprise. Implémentation d'interfaces réactives et optimisation de l'expérience utilisateur.",
    "exp_haona_desc": "Contribution au développement d'une application mobile pour la sensibilisation des femmes au changement climatique dans la région de Haute Matsiatra. Développement frontend et backend avec Vue.js pour les appareils KaiOS.",
    "exp_competitions": "Compétitions",
    "exp_place": "place",
    "exp_a_project": "Un projet de 48h pour chaque weekend",
    
    // Dates
    "date_etech": "Mai 2024 - Août 2024",
    "date_luminia": "Novembre 2024 - Novembre 2025",
    "date_haona": "Janvier - Avril 2024",
    
    // Dates formation
    "date_php_training": "Mai 2025",
    "date_licence": "2021 - 2025",
    
    // Education section
    "edu_cmd": "cat formation.txt",
    "edu_title": "Formations",
    "edu_php_title": "Formation PHP Avancé",
    "edu_php_desc": "Formation intensive en développement PHP avec le framework Symfony. Apprentissage des bonnes pratiques, architecture MVC, sécurité et performance des applications web.",
    "edu_php_skills": "Compétences acquises:",
    "edu_php_skill1": "Développement d'applications web avec Symfony",
    "edu_php_skill2": "Conception d'API RESTful",
    "edu_php_skill3": "Optimisation des performances",
    "edu_php_skill4": "Sécurité des applications web",
    "edu_php_skill5": "Tests unitaires et fonctionnels",
    "edu_licence_title": "Licence en Informatique et Télécommunication",
    "edu_licence_desc": "Formation complète en informatique avec spécialisation en développement logiciel et systèmes intelligents. Acquisition de compétences en programmation, bases de données et intelligence artificielle.",
    
    // Certifications
    "cert_cmd": "ls certifications/",
    "cert_title": "Certifications",
    "view_on_accredible": "Voir sur Accredible",
    
    // Contact form
    "contact_title": "Me contacter",
    "name_label": "Nom",
    "email_label": "Email",
    "subject_label": "Sujet",
    "message_label": "Message",
    "send_button": "Envoyer",
    
    // Footer
    "footer_tagline": "Développeur Full-Stack Junior<br>Passionné par la création de solutions innovantes",
    "footer_copyright": "© 2025 RAJAOHARIVONY Haritody Tonny Raldo. Tous droits réservés.",
    
    // Modal
    "close_cert": "Fermer le certificat",
    "loading": "Chargement...",
    "loading_in_progress": "Chargement en cours...",
    "loading_error": "Erreur de chargement",
    "image_unavailable": "Image non disponible"
  }
};