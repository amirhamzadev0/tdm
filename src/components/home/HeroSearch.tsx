"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function HeroSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  };

  return (
    <form className="hero__search" onSubmit={onSubmit} role="search">
      <label className="visually-hidden" htmlFor="hero-search">
        Search devices
      </label>
      <input
        id="hero-search"
        className="hero__search-input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
      />
      <button type="submit" className="btn btn--primary btn--small">
        Search
      </button>
    </form>
  );
}
