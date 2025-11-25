'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Mail, Phone, MapPin, Github, Linkedin, Award, Briefcase, GraduationCap, Code, ChevronRight, Calendar, Menu, X, ExternalLink, User, Layers, Send, ArrowUp } from 'lucide-react';

const WebCV = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: false });
  
  const threeMountRef = useRef(null);
  const frameRef = useRef(null);

  // CV Data - Replace with your actual data
  const cvData = {
    personal: {
      name: "Sonam Dorji",
      title: "Full Stack Developer",
      email: "sonamd5dorji@gmail.com",
      phone: "+975-77737314",
      location: "Thimphu, Bhutan",
      bio: "Computer Science graduate with foundational skills in full stack development. Familiar with React Native, Next.js, Node.js, and TypeScript through academic and freelance projects. Currently pursuing cybersecurity as an elective and interested in secure coding practices.",
      avatar: "SD",
      social: {
        github: "https://github.com/Yaamnang",
        linkedin: "https://www.linkedin.com/in/sonam-dorji-36a4ab321",
      }
    },
    experience: [
      {
        id: 1,
        title: "Full Stack Developer",
        company: "Namzoed App",
        type: "Freelance",
        period: "Aug 2025 - Present",
        description: "Mobile application for business requirement gathering. Developing both frontend and backend using React Native and TypeScript.",
        technologies: ["React Native", "TypeScript", "Node.js"]
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "Druk Gi Makhu - Fuel Delivery Web App",
        type: "Group Project",
        period: "2024",
        description: "Fuel delivery enterprise web application with live location tracking. Handled frontend development for the ordering and tracking interface.",
        technologies: ["React.js", "CSS", "API Integration"]
      },
      {
        id: 3,
        title: "Frontend Developer",
        company: "FastRateTravel",
        type: "Freelance",
        period: "2024",
        description: "Tourism website built during third year. Developed frontend components for a smooth user experience.",
        technologies: ["React.js", "CSS", "JavaScript"]
      },
      {
        id: 4,
        title: "Frontend Developer & UI/UX Designer",
        company: "Deya Bhutan Tours",
        type: "Freelance",
        period: "2024",
        description: "Tourism website for a local travel agency. Designed and built responsive pages optimized for showcasing travel packages.",
        technologies: ["React.js", "Figma", "CSS"]
      },
      {
        id: 5,
        title: "Full Stack Developer",
        company: "Speed Dash",
        type: "Solo Project",
        period: "2023",
        description: "Maze-solving game developed in Java. Built game logic, UI, and pathfinding mechanics independently.",
        technologies: ["Java", "Game Development"]
      },
      {
        id: 6,
        title: "Frontend Developer & UI/UX Designer",
        company: "Lhojong Insurance Website",
        type: "Freelance",
        period: "2022",
        description: "Insurance company website. Handled frontend development and visual design for the platform.",
        technologies: ["HTML", "CSS", "JavaScript", "Figma"]
      },
      {
        id: 7,
        title: "Frontend Developer & UI/UX Designer",
        company: "MacStore",
        type: "Freelance",
        period: "2022",
        description: "Mac product showcase website. Designed and developed the user interface as my first freelance project.",
        technologies: ["HTML", "CSS", "JavaScript"]
      }
    ],
    education: [
      {
        degree: "Bachelor of Computer Science in Full Stack Development",
        school: "Gyalpozhing College of Information Technology",
        period: "2022 July - 2026 June",
        details: "Elective Course - Cybersecurity"
      },
      {
        degree: "Grade 12 Science Stream (Math)",
        school: "Yangchenphug Higher Secondary School",
        period: "2019 Feb - 2021 Dec",
        details: "70% Aggregate"
      },
      {
        degree: "Grade 10 Computer Application Stream",
        school: "Lungtenzampa Middle Secondary School",
        period: "2015 Feb - 2019 Dec",
        details: "70% Aggregate"
      }
    ],
    skills: {
      technical: [
        { name: "HTML/CSS", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "React.js/Next.js", level: 80 },
        { name: "React Native", level: 75 },
        { name: "TypeScript", level: 70 },
        { name: "Node.js", level: 70 },
        { name: "SQL", level: 65 },
        { name: "Figma", level: 80 },
        { name: "Git & GitHub", level: 75 },
        { name: "Java", level: 60 }
      ],
      soft: ["Teamwork", "Adaptability", "Problem Solving", "Time Management", "Discipline", "Reliability"]
    },
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Dzongkha", level: "Native" },
      { name: "Tshangla", level: "Basic" },
      { name: "Hindi", level: "Basic" }
    ],
    references: [
      {
        name: "Mr. Karma Dorji",
        title: "Associate Lecturer, Head of Cybersecurity Department",
        institution: "Gyalpozhing College of Information Technology",
        phone: "975-77916464",
        email: "karmadorji53@gmail.com"
      },
      {
        name: "Ms. Sonam Wangmo",
        title: "Lecturer, Full Stack Department",
        institution: "Gyalpozhing College of Information Technology",
        phone: "975-17391134",
        email: "sonamwangmo@gmail.com"
      }
    ]
  };

  // 3D Geometric Background
  useEffect(() => {
    if (!threeMountRef.current) return;

    const container = threeMountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create wireframe torus knot - centered
    const torusKnotGeometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
    const torusKnotMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    scene.add(torusKnot);

    // Create wireframe icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(3, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(-8, 6, -5);
    scene.add(icosahedron);

    // Create another wireframe shape
    const octaGeometry = new THREE.OctahedronGeometry(2.5, 0);
    const octaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(10, -5, -3);
    scene.add(octahedron);

    // Mouse/drag interaction for torus knot
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    // Touch support for mobile
    const handleTouchStart = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleTouchMove = (e) => {
      if (isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchmove', handleTouchMove);

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Smooth rotation interpolation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      // Auto rotation when not dragging
      if (!isDragging) {
        targetRotation.x += 0.003;
        targetRotation.y += 0.005;
      }
      
      torusKnot.rotation.x = currentRotation.x;
      torusKnot.rotation.y = currentRotation.y;
      
      icosahedron.rotation.x += 0.005;
      icosahedron.rotation.y += 0.003;
      
      octahedron.rotation.x -= 0.004;
      octahedron.rotation.z += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Fullscreen fixed particles background
  useEffect(() => {
    const particleContainer = document.getElementById('particles-bg');
    if (!particleContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    particleContainer.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let particleFrame;
    const animateParticles = () => {
      particleFrame = requestAnimationFrame(animateParticles);
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;
      renderer.render(scene, camera);
    };
    animateParticles();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (particleFrame) cancelAnimationFrame(particleFrame);
      window.removeEventListener('resize', handleResize);
      if (particleContainer && renderer.domElement) {
        particleContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'experience', 'skills', 'education', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: false });
    
    try {
      const response = await fetch('https://formspree.io/f/xeowvnqp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
      
      if (response.ok) {
        setFormStatus({ loading: false, success: true, error: false });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus({ loading: false, success: false, error: false }), 5000);
      } else {
        setFormStatus({ loading: false, success: false, error: true });
      }
    } catch (error) {
      setFormStatus({ loading: false, success: false, error: true });
    }
  };

  const sections = [
    { id: 'home', label: 'Home', icon: <User className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fixed Fullscreen Particles Background */}
      <div id="particles-bg" className="fixed inset-0 z-0 pointer-events-none" />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-white/10">
        <div 
          className="h-full bg-white transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => scrollToSection('home')}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
                {cvData.personal.avatar}
              </div>
              <span className="font-light tracking-wider hidden sm:block">{cvData.personal.name}</span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-sm tracking-wide transition-all duration-300 hover:text-white ${
                    activeSection === section.id ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-6 py-4 space-y-2 border-t border-white/10">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === section.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left z-10">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center text-4xl font-light mb-6 transition-all duration-500 hover:scale-110 hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/10 cursor-pointer group">
                  <span className="transition-all duration-300 group-hover:scale-110">{cvData.personal.avatar}</span>
                </div>
              </div>
              
              <p className="text-white/50 text-sm tracking-widest uppercase mb-2">Hello, I'm</p>
              
              <h1 className="text-5xl md:text-6xl font-extralight tracking-tight mb-4">
                {cvData.personal.name}
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-white/60 mb-6 tracking-wide">
                {cvData.personal.title}
              </p>
              
              <p className="text-white/50 leading-relaxed mb-8 max-w-lg">
                {cvData.personal.bio}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <a href={`mailto:${cvData.personal.email}`} className="flex items-center space-x-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
                <a href={cvData.personal.social.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a href={cvData.personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
              
              <div className="flex items-center space-x-6 text-white/40 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{cvData.personal.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>Available for work</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - 3D Art */}
            <div className="relative h-[500px] md:h-[600px]">
              <div ref={threeMountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-16 text-center">
            About Me
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500">
                <h3 className="text-xl font-light mb-6 tracking-wide">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-white/60">
                    <Mail className="w-5 h-5" />
                    <span>{cvData.personal.email}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white/60">
                    <Phone className="w-5 h-5" />
                    <span>{cvData.personal.phone}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white/60">
                    <MapPin className="w-5 h-5" />
                    <span>{cvData.personal.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500">
                <h3 className="text-xl font-light mb-6 tracking-wide">Languages</h3>
                <div className="flex flex-wrap gap-3">
                  {cvData.languages.map((lang, i) => (
                    <span key={i} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/70">
                      {lang.name} — {lang.level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500">
              <h3 className="text-xl font-light mb-6 tracking-wide">Soft Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {cvData.skills.soft.map((skill, i) => (
                  <div key={i} className="flex items-center space-x-3 text-white/60">
                    <div className="w-2 h-2 bg-white/50 rounded-full" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Availability Status</span>
                  <span className="flex items-center space-x-2 text-white">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>Available</span>
                  </span>
                </div>
                <p className="text-sm text-white/40 mt-2">Open for freelance and full-time opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-16 text-center">
            Experience
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
            
            {cvData.experience.map((exp, index) => (
              <div 
                key={exp.id} 
                className={`relative mb-12 md:mb-16 ${index % 2 === 0 ? 'md:pr-[50%] md:text-right' : 'md:pl-[50%] md:ml-auto'}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 mt-8" />
                
                <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'} p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500 group`}>
                  <div className={`flex items-start justify-between mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-xl font-light">{exp.title}</h3>
                      <p className="text-white/60">{exp.company}</p>
                    </div>
                    <Briefcase className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                  
                  <div className={`flex items-center space-x-4 text-sm text-white/40 mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="px-2 py-1 border border-white/10 rounded-full text-xs">{exp.type}</span>
                  </div>
                  
                  <p className={`text-white/50 mb-4 ${index % 2 === 0 ? 'md:text-right' : ''}`}>{exp.description}</p>
                  
                  <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-16 text-center">
            Skills
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {cvData.skills.technical.map((skill, i) => (
              <div 
                key={i} 
                className="p-6 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500 group"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-light">{skill.name}</span>
                  <span className="text-white/40 text-sm">{skill.level}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out group-hover:opacity-100 opacity-70"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-16 text-center">
            Education
          </h2>
          
          <div className="space-y-8">
            {cvData.education.map((edu, index) => (
              <div 
                key={index} 
                className="p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-light mb-2">{edu.degree}</h3>
                    <p className="text-white/60 mb-2">{edu.school}</p>
                    <div className="flex items-center space-x-4 text-sm text-white/40">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.period}</span>
                      </span>
                    </div>
                    {edu.details && (
                      <p className="mt-4 text-white/50">{edu.details}</p>
                    )}
                  </div>
                  <GraduationCap className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          
          {/* References */}
          <div className="mt-16">
            <h3 className="text-2xl font-extralight tracking-tight mb-8 text-center">References</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {cvData.references.map((ref, i) => (
                <div key={i} className="p-6 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500">
                  <h4 className="font-light mb-1">{ref.name}</h4>
                  <p className="text-sm text-white/50 mb-4">{ref.title}<br/>{ref.institution}</p>
                  <div className="space-y-2 text-sm text-white/40">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{ref.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{ref.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-16 text-center">
            Get In Touch
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-white/50 leading-relaxed">
                I'm currently available for freelance work and full-time opportunities. 
                If you have a project in mind or just want to connect, feel free to reach out.
              </p>
              
              <div className="space-y-4">
                <a href={`mailto:${cvData.personal.email}`} className="flex items-center space-x-4 p-4 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 group">
                  <Mail className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-white/60 group-hover:text-white transition-colors">{cvData.personal.email}</span>
                </a>
                <a href={`tel:${cvData.personal.phone}`} className="flex items-center space-x-4 p-4 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 group">
                  <Phone className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-white/60 group-hover:text-white transition-colors">{cvData.personal.phone}</span>
                </a>
              </div>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:border-white/30 focus:outline-none transition-colors placeholder:text-white/30"
                required
                disabled={formStatus.loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:border-white/30 focus:outline-none transition-colors placeholder:text-white/30"
                required
                disabled={formStatus.loading}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:border-white/30 focus:outline-none transition-colors resize-none placeholder:text-white/30"
                required
                disabled={formStatus.loading}
              />
              <button
                type="submit"
                disabled={formStatus.loading}
                className="w-full py-3 border border-white/30 rounded-xl hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus.loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              
              {formStatus.success && (
                <div className="p-4 border border-white/20 rounded-xl text-center text-white/70">
                  ✓ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {formStatus.error && (
                <div className="p-4 border border-white/20 rounded-xl text-center text-white/70">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-sm">
              {cvData.personal.avatar}
            </div>
            <span className="text-white/50 text-sm">© 2024 {cvData.personal.name}</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href={cvData.personal.social.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href={cvData.personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${cvData.personal.email}`} className="text-white/40 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        onClick={() => scrollToSection('home')}
        className={`fixed bottom-8 right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 ${
          scrollProgress > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WebCV;