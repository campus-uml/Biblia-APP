"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Button } from "@/components/ui/button"
import type { AuthError } from "@supabase/supabase-js"
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa"

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (provider: "google" | "github" | "discord") => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      })
      if (error) throw error
    } catch (error) {
      const authError = error as AuthError
      alert(authError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Iniciar sesión</h1>
        <div className="space-y-4">
          <Button
            onClick={() => handleLogin("google")}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            <FaGoogle className="mr-2" />
            Iniciar sesión con Google
          </Button>
          <Button
            onClick={() => handleLogin("github")}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-900"
          >
            <FaGithub className="mr-2" />
            Iniciar sesión con GitHub
          </Button>
          <Button
            onClick={() => handleLogin("discord")}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600"
          >
            <FaDiscord className="mr-2" />
            Iniciar sesión con Discord
          </Button>
        </div>
      </div>
    </div>
  )
}

