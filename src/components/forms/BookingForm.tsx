"use client";

import { useBookingViewModel } from "@/viewmodels/useBookingViewModel";
import { Button } from "../ui/Button";
import { SelectField, TextAreaField, TextField } from "./Field";

interface BookingFormProps {
  serviceTitles: string[];
  defaultService?: string;
}

export function BookingForm({ serviceTitles, defaultService }: BookingFormProps) {
  const vm = useBookingViewModel(serviceTitles, defaultService);

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

      <TextField
        label="Your name"
        value={vm.form.fullName}
        onChange={(value) => vm.setField("fullName", value)}
        error={vm.fieldError("fullName")}
        autoComplete="name"
        required
      />
      <TextField
        label="Phone number"
        type="tel"
        value={vm.form.phone}
        onChange={(value) => vm.setField("phone", value)}
        error={vm.fieldError("phone")}
        autoComplete="tel"
        required
      />
      <TextField
        label="Device"
        placeholder="e.g. iPhone 13, HP Pavilion 15"
        value={vm.form.device}
        onChange={(value) => vm.setField("device", value)}
        error={vm.fieldError("device")}
        required
      />
      <SelectField
        label="Service"
        options={serviceTitles}
        value={vm.form.service}
        onChange={(value) => vm.setField("service", value)}
        error={vm.fieldError("service")}
        required
      />
      <TextField
        label="Preferred date and time"
        type="datetime-local"
        value={vm.form.preferredAt}
        onChange={(value) => vm.setField("preferredAt", value)}
        error={vm.fieldError("preferredAt")}
        required
      />
      <TextAreaField
        label="Describe the problem"
        value={vm.form.problem}
        onChange={(value) => vm.setField("problem", value)}
        error={vm.fieldError("problem")}
      />

      <Button type="submit" block disabled={vm.isSubmitting}>
        {vm.isSubmitting ? "Sending…" : "Confirm booking"}
      </Button>
    </form>
  );
}
