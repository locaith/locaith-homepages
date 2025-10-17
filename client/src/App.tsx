import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import pageHtml from "./page.html?raw";

const TELEGRAM_BOT_TOKEN = "7844320679:AAHHLilhDB53NOfamcd3wOaxb0Pv1few3YE";
const TELEGRAM_CHAT_ID = "-1002557707339";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

type DemoFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const initialFormState: DemoFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};


const HERO_IMAGES: Array<{ src: string; alt: string }> = [
  { src: "/Media%20Locaith/505940199_3919196211729165_1130168922001775853_n.jpg", alt: "Khoảnh khắc Locaith AI cùng đối tác" },
  { src: "/Media%20Locaith/511987638_122109207458914218_2013369609954996108_n.jpg", alt: "Locaith AI trình diễn giải pháp AI" },
  { src: "/Media%20Locaith/516497423_9617322725035542_4743024921649227692_n.jpg", alt: "Workshop trải nghiệm sản phẩm Locaith AI" },
  { src: "/Media%20Locaith/517384286_9617306705037144_1544841786077814232_n.jpg", alt: "Sự kiện AI for Business của Locaith" },
  { src: "/Media%20Locaith/517580111_9617291941705287_7444594196238018380_n.jpg", alt: "Đối tác học tập cùng Locaith AI" },
  { src: "/Media%20Locaith/518135178_9617285228372625_7343639817838313592_n.jpg", alt: "Trình diễn tính năng Content Studio" },
  { src: "/Media%20Locaith/518560332_9662565220511292_5358688032323147729_n.jpg", alt: "Locaith AI tại Spotlight Showcase" },
  { src: "/Media%20Locaith/8724fc06-b33f-49d5-a4b7-079cfcde5e74.jpg", alt: "Chia sẻ chuyển đổi số với doanh nghiệp" },
  { src: "/Media%20Locaith/bbfd74e5-28c0-451e-ba64-11eece87ed56.jpg", alt: "Hoạt động cộng đồng của Locaith AI" },
  { src: "/Media%20Locaith/ca92fa9e-89bb-4eca-939d-2856cf4f61e3.jpg", alt: "Hội thảo về giải pháp AI nội bộ" },
  { src: "/Media%20Locaith/f8ed7a6a-a1e0-4a33-9fec-0a9fbdc58bfc.jpg", alt: "Đối tác trao đổi với chuyên gia Locaith AI" },
  { src: "/Media%20Locaith/Locaith-edu-vivai.jpg", alt: "Hợp tác giáo dục cùng Locaith AI" },
];

type ToolLink = {
  label: string;
  href: string;
  preview: string;
  alt: string;
};

