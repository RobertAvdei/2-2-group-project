"use client";

import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavTabs() {
  const pathname = usePathname()
  
  const [currentTab, changeCurrentTab] = useState(pathname || "/");
  const tabValues = [
    {
      value: "/",
      label: "Prediction",
    },
    {
      value: "/dashboard",
      label: "Dashboard",
    },
    {
      value: "/model",
      label: "Model Info",
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    changeCurrentTab(newValue);
  };

  return (
    <Tabs
      value={currentTab}
      onChange={handleChange}
      aria-label="navigation"
      role="navigation"
    >
      {tabValues.map(({ value, label }) => (
        <Tab
          key={value}
          href={`${value}`}
          sx={{
            textTransform: "none",
            color: "primary.main",
          }}
          value={value}
          label={label}
          LinkComponent={Link}
        ></Tab>
      ))}
    </Tabs>
  );
}
