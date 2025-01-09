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

export const allSidebarNavItems: SidebarNavItems = {
  "pig": [{
    title: "1 Operational data",
    url: "",
    items: [
      {
        title: "1.1 Farm overview",
        url: "/edit/pig/basic-information",
      },
      {
        title: "1.2 Machinery on the farm",
        url: "",
      },
      {
        title: "1.3 Buildings and facilities",
        url: "",
      },
      {
        title: "1.4 Labor force and wages",
        url: "",
      },
      {
        title: "1.5 Liabilities and interest rates",
        url: "",
      },
      {
        title: "1.6 Profit and capital structure",
        url: "",
      },
      {
        title: "1.7 Information on owners (taxes, consumption)",
        url: "",
      },
      {
        title: "1.8 Fixed costs and other farm income",
        url: "",
      },
    ],
  },
  {
    title: "2 Arable land and forage production",
    url: "",
    items: [
      {
        title: "2.1 Available land and land prices",
        url: "",
      },
      {
        title: "2.2 Cultivation ratio, yields, prices and compensation payments",
        url: "",
      },
      {
        title: "2.3 Variable costs in arable farming and forage production",
        url: "",
      },
      {
        title: "2.4 Mineral fertilizer use and nutrient balance",
        url: "",
      },
      {
        title: "2.5 Feed prices and dry matter content",
        url: "",
      }
    ],
  },
  {
    title: "10 Data for the breeding sow sector",
    url: "",
    items: [
      {
        title: "10.1 Herd and performance data",
        url: "",
      },
      {
        title: "10.2 Prices",
        url: "",
      },
      {
        title: "10.3 Costs",
        url: "",
      },
      {
        title: "10.4 Feeding",
        url: "",
      },
      {
        title: "10.5 Feed rations",
        url: "",
      }
    ],
  },
  {
    title: "11 Fattening pig husbandry",
    url: "",
    items: [
      {
        title: "11.1 Herd and performance data",
        url: "",
      },
      {
        title: "11.2 Prices",
        url: "",
      },
      {
        title: "11.3 Costs",
        url: "",
      },
      {
        title: "11.4 Feeding(per fattening period)",
        url: "",
      },
      {
        title: "11.5 Feed rations",
        url: "",
      }
    ],
  },
  {
    title: "12 Labor allocation sow and pig finishing enterprise",
    url: "",
  }
  ]
}