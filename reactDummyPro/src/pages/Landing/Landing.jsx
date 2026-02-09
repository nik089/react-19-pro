import Header from "../../components/layout/Header";
import styles from "./Landing.module.css";
import { useMemo, useRef, useState } from "react";

function Landing() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about this platform." }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const listRef = useRef(null);

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

  const hfApiKey = useMemo(() => import.meta.env.VITE_HF_API_KEY || "", []);
  const hfModel = useMemo(
    () => import.meta.env.VITE_HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2",
    []
  );
  const chatProvider = useMemo(() => import.meta.env.VITE_CHAT_PROVIDER || "ollama", []);
  const ollamaModel = useMemo(
    () => import.meta.env.VITE_OLLAMA_MODEL || "llama3.1:8b",
    []
  );
  const ollamaUrl = useMemo(
    () => import.meta.env.VITE_OLLAMA_URL || "/ollama/api/chat",
    []
  );

  const buildPrompt = (thread) => {
    const system = "System: You are a concise, helpful assistant for a user management platform. Keep answers under 6 sentences and avoid sensitive data.";
    const history = thread
      .slice(-6)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    return `${system}\n${history}\nAssistant:`;
  };

  const streamAssistantMessage = (fullText) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, role: "assistant", content: "" }]);
    setIsStreaming(true);

    let index = 0;
    const interval = setInterval(() => {
      index += 3;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, content: fullText.slice(0, index) } : msg
        )
      );

      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 25);
  };

  const upsertAssistantMessage = (text) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === "assistant" && !last.content) {
        return [...prev.slice(0, -1), { ...last, content: text }];
      }
      return [...prev, { role: "assistant", content: text }];
    });
  };

  const streamFromOllama = async (thread) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, role: "assistant", content: "" }]);
    setIsStreaming(true);
    let received = false;

    try {
      const makeRequest = async (url) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: ollamaModel,
            messages: thread.slice(-8).map((m) => ({
              role: m.role,
              content: m.content
            })),
            stream: true
          })
        });

      let response = await makeRequest(ollamaUrl);
      if (response.status === 404 && ollamaUrl.startsWith("/ollama")) {
        response = await makeRequest("http://localhost:11434/api/chat");
      }

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(
          `Ollama error: ${response.status} ${response.statusText} ${errorText}`.trim()
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        buffer += decoder.decode(result.value || new Uint8Array(), { stream: !done });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const chunk = JSON.parse(line);
            const content = chunk?.message?.content || "";
            if (content) {
              received = true;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === id ? { ...msg, content: msg.content + content } : msg
                )
              );
              if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
              }
            }
            if (chunk?.done) {
              done = true;
            }
          } catch {
            // ignore malformed lines
          }
        }
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Local chatbot not reachable. Ensure Ollama is running and CORS is enabled.";
      upsertAssistantMessage(message);
      return;
    } finally {
      setIsStreaming(false);
      if (!received) {
        upsertAssistantMessage(
          "Local chatbot not reachable. Ensure Ollama is running and CORS is enabled."
        );
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending || isStreaming) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      if (chatProvider === "ollama") {
        await streamFromOllama(nextMessages);
        return;
      }

      if (!hfApiKey) {
        throw new Error("Missing API key");
      }

      const payload = {
        inputs: buildPrompt(nextMessages),
        parameters: {
          max_new_tokens: 120,
          temperature: 0.7,
          top_p: 0.9
        }
      };

      const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hfApiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      const text =
        Array.isArray(data) && data[0]?.generated_text
          ? data[0].generated_text.split("Assistant:").pop().trim()
          : "Sorry, I couldn't generate a response.";

      streamAssistantMessage(text || "Sorry, I couldn't generate a response.");
    } catch (err) {
      if (chatProvider === "ollama") {
        upsertAssistantMessage(
          err instanceof Error && err.message
            ? err.message
            : "Local chatbot not reachable. Ensure Ollama is running and CORS is enabled."
        );
      } else {
        upsertAssistantMessage(
          err instanceof Error && err.message
            ? err.message
            : "Chatbot setup pending. Add your Hugging Face API key to VITE_HF_API_KEY."
        );
      }
    } finally {
      setIsSending(false);
    }
  };

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

      {/* Chatbot Floating Widget */}
      <div className={styles.chatbotWidget}>
        <button
          className={styles.chatbotFab}
          onClick={() => setIsChatOpen((open) => !open)}
          aria-label="Open chatbot"
        >
          🤖
        </button>

        {isChatOpen && (
          <div className={styles.chatbotPopup}>
            <div className={styles.chatbotHeader}>
              <div>
                <h2>Live Help</h2>
                <p>Local model via Ollama</p>
              </div>
              <span className={styles.chatbotBadge}>Beta</span>
            </div>

            <div className={styles.chatbotBody} ref={listRef}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.role === "user" ? styles.chatbotMessageUser : styles.chatbotMessageBot
                  }
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <form className={styles.chatbotForm} onSubmit={sendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about features, pricing, onboarding..."
              />
              <button type="submit" disabled={isSending || isStreaming}>
                {isSending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        )}
      </div>

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
