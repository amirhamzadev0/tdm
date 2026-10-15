"use client";

import { useState, type FormEvent } from "react";
import { useApiSubmit } from "@/hooks/useApiSubmit";
import type { ContactInput, SubmissionReceipt } from "@/models/submission";

const EMPTY_FORM: ContactInput = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function useContactViewModel() {
  const [form, setForm] = useState<ContactInput>(EMPTY_FORM);
  const { state, submit, reset } = useApiSubmit<SubmissionReceipt>("submitContact");

  const setField = (field: keyof ContactInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (state.status !== "submitting") reset();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const receipt = await submit(form);
    if (receipt) setForm(EMPTY_FORM);
  };

  return {
    form,
    setField,
    onSubmit,
    state,
    isSubmitting: state.status === "submitting",
    fieldError: (field: keyof ContactInput) =>
      state.status === "error" ? state.issues[field] : undefined,
  };
}
