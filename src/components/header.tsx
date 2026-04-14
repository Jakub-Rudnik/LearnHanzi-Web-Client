import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.tsx";
import { NavLink, useLocation } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "@/components/theme-provider.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar.tsx";
import profilePicture from "@/assets/profile-picture.jpeg";
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card.tsx";
import { Kbd } from "@/components/ui/kbd.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer.tsx";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import Logo from "@/components/logo.tsx";
import { ButtonGroup, ButtonGroupSeparator, } from "@/components/ui/button-group.tsx";
import { useTranslation } from "react-i18next";
import en from "@/locales/en/en.json";

type NavigationItem = {
  name: keyof typeof en;
  href: string;
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const languages = [
    { code: "en", label: t("English") },
    { code: "pl", label: t("Polish") },
  ];

  const navigation_items: NavigationItem[] = [
    {
      name: "Home",
      href: "/home",
    },
    {
      name: "Flashcards",
      href: "/flash-cards",
    },
    {
      name: "Dictionary",
      href: "/dictionary",
    },
    {
      name: "Ranking",
      href: "/ranking",
    },
  ];

  return (
    <header className="flex w-full items-center justify-between gap-9 py-4">
      <Logo to="/home" />

      <div className="hidden flex-1 items-center justify-between md:flex">
        <Menu items={navigation_items} />

        <div className="flex items-center justify-center gap-4">
          <HoverCard>
            <HoverCardTrigger>
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
              >
                <HugeiconsIcon
                  icon={theme == "dark" ? Moon02Icon : Sun02Icon}
                />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-min">
              <Kbd>D</Kbd>
            </HoverCardContent>
          </HoverCard>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">{i18n.language}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {languages.map((lng) => (
                  <DropdownMenuItem
                    key={lng.code}
                    onSelect={() => i18n.changeLanguage(lng.code)}
                  >
                    {lng.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={profilePicture} />
                <AvatarFallback>{t("Profile Picture")}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <NavLink to="/profile">{t("Profile")}</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild variant="destructive">
                  <NavLink to="/logout">{t("Logout")}</NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Drawer
        open={open}
        onOpenChange={(val) => setOpen(val)}
        direction="right"
      >
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon-lg" className="md:hidden">
            <HugeiconsIcon icon={Menu01Icon} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col gap-6">
          <DrawerHeader>
            <DrawerTitle>{t("Menu")}</DrawerTitle>
          </DrawerHeader>
          <Menu setOpen={setOpen} items={navigation_items} column={true} />
          <div className="flex flex-col gap-6 p-4">
            <div className="flex items-center justify-start gap-6">
              <Avatar>
                <AvatarImage src={profilePicture} />
                <AvatarFallback>{t("Profile Picture")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-center">
                <p className="font-bold">{t("User")}</p>
                <p className="text-sm font-light">{t("example@example.com")}</p>
              </div>
            </div>
            <ButtonGroup className="w-full">
              <Button asChild variant="ghost" className="flex-1">
                <NavLink
                  onClick={setOpen ? () => setOpen(false) : undefined}
                  to="/profile"
                >
                  {t("Profile")}
                </NavLink>
              </Button>
              <ButtonGroupSeparator />
              <Button asChild variant="destructive" className="flex-1">
                <NavLink
                  onClick={setOpen ? () => setOpen(false) : undefined}
                  to="/logout"
                  end
                >
                  {t("Logout")}
                </NavLink>
              </Button>
            </ButtonGroup>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}

function Menu({
  items,
  column = false,
  setOpen,
}: {
  items: NavigationItem[];
  column?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <NavigationMenu
      viewport={!column}
      className={cn(
        column
          ? "w-full max-w-full items-start p-4 [&>div:first-child]:w-full"
          : "items-center"
      )}
    >
      <NavigationMenuList
        className={cn(column ? "w-full flex-col" : "flex-row", "flex gap-2")}
      >
        {items.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" &&
              location.pathname.startsWith(`${item.href}/`));

          return (
            <NavigationMenuItem
              key={item.href}
              className={cn(column && "w-full")}
            >
              <NavigationMenuLink
                asChild
                active={isActive}
                className={cn(
                  column && "w-full",
                  "font-bold data-active:bg-accent"
                )}
              >
                <NavLink
                  onClick={setOpen ? () => setOpen(false) : undefined}
                  to={item.href}
                  end
                >
                  {t(item.name)}
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
