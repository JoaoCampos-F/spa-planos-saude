type MenuChildren = {
  icon: string;
  title: string;
  to: string;
  permission?: string | string[];
};

  type SidebarMenu = {
    title: string;
    icon: string;
    to?: string;
    permission?: string | string[];
    role?: string;
    children?: Array<MenuChildren>;
  };

  type AppbarMenu = {
    title: string;
    to?: string;
    role: string;
    menu: Array<SidebarMenu>;
    permission?: string | string[];
  };

export type { SidebarMenu, AppbarMenu };
