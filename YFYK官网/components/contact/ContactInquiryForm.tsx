"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useContactModal } from "@/components/contact/ContactModalContext";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { submitLead } from "@/lib/api";
import {
  contactNeedOptions,
  contactServiceInfo,
  type ContactNeedType,
} from "@/lib/content/contact";
import { inferSourceModule, resolveSourcePageTitle } from "@/lib/lead-source";

type FormState = {
  name: string;
  company: string;
  contact: string;
  needType: ContactNeedType | "";
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  company: "",
  contact: "",
  needType: "",
  message: "",
};

type ContactInquiryFormProps = {
  variant?: "page" | "modal";
};

export function ContactInquiryForm({ variant = "page" }: ContactInquiryFormProps) {
  const pathname = usePathname();
  const { source: modalSource, closeContactModal, showContactToast } = useContactModal();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (variant !== "page" || !toastOpen) return;
    const timer = window.setTimeout(() => setToastOpen(false), 3000);
    return () => window.clearTimeout(timer);
  }, [variant, toastOpen]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "请输入您的姓名";
    if (!form.contact.trim()) next.contact = "请输入联系方式";
    if (!form.needType) next.needType = "请选择需求类型";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastVariant(type);
    setToastOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    const needLabel =
      contactNeedOptions.find((option) => option.value === form.needType)?.label ?? form.needType;

    const sourceModule =
      variant === "page"
        ? "contact-page-form"
        : inferSourceModule(pathname, modalSource?.sourceModule);

    const sourceButtonText =
      variant === "page" ? "提交咨询" : modalSource?.sourceButtonText ?? "提交咨询";

    setSubmitting(true);
    try {
      const result = await submitLead({
        name: form.name.trim(),
        companyName: form.company.trim() || undefined,
        contact: form.contact.trim(),
        demandType: needLabel,
        message: form.message.trim() || undefined,
        sourcePage: pathname || "/",
        sourcePageTitle: resolveSourcePageTitle(pathname || "/"),
        sourceModule,
        sourceButtonText,
      });
      if (variant === "modal") {
        closeContactModal();
        showContactToast(result.message, "success");
      } else {
        showToast(result.message, "success");
      }
      setForm(initialState);
    } catch {
      const errorMessage = "提交失败，请稍后再试或通过电话联系我们。";
      if (variant === "modal") {
        showContactToast(errorMessage, "error");
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const titleId = variant === "modal" ? "contact-inquiry-modal-title" : undefined;

  return (
    <>
      {variant === "page" ? (
        <Toast
          open={toastOpen}
          message={toastMessage}
          variant={toastVariant}
          onClose={() => setToastOpen(false)}
        />
      ) : null}
      <article
        className="contact-form-card"
        id={variant === "page" ? "contact-form" : undefined}
        data-reveal={variant === "page" ? true : undefined}
      >
        <header className="contact-form-head">
          <h3 id={titleId}>告诉我们您的需求</h3>
          <p>提交需求后，我们将在 1 个工作日内与您联系。</p>
          <p className="contact-form-service">
            <span>
              服务电话：
              <a href={`tel:${contactServiceInfo.phone}`}>{contactServiceInfo.phone}</a>
            </span>
            <span>服务时间：{contactServiceInfo.serviceHours}</span>
          </p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-form-grid">
            <div className="contact-form-field">
              <Label htmlFor="contact-name">姓名</Label>
              <Input
                id="contact-name"
                name="name"
                placeholder="请输入您的姓名"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                disabled={submitting}
              />
              {errors.name ? <p className="contact-form-error">{errors.name}</p> : null}
            </div>

            <div className="contact-form-field">
              <Label htmlFor="contact-company">公司名称</Label>
              <Input
                id="contact-company"
                name="company"
                placeholder="请输入企业名称"
                value={form.company}
                onChange={(event) => updateField("company", event.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="contact-form-field">
              <Label htmlFor="contact-info">联系方式</Label>
              <Input
                id="contact-info"
                name="contact"
                placeholder="手机号 / 微信 / 邮箱"
                value={form.contact}
                onChange={(event) => updateField("contact", event.target.value)}
                aria-invalid={Boolean(errors.contact)}
                disabled={submitting}
              />
              {errors.contact ? <p className="contact-form-error">{errors.contact}</p> : null}
            </div>

            <div className="contact-form-field">
              <Label htmlFor="contact-need">需求类型</Label>
              <Select
                id="contact-need"
                name="needType"
                value={form.needType}
                onChange={(event) =>
                  updateField("needType", event.target.value as ContactNeedType | "")
                }
                aria-invalid={Boolean(errors.needType)}
                disabled={submitting}
              >
                <option value="" disabled>
                  请选择需求类型
                </option>
                {contactNeedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {errors.needType ? <p className="contact-form-error">{errors.needType}</p> : null}
            </div>
          </div>

          <div className="contact-form-field">
            <Label htmlFor="contact-message">留言内容</Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="请简单描述您的需求、网站地址或希望解决的问题。"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="contact-form-actions">
            <button className="button contact-form-submit" type="submit" disabled={submitting}>
              {submitting ? "提交中..." : "提交咨询"} {!submitting ? <Icon name="arrow" size={17} /> : null}
            </button>
            <p className="contact-form-note">提交后我们将在 1 个工作日内与您联系。</p>
          </div>
        </form>
      </article>
    </>
  );
}
