"use client";

import { useState, type FormEvent } from "react";
import { useApiSubmit } from "@/hooks/useApiSubmit";
import type { BookingInput, SubmissionReceipt } from "@/models/submission";

export function useBookingViewModel(serviceTitles: string[], defaultService?: string) {
  const emptyForm = (): BookingInput => ({
    fullName: "",
    phone: "",
    device: "",
    service: defaultService ?? serviceTitles[0] ?? "",
    preferredAt: "",
    problem: "",
  });

  const [form, setForm] = useState<BookingInput>(emptyForm);
  const { state, submit, reset } = useApiSubmit<SubmissionReceipt>("submitBooking");

  const setField = (field: keyof BookingInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (state.status !== "submitting") reset();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const receipt = await submit(form);
    if (receipt) setForm((current) => ({ ...emptyForm(), service: current.service }));
  };

  return {
    form,
    setField,
    onSubmit,
    state,
    isSubmitting: state.status === "submitting",
    fieldError: (field: keyof BookingInput) =>
      state.status === "error" ? state.issues[field] : undefined,
  };
}
