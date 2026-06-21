"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icons";
import { HeroSlideVideo } from "@/components/ui/HeroSlideVideo";

const SLIDE_DURATION_MS = 20000;

const slides = [
  {
    title: "构建全球 AI 兼容的友好度体系",
    subtitle: "源自我们对完整方法论的实践，让企业知识被精准理解与引用",
    action: "探索技术方案",
    background: "/images/yfyk-ai-global-compatible-hero.png",
    backgroundVideo: "/videos/hero-banner-8s.mp4",
    backgroundPoster: "/videos/hero-banner-workspace-poster.jpg",
  },
  {
    title: "打造 AI 首选的企业知识源",
    action: "获取策划方案",
    background: "/images/yfyk-ai-monument-hero.png",
    backgroundVideo: "/videos/hero-banner-5s.mp4",
    backgroundPoster: "/videos/hero-banner-monument-poster.jpg",
  },
  {
    title: "建立 AI 时代的品牌信任",
    subtitle: "让每一次 AI 引用，都源自您的官网",
    action: "获取策划方案",
    background: "/images/yfyk-ai-brand-trust-hero.png",
  },
  {
    title: "别让 AI 把客户“截胡”了",
    subtitle: "让 AI 在回答问题时，主动推荐您的品牌",
    action: "获取策划方案",
    background: "/images/yfyk-ai-recommendation-hero.png",
  },
];

const aiPlatforms = ["ChatGPT", "Claude", "Gemini", "DeepSeek", "Kimi", "豆包", "文心一言", "通义千问", "腾讯元宝"] as const;
type AiPlatform = (typeof aiPlatforms)[number];

function AiPlatformLogo({ platform }: { platform: AiPlatform }) {
  const common = { viewBox: "0 0 32 32", "aria-hidden": true };

  if (platform === "ChatGPT") {
    return <svg {...common}><path d="M16 4.1a6.2 6.2 0 0 1 10.4 4.5 6.2 6.2 0 0 1 1.1 10.8A6.2 6.2 0 0 1 18.1 26a6.2 6.2 0 0 1-10.5-4.5 6.2 6.2 0 0 1-1.1-10.8A6.2 6.2 0 0 1 16 4.1Zm0 3.7-5.5 3.1v6.3l5.5 3.1 5.5-3.1v-6.3L16 7.8Zm-5.4.9a3.9 3.9 0 0 0-1.7 5.4m14.2 3.8a3.9 3.9 0 0 0 0-6.1m-3.6 11.5a3.9 3.9 0 0 0 5.2-2.7m-13.3 3.1a3.9 3.9 0 0 0 5.2 2.7M8.9 14.1a3.9 3.9 0 0 0-1.6 5.4m15.8-7.7a3.9 3.9 0 0 0-5.2-2.7" /></svg>;
  }
  if (platform === "Claude") {
    return <svg {...common}><path d="m16 2.8 2.2 9.3L25 5.4l-4.6 8.7 9.3-2.3-8.6 4.4 8.7 4.2-9.4-2.1 4.7 8.5-6.9-6.6-2.2 9.1-2.2-9.1-6.9 6.6 4.7-8.5-9.4 2.1 8.7-4.2-8.6-4.4 9.3 2.3-4.6-8.7 6.8 6.7L16 2.8Z" /></svg>;
  }
  if (platform === "Gemini") {
    return <svg {...common}><path d="M16 2.5c1.4 8.2 5.3 12.1 13.5 13.5-8.2 1.4-12.1 5.3-13.5 13.5C14.6 21.3 10.7 17.4 2.5 16 10.7 14.6 14.6 10.7 16 2.5Z" /></svg>;
  }
  if (platform === "DeepSeek") {
    return <svg {...common}><path d="M3.3 17.5c2.4 5.7 7.2 8.7 13.3 8.2 5.1-.4 8.9-3.2 10.9-8.3-3 .9-5.2.4-7-1.3-2.1-2-4.8-3-8-2.8-3.2.2-6.3 1.7-9.2 4.2Zm19.1-4.2c2.1-.5 3.8-2 4.7-4.2-2.2-.4-4.3-.1-6.1 1.2m-9.8 8.3h.1" /><circle cx="11.3" cy="18.6" r="1.1" /></svg>;
  }
  if (platform === "Kimi") {
    return <svg {...common}><rect x="4.5" y="4.5" width="23" height="23" rx="4" /><path d="M11 10v12m0-6 8-6m-6.5 4.9L20 22m1-12h1.5" /></svg>;
  }
  if (platform === "豆包") {
    return <svg {...common}><path d="M16 4.2c6.3 0 11.3 4.4 11.3 10.1 0 5.6-5 10.1-11.3 10.1-1.8 0-3.5-.4-5-1l-5.8 3.2 1.6-5.4a9.6 9.6 0 0 1-2.1-5.9C4.7 8.7 9.7 4.2 16 4.2Z" /><path d="M11.2 14.3h.1m9.4 0h.1M11 18.2c3 1.8 7 1.8 10 0" /></svg>;
  }
  if (platform === "文心一言") {
    return <svg {...common}><path d="M16 4.2c5.6 0 10.1 4 10.1 9 0 4.9-4.5 8.9-10.1 8.9-1.3 0-2.5-.2-3.7-.6l-5.4 3 1.5-4.8a8.4 8.4 0 0 1-2.5-6.5c0-5 4.5-9 10.1-9Z" /><circle cx="12.2" cy="13.2" r="1" /><circle cx="19.8" cy="13.2" r="1" /><path d="M12.1 17c2.3 1.2 5.5 1.2 7.8 0" /></svg>;
  }
  if (platform === "通义千问") {
    return <svg {...common}><path d="M16 3.5a7.4 7.4 0 0 1 7.4 7.4v1.7a7.4 7.4 0 0 1-7.4 7.4H8.8l-4.3 3.8 1.2-5.4a7.3 7.3 0 0 1-2.3-5.3v-2.2A7.4 7.4 0 0 1 10.8 3.5H16Zm0 6.1a4.3 4.3 0 1 1 0 8.6" /><path d="M16 28.5a7.4 7.4 0 0 0 7.4-7.4v-1.7a7.4 7.4 0 0 0-7.4-7.4" /></svg>;
  }
  return <svg {...common}><path d="M16 3.5c6.6 0 12 4.5 12 10.1 0 4.4-3.3 8.1-8 9.5L16 28l-4-4.9c-4.7-1.4-8-5.1-8-9.5C4 8 9.4 3.5 16 3.5Z" /><path d="m11.1 14 3.2 3.1 6.8-7" /></svg>;
}

