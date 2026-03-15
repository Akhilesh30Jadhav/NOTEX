// @ts-nocheck
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Header1({ user, theme, onToggleTheme, onLogout }) {
  const navigationItems = [
    { title: "Home", href: "/", description: "" },
    { title: "Materials", href: "/materials", description: "" },
    {
      title: "Features",
      description: "Useful academic tools",
      items: [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Forum", href: "/forum" },
        { title: "Chat", href: "/chat" },
        { title: "Videos", href: "/videos" },
        { title: "CGPA", href: "/cgpa" },
        { title: "Attendance", href: "/attendance" },
      ],
    },
    { title: "About", href: "/about", description: "" },
    { title: "Contact", href: "/contact", description: "" },
  ];

  const [isOpen, setOpen] = useState(false);

  return (
    <header className="w-full z-40 fixed top-0 left-0">
      <div className="mx-auto mt-3 w-[min(1180px,calc(100%-1rem))] rounded-2xl border border-white/10 bg-zinc-950/86 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
        <div className="relative h-16 px-4 sm:px-5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
              NX
            </div>
            <p className="font-semibold text-white text-lg tracking-tight">NOTEX</p>
          </Link>

          <div className="hidden lg:flex items-center min-w-0">
            <NavigationMenu className="flex justify-start items-start">
              <NavigationMenuList className="flex justify-start gap-1.5 flex-row">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.href ? (
                      <NavigationMenuLink asChild>
                        <Link to={item.href}>
                          <Button variant="ghost" className="h-9 px-3.5 text-[14px] text-neutral-300 hover:text-white rounded-lg">
                            {item.title}
                          </Button>
                        </Link>
                      </NavigationMenuLink>
                    ) : (
                      <>
                        <NavigationMenuTrigger className="h-9 px-3.5 text-[14px] font-medium text-neutral-300 hover:text-white rounded-lg">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="!w-[440px] p-4 border border-white/10 bg-zinc-950 text-white">
                          <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                            <div className="flex flex-col h-full justify-between">
                              <div className="flex flex-col">
                                <p className="text-base text-white">{item.title}</p>
                                <p className="text-neutral-400 text-sm">{item.description}</p>
                              </div>
                              <Button size="sm" className="mt-8" asChild>
                                <Link to="/register">Get started</Link>
                              </Button>
                            </div>
                            <div className="flex flex-col text-sm h-full justify-end">
                              {item.items?.map((subItem) => (
                                <NavigationMenuLink key={subItem.title} asChild>
                                  <Link
                                    to={subItem.href}
                                    className="flex flex-row justify-between items-center hover:bg-white/5 text-neutral-300 hover:text-white py-2 px-4 rounded-lg"
                                  >
                                    <span>{subItem.title}</span>
                                    <MoveRight className="w-4 h-4 text-neutral-400" />
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Button variant="ghost" onClick={onToggleTheme} className="h-9 w-9 p-0 text-neutral-300 hover:text-white rounded-lg">
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>

            {user ? (
              <>
                <Button variant="ghost" className="h-9 px-3 text-neutral-300 hover:text-white rounded-lg" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Link to="/profile" className="flex items-center gap-2 pl-1 text-neutral-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium max-w-[110px] truncate">{user?.name || "Profile"}</span>
                </Link>
                <Button variant="ghost" className="h-9 px-3 text-neutral-300 hover:text-red-300 rounded-lg" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="h-9 px-3 text-neutral-300 hover:text-white rounded-lg" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button className="h-9 px-4" asChild>
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex w-10 shrink lg:hidden items-center justify-end ml-auto">
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {isOpen && (
            <div className="absolute top-16 left-0 right-0 border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-lg py-4 px-4 gap-6 rounded-b-2xl lg:hidden">
              <div className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    {item.href ? (
                      <Link to={item.href} className="flex justify-between items-center py-1.5 text-white" onClick={() => setOpen(false)}>
                        <span className="text-base">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-neutral-400" />
                      </Link>
                    ) : (
                      <>
                        <p className="text-base text-white py-1.5">{item.title}</p>
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.href}
                            className="flex justify-between items-center py-1.5 pl-3"
                            onClick={() => setOpen(false)}
                          >
                            <span className="text-neutral-400">{subItem.title}</span>
                            <MoveRight className="w-4 h-4 stroke-1 text-neutral-400" />
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-2">
                <Button variant="ghost" onClick={onToggleTheme} className="justify-start text-neutral-300 hover:text-white">
                  {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                </Button>
                {user ? (
                  <>
                    <Button variant="ghost" className="justify-start text-neutral-300 hover:text-white" asChild>
                      <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-neutral-300 hover:text-white" asChild>
                      <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-red-300 hover:text-red-200" onClick={onLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start text-neutral-300 hover:text-white" asChild>
                      <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
                    </Button>
                    <Button className="justify-start" asChild>
                      <Link to="/register" onClick={() => setOpen(false)}>Get started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-[5rem]" />
    </header>
  );
}

export { Header1 };
