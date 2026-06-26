"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Feather, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/apiClient";

export default function UserStorySubmitPage() {
  const { user, isLoading } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [storyDate, setStoryDate] = useState("");

  const isAllowed = user && (user.role === 'ADMIN' || (user.role === 'ALUMNI' && user.status === 'VERIFIED'));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("标题和正文不能为空");
      return;
    }

    setSubmitting(true);

    const tags = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      body: body.trim(),
      author: author.trim() || undefined,
      tags,
      date: storyDate || undefined,
    };

    const { data, error } = await api.post<{ story: any }>("/api/stories", payload);

    setSubmitting(false);

    if (data?.story) {
      setSubmitted(true);
      setTitle("");
      setBody("");
      setAuthor("");
      setTagsInput("");
      setStoryDate("");
      toast.success("投稿提交成功！");
    } else {
      toast.error(error || "提交失败，请稍后重试");
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-center text-brand-fg/60">加载中…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 pb-24 md:py-16 md:pb-32">
      <Link
        href="/me"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand hover:underline transition"
      >
        <ArrowLeft size={14} />
        返回个人中心
      </Link>

      {!isAllowed ? (
        <div className="rounded-card border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl p-7 text-center space-y-4">
          <h2 className="text-xl font-bold text-amber-400">⚠️ 投稿权限受限</h2>
          <p className="text-sm leading-6 text-brand-fg/70 max-w-md mx-auto">
            只有通过校友身份认证的用户才能在此提交故事投稿。您当前的认证状态为：
            <strong className="text-brand font-semibold">{user?.status || "未知"}</strong>。
          </p>
          <div className="pt-2">
            <Link href="/me" className="btn-primary py-2 px-5 text-xs">
              返回个人中心查看状态
            </Link>
          </div>
        </div>
      ) : submitted ? (
        <div className="rounded-card border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shadow-inner">
            <CheckCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-emerald-400">✅ 提交成功！</h2>
          <p className="text-sm leading-6 text-brand-fg/70 max-w-md mx-auto">
            您的文章已进入审核队列，请耐心等待管理员批阅。审核通过后将正式发布到“燕中故事”板块。
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary py-2 px-5 text-xs cursor-pointer"
            >
              再次投稿
            </button>
            <Link href="/me" className="btn-secondary py-2 px-5 text-xs">
              回到个人中心
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-card border border-line bg-surface/50 backdrop-blur-xl p-7 shadow-xl"
        >
          <div className="flex items-center gap-2 border-b border-brand/10 pb-3">
            <Feather size={20} className="text-brand" />
            <h1 className="text-xl font-bold font-heading text-brand-fg">
              撰写校友故事投稿
            </h1>
          </div>
          <p className="text-xs text-brand-fg/60">
            分享您的大学体验、备考心路或行业洞察，审核通过后将收录至静态专栏。
          </p>

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-brand-fg">
              文章标题 *
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="例如：大学避坑指南——计算机专业真相"
                className="input mt-1.5 w-full text-sm focus:border-brand/50 focus:ring-brand/35"
                disabled={submitting}
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-xs font-semibold text-brand-fg">
                署名作者 (默认显示您的名字)
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={50}
                  placeholder={user?.name || user?.username || "匿名"}
                  className="input mt-1.5 w-full text-sm focus:border-brand/50 focus:ring-brand/35"
                  disabled={submitting}
                />
              </label>

              <label className="block text-xs font-semibold text-brand-fg">
                故事发生日期
                <input
                  type="date"
                  value={storyDate}
                  onChange={(e) => setStoryDate(e.target.value)}
                  className="input mt-1.5 w-full text-sm focus:border-brand/50 focus:ring-brand/35"
                  disabled={submitting}
                />
              </label>
            </div>

            <label className="block text-xs font-semibold text-brand-fg">
              文章分类标签 (英文或中文逗号分隔)
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="例如：专业真相, 避坑指南, 校园回忆"
                className="input mt-1.5 w-full text-sm focus:border-brand/50 focus:ring-brand/35"
                disabled={submitting}
              />
            </label>

            <label className="block text-xs font-semibold text-brand-fg">
              稿件正文 * (字数不超过20,000字)
              <textarea
                required
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={20000}
                placeholder="请输入稿件正文内容，支持换行..."
                className="input mt-1.5 w-full text-sm focus:border-brand/50 focus:ring-brand/35 resize-y min-h-[240px]"
                disabled={submitting}
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer py-2.5 text-sm"
            >
              <Send size={15} />
              {submitting ? "提交中..." : "提交审核"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