interface HeroCarouselProps {
  hotline: string;
}

export function HeroCarousel({ hotline }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [progressCycle, setProgressCycle] = useState(0);
  const isCtaHoveredRef = useRef(false);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    if (isCtaHovered) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
      setProgressCycle((current) => current + 1);
    }, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isCtaHovered, progressCycle]);

  const pauseCarousel = () => {
    isCtaHoveredRef.current = true;
    setIsCtaHovered(true);
  };

  const resumeCarousel = () => {
    if (!isCtaHoveredRef.current) return;
    isCtaHoveredRef.current = false;
    setIsCtaHovered(false);
    setProgressCycle((current) => current + 1);
  };

  const selectSlide = (index: number) => {
    setActiveIndex(index);
    setProgressCycle((current) => current + 1);
  };

  return (
    <div className={`hero-carousel${isCtaHovered ? " is-paused" : ""}`}>
      {slides.map((slide, index) => (
        <div
          aria-hidden="true"
          className={`hero-slide-background${activeIndex === index ? " is-active" : ""}`}
          key={slide.title}
          style={{ backgroundImage: `url("${slide.background}")` }}
        >
          {slide.backgroundVideo && (
            <>
              <HeroSlideVideo
                isPlaying={activeIndex === index && !isCtaHovered}
                src={slide.backgroundVideo}
              />
              {index === 1 && <div className="hero-slide-watermark-mask" aria-hidden="true" />}
            </>
          )}
        </div>
      ))}
      <div className="hero-centered" aria-live="polite">
        <p className="hero-kicker">AI READY WEBSITE · GEO OPTIMIZATION</p>
        <h1 key={`title-${activeIndex}`}>{activeSlide.title}</h1>
        <div className="hero-subtitle-slot">
          {activeSlide.subtitle && <p className="hero-subtitle" key={`subtitle-${activeIndex}`}>{activeSlide.subtitle}</p>}
        </div>
        <a
          className="hero-cta"
          href={`tel:${hotline}`}
          onBlur={resumeCarousel}
          onFocus={pauseCarousel}
          onMouseEnter={pauseCarousel}
          onMouseLeave={resumeCarousel}
        >
          <span>{activeSlide.action}</span><b><Icon name="arrow" size={20} /></b>
        </a>
      </div>
      <div className="hero-bottom">
        <div className="hero-support">
          {activeIndex === 1 && (
            <div className="hero-value-points" aria-label="AI友好型官网的核心价值">
              <div><strong>AI可读</strong><span>清晰提取</span></div>
              <div><strong>AI可信</strong><span>权威口径</span></div>
              <div><strong>AI可引用</strong><span>独立知识块</span></div>
              <div><strong>AI可交互</strong><span>MCP 查询</span></div>
            </div>
          )}
          {activeIndex === 2 && (
            <div className="hero-proof hero-proof-centered" aria-label="AI友好型官网的技术交付">
              <div><strong>SSOT</strong><span>单一事实源</span></div>
              <div><strong>Markdown</strong><span>AI 纯净内容</span></div>
              <div><strong>JSON-LD</strong><span>结构化语义标记</span></div>
            </div>
          )}
          {activeIndex === 0 && (
            <div className="hero-ai-platforms" aria-label="兼容的主流AI平台">
              {aiPlatforms.map((platform) => <span key={platform}><AiPlatformLogo platform={platform} />{platform}</span>)}
            </div>
          )}
        </div>
        <div className="hero-pagination" aria-label="Banner 切换">
          {slides.map((slide, index) => (
            <button
              aria-label={`切换到 Banner ${index + 1}：${slide.title}`}
              aria-pressed={activeIndex === index}
              className={activeIndex === index ? "active" : ""}
              key={slide.title}
              onClick={() => selectSlide(index)}
              style={
                activeIndex === index
                  ? ({ "--hero-progress-duration": `${SLIDE_DURATION_MS / 1000}s` } as CSSProperties)
                  : undefined
              }
              type="button"
            >
              <span
                className="hero-pagination-progress"
                key={activeIndex === index ? `active-${progressCycle}` : "idle"}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
