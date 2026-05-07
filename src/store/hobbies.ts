import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Hobby, Milestone, Session } from "@/types/hobbies";

interface HobbiesState {
  hobbies: Hobby[];

  addHobby: (
    data: Omit<Hobby, "id" | "milestones" | "sessions" | "createdAt">
  ) => string;
  updateHobby: (id: string, patch: Partial<Hobby>) => void;
  deleteHobby: (id: string) => void;

  addMilestone: (hobbyId: string, title: string) => void;
  toggleMilestone: (hobbyId: string, milestoneId: string) => void;
  updateMilestone: (
    hobbyId: string,
    milestoneId: string,
    patch: Partial<Milestone>
  ) => void;
  removeMilestone: (hobbyId: string, milestoneId: string) => void;

  addSession: (hobbyId: string, session: Omit<Session, "id">) => void;
  removeSession: (hobbyId: string, sessionId: string) => void;
}

export const useHobbiesStore = create<HobbiesState>()(
  persist(
    (set) => ({
      hobbies: [],

      addHobby: (data) => {
        const id = nanoid();
        set((s) => ({
          hobbies: [
            {
              id,
              name: data.name,
              icon: data.icon,
              accentColor: data.accentColor,
              description: data.description,
              milestones: [],
              sessions: [],
              createdAt: new Date().toISOString(),
            },
            ...s.hobbies,
          ],
        }));
        return id;
      },

      updateHobby: (id, patch) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      deleteHobby: (id) =>
        set((s) => ({ hobbies: s.hobbies.filter((h) => h.id !== id) })),

      addMilestone: (hobbyId, title) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) =>
            h.id === hobbyId
              ? {
                  ...h,
                  milestones: [
                    ...h.milestones,
                    {
                      id: nanoid(),
                      title,
                      done: false,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : h
          ),
        })),

      toggleMilestone: (hobbyId, milestoneId) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) =>
            h.id === hobbyId
              ? {
                  ...h,
                  milestones: h.milestones.map((m) =>
                    m.id === milestoneId
                      ? {
                          ...m,
                          done: !m.done,
                          doneAt: !m.done ? new Date().toISOString() : undefined,
                        }
                      : m
                  ),
                }
              : h
          ),
        })),

      updateMilestone: (hobbyId, milestoneId, patch) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) =>
            h.id === hobbyId
              ? {
                  ...h,
                  milestones: h.milestones.map((m) =>
                    m.id === milestoneId ? { ...m, ...patch } : m
                  ),
                }
              : h
          ),
        })),

      removeMilestone: (hobbyId, milestoneId) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) =>
            h.id === hobbyId
              ? {
                  ...h,
                  milestones: h.milestones.filter((m) => m.id !== milestoneId),
                }
              : h
          ),
        })),

      addSession: (hobbyId, session) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) =>
            h.id === hobbyId
              ? {
                  ...h,
                  sessions: [
                    { ...session, id: nanoid() },
                    ...h.sessions,
                  ],
                }
              : h
          ),
        })),

      removeSession: (hobbyId, sessionId) =>
        set((s) => ({
          hobbies: s.hobbies.map((h) =>
            h.id === hobbyId
              ? {
                  ...h,
                  sessions: h.sessions.filter((x) => x.id !== sessionId),
                }
              : h
          ),
        })),
    }),
    {
      name: "pd.hobbies.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
