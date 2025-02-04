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
    title: "1 Whole Farm Data",
    url: "",
    items: [
      {
        title: "1.1 Farm Overview",
        url: "/edit/pig/basic-information",
      },
      {
        title: "1.2 Machinery and Equipment",
        url: "/edit/pig/machinery-equipment",
      },
      {
        title: "1.3 Buildings and Facilities",
        url: "/edit/pig/buildings",
      },
      {
        title: "1.4 Labor Input and Wages",
        url: "/edit/pig/labor-input-wages",
      },
      {
        title: "1.5 Liabilities and Interest rates",
        url: "/edit/pig/liabilities-interest-rates",
      },
      /*{
        title: "1.6 Profit and Capital Structure",
        url: "/edit/pig/profit-capital-structure",
      },
      {
        title: "1.7 Information on Farm Ownership",
        url: "/edit/pig/farm-ownership",
      },*/
      {
        title: "1.6 Overhead Costs",
        url: "/edit/pig/overhead-costs",
      },
    ],
  },
  {
    title: "2 Data on Crop and Forage Production",
    url: "",
    items: [
      {
        title: "2.1 Available Acreage and Prices",
        url: "/edit/pig/data-crop-forage",
      },
      {
        title: "2.2 Land use, Yields, Prices and direct payments",
        url: "/edit/pig/land-use",
      },
      {
        title: "2.3 Variable Costs of Crop and Forage Production",
        url: "/edit/pig/variable-costs-crop",
      },
      /*{
        title: "2.4 Mineral balance and fertilizer input",
        url: "/edit/pig/mineral-balance",
      },*/
      {
        title: "2.4 Prices for Feed and Dry Matter Content",
        url: "/edit/pig/feed-prices",
      }
    ],
  },
  {
    title: "3 Data on Feed Production",
    url: "",
    items: [
      {
        title: "3.1 Feed Production",
        url: "/edit/pig/feed-production",
      }
    ],
  },
  {
    title: "10 Data for the Sow Enterprise",
    url: "",
    items: [
      {
        title: "10.1 Livestock and Performance Data",
        url: "/edit/pig/data-sow-enterprise",
      },
      {
        title: "10.2 Prices",
        url: "/edit/pig/sow-prices",
      },
      {
        title: "10.3 Costs",
        url: "/edit/pig/sow-costs",
      },
      {
        title: "10.4 Feeding",
        url: "/edit/pig/sow-feeding",
      },
      {
        title: "10.5 Feed Rations",
        url: "/edit/pig/sow-feed-rations",
      }
    ],
  },
  {
    title: "11 Data for the Pig Finishing Enterprise",
    url: "",
    items: [
      {
        title: "11.1 Livestock and Performance data",
        url: "/edit/pig/data-pig-finishing",
      },
      {
        title: "11.2 Prices",
        url: "/edit/pig/finishing-prices",
      },
      {
        title: "11.3 Costs",
        url: "/edit/pig/finishing-costs",
      },
      {
        title: "11.4 Feeding",
        url: "/edit/pig/finishing-feeding",
      },
      {
        title: "11.5 Feed Rations",
        url: "/edit/pig/finishing-feed-rations",
      }
    ],
  },
  {
    title: "12 Labor Allocation Sow and Pig Finishing Enterprise",
    url: "",
    items: [
      {
        title: "12.1 Labor Allocation",
        url: "/edit/pig/labor-allocation",
      }
    ],
  }
  ]
}