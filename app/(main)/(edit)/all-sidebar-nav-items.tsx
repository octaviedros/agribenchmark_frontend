type SidebarNavItems = { 
  [key: string]: { 
    title: string; 
    url: string; 
    items?: { 
      title: string; 
      url: string; 
    }[]
  }[]
}

export const allSidebarNavItems: SidebarNavItems  = {
  "pig": [
    {
      title: "1. Overall farm data",
      url: "/edit/pig/basic-information",
      items: [
        {
          title: "1.1 Basic information",
          url: "/edit/pig/basic-information",
        }
      ]
    },
    {
      title: "Account",
      url: "/edit/pig/account",
    },
    {
      title: "Appearance",
      url: "/edit/pig/appearance",
    },
    {
      title: "Notifications",
      url: "/edit/pig/notifications",
    },
    {
      title: "Display",
      url: "/edit/forms/display",
    },
  ]
}