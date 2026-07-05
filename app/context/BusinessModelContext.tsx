"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BusinessModel = "B2B" | "B2C" | "D2C";

interface BusinessModelContextType {
  businessModel: BusinessModel;
  setBusinessModel: (model: BusinessModel) => void;
}

const BusinessModelContext = createContext<BusinessModelContextType | undefined>(undefined);

export function BusinessModelProvider({ children }: { children: React.ReactNode }) {
  const [businessModel, setBusinessModelState] = useState<BusinessModel>("B2B");

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("mkt_ops_business_model") as BusinessModel;
    if (saved && (saved === "B2B" || saved === "B2C" || saved === "D2C")) {
      setBusinessModelState(saved);
    }
  }, []);

  const setBusinessModel = (model: BusinessModel) => {
    setBusinessModelState(model);
    localStorage.setItem("mkt_ops_business_model", model);
  };

  return (
    <BusinessModelContext.Provider value={{ businessModel, setBusinessModel }}>
      {children}
    </BusinessModelContext.Provider>
  );
}

export function useBusinessModel() {
  const context = useContext(BusinessModelContext);
  if (context === undefined) {
    throw new Error("useBusinessModel must be used within a BusinessModelProvider");
  }
  return context;
}
