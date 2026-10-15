"use client";

import { useContactViewModel } from "@/viewmodels/useContactViewModel";
import { Button } from "../ui/Button";
import { TextAreaField, TextField } from "./Field";

export function ContactForm() {
  const vm = useContactViewModel();

  return (
    <form className="form card" onSubmit={vm.onSubmit} noValidate>
      {vm.state.status === "success" ? (
        <div className="form__alert" role="status">
          {vm.state.receipt.message}
        </div>
      ) : null}
      {vm.state.status === "error" ? (
        <div className="form__alert form__alert--error" role="alert">
          {vm.state.message}
        </div>
      ) : null}

      <div className="form__row">
        <TextField
          label="Full name"
          value={vm.form.fullName}
          onChange={(value) => vm.setField("fullName", value)}
          error={vm.fieldError("fullName")}
          autoComplete="name"
          required
        />
        <TextField
          label="Phone (optional)"
          type="tel"
          value={vm.form.phone}
          onChange={(value) => vm.setField("phone", value)}
          error={vm.fieldError("phone")}
          autoComplete="tel"
        />
      </div>
      <TextField
        label="Email"
        type="email"
        value={vm.form.email}
        onChange={(value) => vm.setField("email", value)}
        error={vm.fieldError("email")}
        autoComplete="email"
        required
      />
      <TextField
        label="Subject"
        value={vm.form.subject}
        onChange={(value) => vm.setField("subject", value)}
        error={vm.fieldError("subject")}
        required
      />
      <TextAreaField
        label="Message"
        rows={5}
        value={vm.form.message}
        onChange={(value) => vm.setField("message", value)}
        error={vm.fieldError("message")}
        required
      />

      <Button type="submit" block disabled={vm.isSubmitting}>
        {vm.isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
