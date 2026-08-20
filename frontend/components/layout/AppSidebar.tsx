"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS, navVisible } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { getStaticUrl } from "@/lib/static-url";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useCart } from "@/contexts/CartContext";
import type { ApiResponse } from "@/types/api";
import type { LabNotification } from "@/types/notification";

function SidebarUserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const [imgError, setImgError] = useState(false);
  const src = getStaticUrl(avatarUrl);

  if (!src || imgError) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] font-bold text-white shadow-xs text-sm">
        {name?.charAt(0).toUpperCase() || "U"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className="h-10 w-10 shrink-0 rounded-xl object-cover border border-[var(--color-border)]"
    />
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalCount: cartCount } = useCart();
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for unread notifications every 60 seconds
  useEffect(() => {
    if (!user) return;

    async function fetchUnread() {
      try {
        const res = await api.get<ApiResponse<LabNotification[]>>("/notifications?limit=100");
        const count = (res.data ?? []).filter((n) => !n.read).length;
        setUnreadCount(count);
      } catch {
        // Silently ignore — badge is non-critical
      }
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  const main = NAV_ITEMS.filter((i) => i.section === "main" && navVisible(i, user));
  const admin = NAV_ITEMS.filter((i) => i.section === "admin" && navVisible(i, user));
  const footer = NAV_ITEMS.filter((i) => i.section === "footer" && navVisible(i, user));

  function getBadge(id: string) {
    if (id === "notifications") return unreadCount;
    if (id === "cart") return cartCount;
    return 0;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 pb-4">
      <div className="flex flex-col gap-1 sm:gap-2">
        {main.map((item) => (
          <SidebarLink key={item.id} item={item} pathname={pathname} badge={getBadge(item.id)} />
        ))}
      </div>

      {admin.length > 0 ? (
        <div className="flex flex-col gap-1 sm:gap-2">
          <p className="px-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
            Administração
          </p>
          {admin.map((item) => (
            <SidebarLink key={item.id} item={item} pathname={pathname} badge={getBadge(item.id)} />
          ))}
        </div>
      ) : null}

      <hr className="mx-auto w-[85%] border-[var(--color-border)]" />

      <div className="flex flex-col gap-1 sm:gap-2">
        {footer.map((item) => (
          <SidebarLink key={item.id} item={item} pathname={pathname} badge={getBadge(item.id)} />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <ThemeToggle />
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-3 sm:mx-1">
          <div className="flex items-center gap-3">
            <SidebarUserAvatar name={user.name} avatarUrl={user.avatarUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text)]">{user.name}</p>
              <p className={cn("truncate text-xs font-medium capitalize sm:text-sm", user.tag?.colorClass || "text-[var(--color-text-muted)]")}>
                {user.tag?.name || "Sem tag"}
              </p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="mt-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  pathname,
  badge,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
  badge: number;
}) {
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-h-10 w-full max-w-full items-center gap-2 rounded-xl px-2 py-1.5 transition-colors sm:px-3",
        active
          ? "bg-[var(--color-primary)] text-white shadow-sm"
          : "text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] active:bg-azure-200/50"
      )}
    >
      <Image
        src={item.iconSrc}
        alt=""
        width={20}
        height={20}
        className={cn("shrink-0 opacity-80", active && "brightness-0 invert")}
        aria-hidden
      />
      <span className="truncate text-sm font-medium sm:text-[0.9375rem]">{item.label}</span>
      {badge > 0 && (
        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
