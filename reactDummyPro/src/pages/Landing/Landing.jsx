import Header from "../../components/layout/Header";
import styles from "./Landing.module.css";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about user management." }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const listRef = useRef(null);

  const features = [
    {
      icon: "\u{1F465}",
      title: "Unified User Directory",
      description: "Create, import, and organize users across teams with a single source of truth."
    },
    {
      icon: "\u{1F512}",
      title: "Role-Based Access",
      description: "Define roles, permissions, and approvals so the right people see the right data."
    },
    {
      icon: "\u{1F4CA}",
      title: "Smart Insights",
      description: "Track growth, activity, and onboarding progress with real-time analytics."
    },
    {
      icon: "\u26A1",
      title: "Automated Workflows",
      description: "Trigger onboarding, offboarding, and compliance checks automatically."
    },
    {
      icon: "\u{1F504}",
      title: "Real-Time Sync",
      description: "Instant updates across devices, apps, and integrations."
    },
    {
      icon: "\u{1F3A8}",
      title: "Brand Ready",
      description: "Customize domains, colors, and messaging to match your company."
    }
  ];

  const steps = [
    {
      title: "Import & Verify Users",
      description: "Upload CSV or connect SSO. We validate and remove duplicates automatically."
    },
    {
      title: "Assign Roles & Policies",
      description: "Apply permission sets, approval rules, and security baselines in minutes."
    },
    {
      title: "Invite & Go Live",
      description: "Send branded invites and track onboarding completion in real time."
    }
  ];

  const logos = ["Cortex", "Nimbus", "Pulse", "Atlas", "BrightOps", "Nova"];

  const activity = [
    {
      name: "Anita Patel",
      action: "invited to Marketing",
      time: "2 min ago",
      tag: "Pending"
    },
    {
      name: "Diego Alvarez",
      action: "promoted to Admin",
      time: "14 min ago",
      tag: "Approved"
    },
    {
      name: "Marina Chen",
      action: "completed onboarding",
      time: "35 min ago",
      tag: "Complete"
    },
    {
      name: "Samuel Okoro",
      action: "requested access",
      time: "1 hr ago",
      tag: "Review"
    }
  ];

  const quickStats = [
    { label: "New invites", value: "128", trend: "+12%" },
    { label: "Active today", value: "1,482", trend: "+8%" },
    { label: "Roles audited", value: "64", trend: "+4%" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      image: "\u{1F469}\u200D\u{1F4BC}",
      text: "This system has transformed how we manage our team. The interface is intuitive and powerful!"
    },
    {
      name: "Michael Chen",
      role: "IT Director",
      company: "InnovateLabs",
      image: "\u{1F468}\u200D\u{1F4BB}",
      text: "Best user management solution we've used. The security features are top-notch."
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager",
      company: "GlobalTech",
      image: "\u{1F469}\u200D\u{1F393}",
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
      <Header showLogin={false} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Launch your user management hub</div>
          <h1 className={styles.heroTitle}>
            Build a
            <span className={styles.gradient}> Trusted</span> User Management
            Platform
          </h1>
          <p className={styles.heroSubtitle}>
            Centralize every account, permission, and audit trail in one beautiful workspace.
            Faster onboarding, stronger security, and happier teams.
          </p>
          <div className={styles.heroCta}>
            <button className={styles.primaryBtn} onClick={() => navigate("/login")}>
              Start Managing Users
            </button>
            <button className={styles.secondaryBtn}>See Live Demo</button>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.bannerShell}>
              <div className={styles.bannerTrack}>
                <div className={styles.bannerCard}>
                  <div className={styles.bannerHeader}>
                    <span className={styles.bannerChip}>Access Control</span>
                    <span className={styles.bannerTag}>Auto-approved</span>
                  </div>
                  <h3>Role-based policies that stay compliant</h3>
                  <p>Grant access by team, location, and contract status in one click.</p>
                  <div className={styles.bannerFooter}>
                    <span>Permissions applied</span>
                    <span className={styles.bannerStat}>98%</span>
                  </div>
                </div>

                <div className={styles.bannerCard}>
                  <div className={styles.bannerHeader}>
                    <span className={styles.bannerChip}>Onboarding</span>
                    <span className={styles.bannerTag}>Live</span>
                  </div>
                  <h3>New hires productive in 24 hours</h3>
                  <p>Send branded invites, assign apps, and track completion instantly.</p>
                  <div className={styles.bannerFooter}>
                    <span>Tasks completed</span>
                    <span className={styles.bannerStat}>1,248</span>
                  </div>
                </div>

                <div className={styles.bannerCard}>
                  <div className={styles.bannerHeader}>
                    <span className={styles.bannerChip}>Security Insights</span>
                    <span className={styles.bannerTag}>Updated</span>
                  </div>
                  <h3>Risk alerts delivered before incidents</h3>
                  <p>Automated checks surface dormant accounts and overdue reviews.</p>
                  <div className={styles.bannerFooter}>
                    <span>Issues resolved</span>
                    <span className={styles.bannerStat}>76</span>
                  </div>
                </div>

                <div className={styles.bannerCard}>
                  <div className={styles.bannerHeader}>
                    <span className={styles.bannerChip}>Directory Sync</span>
                    <span className={styles.bannerTag}>Synced</span>
                  </div>
                  <h3>Always current across every app</h3>
                  <p>Keep HRIS, SSO, and apps aligned with real-time user updates.</p>
                  <div className={styles.bannerFooter}>
                    <span>Sync accuracy</span>
                    <span className={styles.bannerStat}>99.9%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.floatingElement1}>{"\u2728"}</div>
            <div className={styles.floatingElement2}>{"\u{1F3AF}"}</div>
            <div className={styles.floatingElement3}>{"\u{1F4A1}"}</div>
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

      {/* Trusted By */}
      <section className={styles.trusted}>
        <div className={styles.container}>
          <p className={styles.trustedLabel}>Trusted by fast-growing teams</p>
          <div className={styles.trustedGrid}>
            {logos.map((logo) => (
              <div key={logo} className={styles.trustedLogo}>{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Everything You Need to Run User Management</h2>
            <p>Secure, compliant, and effortless - built for growing teams.</p>
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

      {/* Setup Steps */}
      <section className={styles.steps}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Launch in Three Simple Steps</h2>
            <p>Import, secure, and invite - your team is live in hours, not weeks.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepBadge}>{String(index + 1).padStart(2, "0")}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className={styles.stepChecks}>
                  <span className={styles.stepCheckIcon} aria-hidden="true">
                    {"\u2713"}
                  </span>
                  Ready in minutes
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Section */}
      <section className={styles.activity}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>See What Your Team Is Doing</h2>
            <p>Live activity feed and growth signals in one glance.</p>
          </div>
          <div className={styles.activityGrid}>
            <div className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <h3>Today's Activity</h3>
                <span className={styles.activityPulse}></span>
              </div>
              <div className={styles.activityList}>
                {activity.map((item) => (
                  <div key={item.name} className={styles.activityItem}>
                    <div>
                      <p className={styles.activityName}>{item.name}</p>
                      <p className={styles.activityMeta}>{item.action}</p>
                    </div>
                    <div className={styles.activityRight}>
                      <span className={styles.activityTag}>{item.tag}</span>
                      <span className={styles.activityTime}>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.activityHighlights}>
              {quickStats.map((stat) => (
                <div key={stat.label} className={styles.highlightCard}>
                  <p className={styles.highlightLabel}>{stat.label}</p>
                  <div className={styles.highlightValue}>{stat.value}</div>
                  <span className={styles.highlightTrend}>{stat.trend} this week</span>
                </div>
              ))}
              <div className={styles.highlightCardAccent}>
                <p className={styles.highlightLabel}>Next audit</p>
                <div className={styles.highlightValue}>3 days</div>
                <span className={styles.highlightTrend}>Stay compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <h2>Ready to Run User Management the Right Way?</h2>
          <p>Start today with secure onboarding, clean access, and instant visibility.</p>
          <button className={styles.ctaButton}>Create Your Workspace</button>
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
          {"\u{1F916}"}
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
            <p>One workspace for access, onboarding, approvals, and user insights.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.12 8.53h2.22V5.28h-2.22c-2.7 0-4.45 1.68-4.45 4.32v2H8.5v3.06h2.17v6.06h3.12v-6.06h2.38l.35-3.06h-2.73v-1.8c0-.83.45-1.27 1.33-1.27Z" />
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.45 7.28c.01.16.01.33.01.49 0 4.97-3.79 10.7-10.7 10.7-2.12 0-4.1-.62-5.77-1.7.3.03.6.05.91.05 1.76 0 3.39-.6 4.68-1.62-1.65-.03-3.04-1.12-3.52-2.6.23.04.46.07.71.07.34 0 .68-.05.99-.13-1.72-.35-3.02-1.87-3.02-3.7v-.05c.5.28 1.09.46 1.7.48-1.01-.67-1.67-1.82-1.67-3.12 0-.7.18-1.34.5-1.9 1.84 2.26 4.6 3.74 7.71 3.9-.06-.27-.09-.53-.09-.82 0-2.01 1.63-3.64 3.64-3.64 1.05 0 2 .44 2.67 1.15.83-.16 1.61-.47 2.31-.88-.27.85-.85 1.56-1.6 2.02.74-.08 1.45-.29 2.1-.58-.5.73-1.12 1.38-1.84 1.9Z" />
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.46 9.5h3.2v9.9h-3.2v-9.9Zm1.6-4.9a1.86 1.86 0 1 1 0 3.72 1.86 1.86 0 0 1 0-3.72ZM11.2 9.5h3.07v1.35h.05c.43-.81 1.5-1.66 3.09-1.66 3.3 0 3.9 2.17 3.9 4.99v5.22h-3.2v-4.63c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.77 1.2-1.77 2.44v4.71h-3.2v-9.9Z" />
                </svg>
              </a>
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
