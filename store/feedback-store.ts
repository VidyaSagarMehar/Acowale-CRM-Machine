"use client";

import { create } from "zustand";

import type { FeedbackCategory } from "@/types/feedback";

type FeedbackStore = {
  search: string;
  category: FeedbackCategory | "all";
  page: number;
  setSearch: (value: string) => void;
  setCategory: (value: FeedbackCategory | "all") => void;
  setPage: (value: number) => void;
};

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  search: "",
  category: "all",
  page: 1,
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPage: (page) => set({ page })
}));