const AI_TOOLS: ToolLink[] = [
  {
    label: "phechat.com",
    href: "https://phechat.com",
    preview: "/PreviewTools/phechat.com.png",
    alt: "Giao dien phechat.com",
  },
  {
    label: "content.locaith.com",
    href: "https://content.locaith.com",
    preview: "/PreviewTools/marketing%20content.png",
    alt: "Giao dien content.locaith.com",
  },
  {
    label: "locaith.ai",
    href: "https://locaith.ai",
    preview: "/Logo%20Locaith/logo-locaith.png",
    alt: "Logo Locaith AI",
  },
];

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolLink>(AI_TOOLS[0]);
  const [demoOpen, setDemoOpen] = useState(false);
  const [formData, setFormData] = useState<DemoFormState>(initialFormState);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const headerInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!navOpen && !toolsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (headerInnerRef.current && !headerInnerRef.current.contains(event.target as Node)) {
        setNavOpen(false);
        setToolsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [navOpen, toolsOpen]);

  useEffect(() => {
    if (!demoOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [demoOpen]);

  useEffect(() => {
    if (toolsOpen) {
      setActiveTool(AI_TOOLS[0]);
    }
  }, [toolsOpen]);

  useEffect(() => {
    const headerElement = document.querySelector<HTMLElement>(".site-header");

    const handleScroll = () => {
      if (!headerElement) return;
      const shouldCompact = window.scrollY > 16;
      headerElement.classList.toggle("is-scrolled", shouldCompact);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
        setToolsOpen(false);
        setDemoOpen(false);
        setFormStatus("idle");
      }
    };

    const root = document.documentElement;
    const pointerMedia = window.matchMedia("(pointer: fine)");

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    if (pointerMedia.matches) {
      window.addEventListener("pointermove", updatePointer);
    } else {
      root.style.setProperty("--pointer-x", "50vw");
      root.style.setProperty("--pointer-y", "50vh");
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-animate]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");

          const children = target.querySelectorAll<HTMLElement>("[data-animate-child]");
          children.forEach((child, index) => {
            const delay = target.dataset.animate === "stagger" ? index * 90 : index * 45;
            child.style.transitionDelay = `${delay}ms`;
            requestAnimationFrame(() => child.classList.add("is-visible"));
          });

          observer.unobserve(target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    sections.forEach((section) => {
      section.classList.add("waiting");
      observer.observe(section);
    });

    const sliderCleanup: Array<() => void> = [];
    const slider = document.querySelector<HTMLElement>("[data-hero-slider]");

    if (slider) {
      const slidesHost = slider.querySelector<HTMLElement>(".hero__slides") ?? slider;
      const dotsContainer = slider.querySelector<HTMLElement>(".hero__dots");

      if (dotsContainer) {
        slidesHost.innerHTML = "";
        dotsContainer.innerHTML = "";

        HERO_IMAGES.forEach((image, idx) => {
          const figure = document.createElement("figure");
          figure.className = "hero__slide";
          figure.dataset.slide = "";
          if (idx === 0) {
            figure.classList.add("is-active");
          }

          const img = document.createElement("img");
          img.src = image.src;
          img.alt = image.alt;
          figure.appendChild(img);
          slidesHost.appendChild(figure);
        });
      }

      const slides = Array.from(slidesHost.querySelectorAll<HTMLElement>("[data-slide]"));

      if (slides.length > 0 && dotsContainer) {
        let activeIndex = 0;
        let intervalId: number | undefined;
        const dots: HTMLButtonElement[] = [];

        const setActive = (index: number) => {
          activeIndex = index;
          slides.forEach((slide, idx) => {
            slide.classList.toggle("is-active", idx === index);
          });
          dots.forEach((dot, idx) => {
            const isCurrent = idx === index;
            dot.classList.toggle("is-active", isCurrent);
            dot.setAttribute("aria-selected", String(isCurrent));
            dot.setAttribute("tabindex", isCurrent ? "0" : "-1");
          });
        };

        const goTo = (index: number) => {
          const normalized = (index + slides.length) % slides.length;
          setActive(normalized);
        };

        const next = () => goTo(activeIndex + 1);

        const stop = () => {
          if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = undefined;
          }
        };

        const start = () => {
          stop();
          intervalId = window.setInterval(next, 5200);
        };

        slides.forEach((_, idx) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = idx === 0 ? "is-active" : "";
          dot.setAttribute("aria-label", `Xem hinh ${idx + 1}`);
          dot.setAttribute("role", "tab");
          dot.addEventListener("click", () => {
            goTo(idx);
            start();
          });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        });

        const handleMouseEnter = () => stop();
        const handleMouseLeave = () => start();

        slider.addEventListener("mouseenter", handleMouseEnter);
        slider.addEventListener("mouseleave", handleMouseLeave);
        slider.addEventListener("focusin", handleMouseEnter);
        slider.addEventListener("focusout", handleMouseLeave);

        setActive(0);
        start();

        sliderCleanup.push(() => {
          stop();
          slider.removeEventListener("mouseenter", handleMouseEnter);
          slider.removeEventListener("mouseleave", handleMouseLeave);
          slider.removeEventListener("focusin", handleMouseEnter);
          slider.removeEventListener("focusout", handleMouseLeave);
          dots.forEach((dot) => dot.remove());
        });
      }
    }

    const certificateSlider = document.querySelector<HTMLElement>("[data-certificate-slider]");

    if (certificateSlider) {
      const slides = Array.from(certificateSlider.querySelectorAll<HTMLElement>("[data-cert-slide]"));
      const dotsContainer = certificateSlider.querySelector<HTMLElement>(".certificate-dots");

      if (slides.length > 0 && dotsContainer) {
        let activeIndex = 0;
        let intervalId: number | undefined;
        const dots: HTMLButtonElement[] = [];

        dotsContainer.innerHTML = "";

        const setActive = (index: number) => {
          activeIndex = index;
          slides.forEach((slide, idx) => {
            slide.classList.toggle("is-active", idx === index);
          });
          dots.forEach((dot, idx) => {
            const isCurrent = idx === index;
            dot.classList.toggle("is-active", isCurrent);
            dot.setAttribute("aria-selected", String(isCurrent));
            dot.setAttribute("tabindex", isCurrent ? "0" : "-1");
          });
        };

        const goTo = (index: number) => {
          const normalized = (index + slides.length) % slides.length;
          setActive(normalized);
        };

        const next = () => goTo(activeIndex + 1);

        const stop = () => {
          if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = undefined;
          }
        };

        const start = () => {
          stop();
          intervalId = window.setInterval(next, 6200);
        };

        slides.forEach((_, idx) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = idx === 0 ? "is-active" : "";
          dot.setAttribute("aria-label", `Xem chung nhan ${idx + 1}`);
          dot.setAttribute("role", "tab");
          dot.addEventListener("click", () => {
            goTo(idx);
            start();
          });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        });

        setActive(0);
        start();

        certificateSlider.addEventListener("mouseenter", stop);
        certificateSlider.addEventListener("mouseleave", start);
        certificateSlider.addEventListener("focusin", stop);
        certificateSlider.addEventListener("focusout", start);

        sliderCleanup.push(() => {
          stop();
          certificateSlider.removeEventListener("mouseenter", stop);
          certificateSlider.removeEventListener("mouseleave", start);
          certificateSlider.removeEventListener("focusin", stop);
          certificateSlider.removeEventListener("focusout", start);
          dots.forEach((dot) => dot.remove());
        });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (pointerMedia.matches) {
        window.removeEventListener("pointermove", updatePointer);
      }
      sliderCleanup.forEach((cleanup) => cleanup());
      observer.disconnect();
    };
  }, []);

  const toggleNav = () => {
    setNavOpen((previous) => {
      const next = !previous;
      if (!next) {
        setToolsOpen(false);
      }
      return next;
    });
  };

  const closeNav = () => {
    setNavOpen(false);
    setToolsOpen(false);
  };

  const toggleTools = () => setToolsOpen((previous) => !previous);

  const openDemo = () => {
    setDemoOpen(true);
    setFormStatus("idle");
  };

  const closeDemo = () => {
    setDemoOpen(false);
    setFormStatus("idle");
  };

  const handleFormChange = (field: keyof DemoFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleDemoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus === "sending") return;

    setFormStatus("sending");

    const text = [
      "Yeu cau demo Locaith AI",
      "",
      `Ho ten: ${formData.name || "Khong cung cap"}`,
      `Doanh nghiep: ${formData.company || "Khong cung cap"}`,
      `Email: ${formData.email || "Khong cung cap"}`,
      `So dien thoai: ${formData.phone || "Khong cung cap"}`,
      "",
      "Noi dung:",
      formData.message || "Khong co ghi chu",
    ].join("\n");

    try {
      const response = await fetch(TELEGRAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      });

      if (!response.ok) {
        throw new Error("Telegram request failed");
      }

      setFormStatus("success");
      setFormData(initialFormState);
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    }
  };

  const headerInnerClassName = navOpen ? "site-header__inner is-open" : "site-header__inner";
  const toolsGroupClassName = toolsOpen ? "site-nav__group is-open" : "site-nav__group";
  const isSending = formStatus === "sending";

  useEffect(() => {
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-open-demo]"));
    const handleTriggerClick = (event: Event) => {
      event.preventDefault();
      setDemoOpen(true);
      setFormStatus("idle");
    };

    triggers.forEach((trigger) => trigger.addEventListener("click", handleTriggerClick));
    return () => {
      triggers.forEach((trigger) => trigger.removeEventListener("click", handleTriggerClick));
    };
  }, []);

  return (
    <>
      <header className="site-header" id="top">
        <div className={headerInnerClassName} ref={headerInnerRef}>
          <a className="logo" href="#top" onClick={closeNav}>
            <img src="/Logo%20Locaith/logo-locaith.png" alt="Locaith AI logo" />
            <span>Locaith AI</span>
          </a>
          <button className="nav-toggle" type="button" aria-label="Mở điều hướng" aria-expanded={navOpen} onClick={toggleNav}>
            <span></span>
            <span></span>
          </button>
          <nav className="site-nav" aria-label="Chính">
            <a onClick={closeNav} href="#gioi-thieu">Giới thiệu</a>
            <a onClick={closeNav} href="#giai-phap">Giải pháp</a>
            <div className={toolsGroupClassName}>
              <button
                className="site-nav__trigger"
                type="button"
                aria-haspopup="true"
                aria-controls="ai-tools-menu"
                aria-expanded={toolsOpen}
                onClick={toggleTools}
              >
                Bộ công cụ AI
              </button>
              <div className="site-nav__panel" id="ai-tools-menu" role="menu">
                <div className="site-nav__panel-preview">
                  <img src={activeTool.preview} alt={activeTool.alt} />
                  <span className="site-nav__panel-preview-label">{activeTool.label}</span>
                </div>
                <div className="site-nav__panel-links">
                  {AI_TOOLS.map((tool) => (
                    <a
                      key={tool.href}
                      onClick={closeNav}
                      href={tool.href}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => setActiveTool(tool)}
                      onFocus={() => setActiveTool(tool)}
                    >
                      {tool.label}
                    </a>
                  ))}
                </div>
                <div className="site-nav__panel-details">
                  <h4>Giải pháp của Locaith Solution Tech</h4>
                  <ul>
                    <li>Cá nhân hóa Chatbot CSKH AI cho từng doanh nghiệp</li>
                    <li>Lắp đặt AI Local, bảo mật dữ liệu với chi phí tối ưu</li>
                    <li>Thiết kế ERP và báo cáo dữ liệu bằng AI (tài chính, văn bản, công văn)</li>
                    <li>Thiết kế website AI Chatbot &amp; WebApp chuyên biệt</li>
                    <li>Xây dựng automation/Agentkit và quy trình n8n</li>
                    <li>Tự động sản xuất video marketing bằng Veo3</li>
                    <li>Trợ lý ảo điều khiển thiết bị gia đình qua router/wifi</li>
                    <li>Thiết kế thiết bị, đồ chơi tích hợp AI theo yêu cầu</li>
                  </ul>
                </div>
              </div>
            </div>
            <a onClick={closeNav} href="#media">Media</a>
            <a onClick={closeNav} href="#doi-tac">Đối tác</a>
            <a onClick={closeNav} href="#privacy">Chính sách</a>
            <a onClick={closeNav} href="#lien-he">Liên hệ</a>
            <button
              type="button"
              className="site-nav__demo pill pill--solid"
              onClick={() => {
                closeNav();
                openDemo();
              }}
            >
              Đặt lịch demo
            </button>
          </nav>
          <div className="site-header__cta">
            <button type="button" className="pill pill--ghost" onClick={openDemo}>
              Đặt lịch demo
            </button>
            <a onClick={closeNav} className="pill pill--solid" href="#bo-cong-cu">
              Locaith AI Suite
            </a>
          </div>        </div>
      </header>
      <div className="page-wrapper" dangerouslySetInnerHTML={{ __html: pageHtml }} />
      <div className={demoOpen ? "demo-modal is-open" : "demo-modal"} aria-hidden={!demoOpen}>
        <div className="demo-modal__backdrop" onClick={closeDemo} />
        <div className="demo-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
          <button className="demo-modal__close" type="button" aria-label="Đóng" onClick={closeDemo}>
            ×
          </button>
          <h2 id="demo-modal-title">Đặt lịch demo Locaith AI</h2>
          <p>
            Điền thông tin bên dưới, đội ngũ Locaith sẽ liên hệ trong vòng 24 giờ để tư vấn kiến trúc và lộ trình triển khai phù hợp.
          </p>
          <form className="demo-modal__form" onSubmit={handleDemoSubmit}>
            <label>
              Họ tên *
              <input type="text" name="name" required value={formData.name} onChange={handleFormChange("name")} placeholder="Nguyễn Văn A" />
            </label>
            <label>
              Email *
              <input type="email" name="email" required value={formData.email} onChange={handleFormChange("email")} placeholder="ban@doanhnghiep.com" />
            </label>
            <label>
              Số điện thoại *
              <input type="tel" name="phone" required value={formData.phone} onChange={handleFormChange("phone")} placeholder="0966872591" />
            </label>
            <label>
              Doanh nghiệp/Tổ chức
              <input type="text" name="company" value={formData.company} onChange={handleFormChange("company")} placeholder="Locaith Solution Tech" />
            </label>
            <label>
              Nhu cầu triển khai
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleFormChange("message")}
                placeholder="Mô tả ngắn về bài toán của bạn..."
              />
            </label>
            <button type="submit" className="pill pill--solid demo-modal__submit" disabled={isSending}>
              {isSending ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
            {formStatus === "success" && <p className="demo-modal__status demo-modal__status--success">Đã gửi thành công! Chúng tôi sẽ liên hệ sớm.</p>}
            {formStatus === "error" && (
              <p className="demo-modal__status demo-modal__status--error">Không thể gửi thông tin, vui lòng thử lại sau ít phút.</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

