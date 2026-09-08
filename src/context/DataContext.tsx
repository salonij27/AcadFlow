import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import type { Assignment, Submission, NotificationItem } from "@/types";
import { getEffectiveStatus, generateId } from "@/utils/helpers";

interface DataContextValue {
  assignments: Assignment[];
  submissions: Submission[];
  notifications: NotificationItem[];
  createAssignment: (data: Omit<Assignment, "id" | "status" | "createdBy" | "createdById"> & { createdBy: string; createdById: string }) => void;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  duplicateAssignment: (id: string) => void;
  markCompleted: (assignmentId: string, studentId: string, studentName: string, rollNumber: string) => void;
  saveGrade: (assignmentId: string, studentId: string, grade: number, feedback: string) => void;
  addNotification: (n: Omit<NotificationItem, "id" | "date" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const rawAssignments = useLiveQuery<Assignment[], Assignment[]>(() => db.assignments.toArray(), [], []);
  const rawSubmissions = useLiveQuery<Submission[], Submission[]>(() => db.submissions.toArray(), [], []);
  const rawNotifications = useLiveQuery<NotificationItem[], NotificationItem[]>(() => db.notifications.toArray(), [], []);

  // Apply effective status (overdue calculation) on the live data
  const assignments: Assignment[] = (rawAssignments || []).map((a: Assignment) => ({
    ...a,
    status: getEffectiveStatus(a),
  }));
  const submissions: Submission[] = rawSubmissions || [];
  const notifications: NotificationItem[] = rawNotifications || [];

  const createAssignment: DataContextValue["createAssignment"] = useCallback(async (data) => {
    try {
      const newAssignment: Assignment = {
        ...data,
        id: generateId("a"),
        status: "pending",
      };
      await db.assignments.add(newAssignment);
    } catch (err) {
      console.error("Failed to create assignment:", err);
    }
  }, []);

  const updateAssignment = useCallback(async (id: string, data: Partial<Assignment>) => {
    try {
      await db.assignments.update(id, data);
    } catch (err) {
      console.error("Failed to update assignment:", err);
    }
  }, []);

  const deleteAssignment = useCallback(async (id: string) => {
    try {
      await db.assignments.delete(id);
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  }, []);

  const duplicateAssignment = useCallback(async (id: string) => {
    try {
      const orig = await db.assignments.get(id);
      if (!orig) return;
      const copy: Assignment = {
        ...orig,
        id: generateId("a"),
        title: `${orig.title} (Copy)`,
        status: "pending",
      };
      await db.assignments.add(copy);
    } catch (err) {
      console.error("Failed to duplicate assignment:", err);
    }
  }, []);

  const markCompleted: DataContextValue["markCompleted"] = useCallback(
    async (assignmentId, studentId, studentName, rollNumber) => {
      try {
        await db.assignments.update(assignmentId, { status: "completed" });

        const existing = await db.submissions
          .where("assignmentId")
          .equals(assignmentId)
          .and((s) => s.studentId === studentId)
          .first();

        if (existing) {
          await db.submissions.update(existing.id, {
            status: "submitted",
            submissionDate: new Date().toISOString().split("T")[0],
          });
        } else {
          await db.submissions.add({
            id: generateId("sub"),
            assignmentId,
            studentId,
            studentName,
            rollNumber,
            submissionDate: new Date().toISOString().split("T")[0],
            status: "submitted",
          });
        }
      } catch (err) {
        console.error("Failed to mark assignment completed:", err);
      }
    },
    []
  );

  const saveGrade = useCallback(
    async (assignmentId: string, studentId: string, grade: number, feedback: string) => {
      try {
        const existing = await db.submissions
          .where("assignmentId")
          .equals(assignmentId)
          .and((s) => s.studentId === studentId)
          .first();

        if (existing) {
          await db.submissions.update(existing.id, {
            status: "graded",
            grade,
            feedback,
          });
        }
      } catch (err) {
        console.error("Failed to save grade:", err);
      }
    },
    []
  );

  const addNotification: DataContextValue["addNotification"] = useCallback(async (n) => {
    try {
      await db.notifications.add({
        ...n,
        id: generateId("n"),
        date: new Date().toISOString().split("T")[0],
        read: false,
      });
    } catch (err) {
      console.error("Failed to add notification:", err);
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await db.notifications.update(id, { read: true });
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async (userId: string) => {
    try {
      const userNotifs = await db.notifications.where("userId").equals(userId).toArray();
      await Promise.all(userNotifs.map((n) => db.notifications.update(n.id, { read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        assignments,
        submissions,
        notifications,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        duplicateAssignment,
        markCompleted,
        saveGrade,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
