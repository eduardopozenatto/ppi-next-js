"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS, navVisible } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const main = NAV_ITEMS.filter((i) => i.section === "main" && navVisible(i, user));
  const admin = NAV_ITEMS.filter((i) => i.section === "admin" && navVisible(i, user));
  const footer = NAV_ITEMS.filter((i) => i.section === "footer" && navVisible(i, user));

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 pb-4">
      <div className="flex flex-col gap-1 sm:gap-2">
        {main.map((item) => (
          <SidebarLink key={item.id} item={item} pathname={pathname} />
        ))}
      </div>

      {admin.length > 0 ? (
        <div className="flex flex-col gap-1 sm:gap-2">
          <p className="px-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
            Administração
          </p>
          {admin.map((item) => (
            <SidebarLink key={item.id} item={item} pathname={pathname} />
          ))}
        </div>
      ) : null}

      <hr className="mx-auto w-[85%] border-[var(--color-border)]" />

      <div className="flex flex-col gap-1 sm:gap-2">
        {footer.map((item) => (
          <SidebarLink key={item.id} item={item} pathname={pathname} />
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-3 sm:mx-1">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 rounded-xl bg-[var(--color-bg-subtle)] p-2">
            <Image
              src="/buttonIcons/exit-account.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--color-text)]">{user.name}</p>
            <p className={cn("truncate text-xs font-medium capitalize sm:text-sm", user.tag.colorClass)}>
              {user.tag.name}
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
  );
}

function SidebarLink({
  item,
  pathname,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
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
    </Link>
  );
}
