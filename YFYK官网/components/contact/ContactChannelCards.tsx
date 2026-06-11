import { contactChannels, type ContactChannel } from "@/lib/content/contact";

function ChannelIcon({ name }: { name: ContactChannel["icon"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "business") {
    return (
      <svg {...common}>
        <path d="M4 19V5h16v14" />
        <path d="M8 9h8M8 13h5" />
        <path d="M9 5V3h6v2" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ContactChannelCards() {
  return (
    <div className="contact-channel-list">
      {contactChannels.map((channel) => (
        <article className="contact-channel-card" key={channel.id} data-reveal>
          <div className="contact-channel-head">
            <span className="contact-channel-icon">
              <ChannelIcon name={channel.icon} />
            </span>
            <div>
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
            </div>
          </div>

          <div className="contact-channel-meta">
            {channel.email ? (
              <p>
                <span>邮箱</span>
                <a href={`mailto:${channel.email}`}>{channel.email}</a>
              </p>
            ) : null}
            {channel.phone ? (
              <p>
                <span>电话</span>
                <b>{channel.phone}</b>
              </p>
            ) : null}
            {channel.showWechat ? (
              <div className="contact-wechat-block">
                <span>微信</span>
                <div className="contact-wechat-placeholder" aria-label="微信二维码占位">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h2v3h-2zM18 18h1v1h-1z" fill="currentColor" />
                  </svg>
                  <small>扫码添加</small>
                </div>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
