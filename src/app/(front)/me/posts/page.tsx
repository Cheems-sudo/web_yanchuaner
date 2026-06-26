"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, Clock, ArrowLeft } from "lucide-react";

type UserPost = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
  createdAt: string;
};

export default function MyPostsPage() {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
      })
      .catch((err) => {
        console.error("Failed to load posts", err);
        toast.error("加载投稿列表失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`确定要撤销并删除投稿《${title}》吗？`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`成功撤销投稿《${title}》`);
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        toast.error(data.error || "撤销失败，请稍后重试");
      }
    } catch (err) {
      console.error("Delete story error:", err);
      toast.error("网络请求失败，请稍后重试");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 pb-24 md:py-16 md:pb-32">
      <Link
        href="/me"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand hover:underline transition"
      >
        <ArrowLeft size={14} />
        返回个人中心
      </Link>
      
      <div className="flex items-center justify-between border-b border-purple-500/10 pb-4 mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-100">我的投稿</h1>
        <span className="text-xs text-slate-400">共 {posts.length} 篇</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-purple-500/20 bg-slate-900/50 p-10 text-center backdrop-blur-xl">
          <p className="text-sm text-slate-400">暂无投稿。</p>
          <div className="mt-4">
            <Link href="/me/submit" className="btn-primary py-2 px-5 text-xs">
              立即去投稿
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const canDelete = post.status === "PENDING" || post.status === "DRAFT";
            
            return (
              <article
                key={post.id}
                className="rounded-2xl border border-purple-500/30 bg-slate-900/50 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(124,58,237,0.08)] transition duration-300 hover:border-purple-400/50 hover:shadow-[0_8px_32px_rgba(124,58,237,0.18)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-[240px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-lg font-bold text-slate-100 leading-snug">
                        {post.title}
                      </h2>
                      
                      {/* 状态标签 */}
                      {post.status === "PENDING" && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400 font-medium">
                          审核中
                        </span>
                      )}
                      {post.status === "PUBLISHED" && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 font-medium">
                          已发布
                        </span>
                      )}
                      {post.status === "REJECTED" && (
                        <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs text-rose-400 font-medium">
                          已驳回
                        </span>
                      )}
                      {post.status === "DRAFT" && (
                        <span className="rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-0.5 text-xs text-slate-400 font-medium">
                          草稿
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        提交时间: {new Date(post.createdAt).toLocaleString("zh-CN")}
                      </span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Trash2 size={13} />
                      {post.status === "PENDING" ? "撤销投稿" : "删除草稿"}
                    </button>
                  )}
                </div>

                {/* 稿件正文预览 */}
                <div className="mt-4 rounded-xl border border-purple-500/20 bg-slate-950/50 p-4 shadow-inner">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300 select-text max-h-[120px] overflow-y-auto">
                    {post.content}
                  </p>
                </div>

                {/* 标签列表 */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-xs text-purple-300/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
