"use client";

import React from "react";
import { signInWithGitHub } from "@/actions/auth/actions";

interface LoginCardProps {
  error?: string;
}

export default function LoginCard({ error }: LoginCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-darker)] p-4">
      <div className="w-full max-w-md border-4 border-black bg-[var(--primary-light)] p-1">
        <div className="border-2 border-yellow-400 bg-[var(--primary-light)] p-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-black">
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-700 mt-2">
              Use your GitHub account to continue
            </p>
          </div>

          {error && (
            <div className="mt-4 p-2 bg-red-700 text-red-100 font-mono text-xs border-2 border-red-900 rounded">
              {error}
            </div>
          )}

          <form action={signInWithGitHub} className="mt-6">
            <button
              type="submit"
              className="w-full border-4 border-black bg-black p-1"
            >
              <div className="border-2 border-green-400 bg-gray-900 p-2 text-green-400 font-mono text-sm hover:text-green-300 transition">
                ⬢ CONTINUE WITH GITHUB
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
