import Header from "../../components/layout/Header";
import styles from "./Landing.module.css";

function Landing() {

  const features = [
    {
      icon: "👥",
      title: "User Management",
      description: "Efficiently manage and organize all your users in one centralized dashboard"
    },
    {
      icon: "🔒",
      title: "Secure Access",
      description: "Enterprise-grade security with role-based access control and encryption"
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Get real-time insights with powerful analytics and reporting tools"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Optimized performance ensures smooth experience even with large datasets"
    },
    {
      icon: "🔄",
      title: "Real-time Sync",
      description: "Automatic synchronization keeps your data up-to-date across all devices"
    },
    {
      icon: "🎨",
      title: "Custom Branding",
      description: "Personalize the platform with your brand colors and logo"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      image: "👩‍💼",
      text: "This system has transformed how we manage our team. The interface is intuitive and powerful!"
    },
    {
      name: "Michael Chen",
      role: "IT Director",
      company: "InnovateLabs",
      image: "👨‍💻",
      text: "Best user management solution we've used. The security features are top-notch."
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager",
      company: "GlobalTech",
      image: "👩‍🎓",
      text: "Managing hundreds of users is now effortless. Highly recommend this platform!"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "50+", label: "Countries" }
  ];

  return (
    <div className={styles.wrapper}>
      <Header showLogin={true} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>🚀 New Features Available</div>
          <h1 className={styles.heroTitle}>
            Manage Your Team with
            <span className={styles.gradient}> Confidence</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The most powerful and intuitive user management system built for modern teams.
            Streamline operations, enhance security, and boost productivity.
          </p>
          <div className={styles.heroCta}>
            <button className={styles.primaryBtn}>Get Started Free</button>
            <button className={styles.secondaryBtn}>Watch Demo</button>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.dashboardMock}>
              <div className={styles.mockHeader}></div>
              <div className={styles.mockContent}>
                <div className={styles.mockSidebar}></div>
                <div className={styles.mockMain}>
                  <div className={styles.mockCard}></div>
                  <div className={styles.mockCard}></div>
                  <div className={styles.mockCard}></div>
                </div>
              </div>
            </div>
            <div className={styles.floatingElement1}>✨</div>
            <div className={styles.floatingElement2}>🎯</div>
            <div className={styles.floatingElement3}>💡</div>
          </div>
        </div>
        <div className={styles.wave}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <h3 className={styles.statNumber}>{stat.number}</h3>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Powerful Features for Modern Teams</h2>
            <p>Everything you need to manage users efficiently and securely</p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <h2>Ready to Transform Your Workflow?</h2>
          <p>Join thousands of teams already using our platform</p>
          <button className={styles.ctaButton}>Start Your Free Trial</button>
        </div>
        <div className={styles.ctaAnimation}>
          <div className={styles.pulse}></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Loved by Teams Worldwide</h2>
            <p>See what our customers have to say</p>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.quote}>"</div>
                <p className={styles.testimonialText}>{testimonial.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorImage}>{testimonial.image}</div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>User Management System</h3>
            <p>The modern way to manage your team with confidence and security.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon}>📘</a>
              <a href="#" className={styles.socialIcon}>🐦</a>
              <a href="#" className={styles.socialIcon}>💼</a>
              <a href="#" className={styles.socialIcon}>📷</a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Updates</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 User Management System. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;