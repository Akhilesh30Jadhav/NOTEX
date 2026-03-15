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
      <div className="mx-auto mt-3 w-[min(1120px,calc(100%-1rem))] rounded-xl border border-white/10 bg-zinc-950/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="relative mx-auto min-h-14 px-3 sm:px-4 flex gap-3 lg:grid lg:grid-cols-3 items-center">
          <div className="justify-start items-center gap-2 lg:flex hidden flex-row">
            <NavigationMenu className="flex justify-start items-start">
              <NavigationMenuList className="flex justify-start gap-1 flex-row">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.href ? (
                      <NavigationMenuLink asChild>
                        <Link to={item.href}>
                          <Button variant="ghost" className="text-sm text-neutral-300 hover:text-white">
                            {item.title}
                          </Button>
                        </Link>
                      </NavigationMenuLink>
                    ) : (
                      <>
                        <NavigationMenuTrigger className="font-medium text-sm text-neutral-300 hover:text-white">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="!w-[430px] p-4">
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
                                    className="flex flex-row justify-between items-center hover:bg-white/5 text-neutral-300 hover:text-white py-2 px-4 rounded"
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

          <div className="flex lg:justify-center items-center">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold text-[10px]">
                NX
              </div>
              <p className="font-semibold text-white text-lg tracking-tight">NOTEX</p>
            </Link>
          </div>

          <div className="hidden lg:flex justify-end w-full gap-2 items-center">
            <Button variant="ghost" onClick={onToggleTheme} className="text-neutral-300 hover:text-white">
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>

            {user ? (
              <>
                <Button variant="ghost" className="text-neutral-300 hover:text-white" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" className="text-neutral-300 hover:text-white" asChild>
                  <Link to="/profile">{user?.name || "Profile"}</Link>
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex w-12 shrink lg:hidden items-end justify-end ml-auto">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            {isOpen && (
              <div className="absolute top-14 border-t border-white/10 flex flex-col w-full right-0 bg-zinc-950/95 backdrop-blur-xl shadow-lg py-4 px-4 gap-6 rounded-b-xl">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <div className="flex flex-col gap-2">
                      {item.href ? (
                        <Link to={item.href} className="flex justify-between items-center text-white">
                          <span className="text-base">{item.title}</span>
                          <MoveRight className="w-4 h-4 stroke-1 text-neutral-400" />
                        </Link>
                      ) : (
                        <p className="text-base text-white">{item.title}</p>
                      )}
                      {item.items &&
                        item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.href}
                            className="flex justify-between items-center"
                          >
                            <span className="text-neutral-400">{subItem.title}</span>
                            <MoveRight className="w-4 h-4 stroke-1 text-neutral-400" />
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <Button variant="ghost" onClick={onToggleTheme} className="justify-start text-neutral-300 hover:text-white">
                    {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                  </Button>
                  {user ? (
                    <>
                      <Button variant="ghost" className="justify-start text-neutral-300 hover:text-white" asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                      <Button variant="ghost" className="justify-start text-neutral-300 hover:text-white" asChild>
                        <Link to="/profile">Profile</Link>
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={onLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link to="/login">Sign in</Link>
                      </Button>
                      <Button className="justify-start" asChild>
                        <Link to="/register">Get started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-[4.5rem]" />
    </header>
  );
}

export { Header1 };
