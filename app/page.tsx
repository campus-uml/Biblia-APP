"use client"

import { useState, useEffect } from "react"
import { obtenerLibros, obtenerCapitulos, obtenerContenidoCapitulo } from "@/lib/biblia-api"
import type { Libro, Capitulo } from "@/lib/tipos"
import { supabase } from "@/lib/supabase"
import { LogOut } from "lucide-react"
import Link from "next/link"
import Login from "@/components/Login"
import type { Session } from "@supabase/supabase-js"
import type React from "react" // Added import for React

export default function Home() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [librosFiltrados, setLibrosFiltrados] = useState<Libro[]>([])
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null)
  const [capitulos, setCapitulos] = useState<Capitulo[]>([])
  const [capituloSeleccionado, setCapituloSeleccionado] = useState<Capitulo | null>(null)
  const [contenidoCapitulo, setContenidoCapitulo] = useState<string>("")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string>("")
  const [busquedaLibro, setBusquedaLibro] = useState("")
  const [busquedaCapitulo, setBusquedaCapitulo] = useState("")
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      cargarLibros()
    }
  }, [session])

  const cargarLibros = async () => {
    setCargando(true)
    try {
      const librosObtenidos = await obtenerLibros()
      setLibros(librosObtenidos)
      setLibrosFiltrados(librosObtenidos)
      setCargando(false)
    } catch (error) {
      setError("Error al cargar los libros")
      setCargando(false)
    }
  }

  const handleBuscarLibro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaLibro(event.target.value)
    const filtro = event.target.value.toLowerCase()
    setLibrosFiltrados(libros.filter((libro) => libro.nombre.toLowerCase().includes(filtro)))
  }

  const handleSeleccionarLibro = async (libro: Libro) => {
    setLibroSeleccionado(libro)
    setCargando(true)
    try {
      const capitulosObtenidos = await obtenerCapitulos(libro.id)
      setCapitulos(capitulosObtenidos)
      setCargando(false)
    } catch (error) {
      setError("Error al cargar los capítulos")
      setCargando(false)
    }
  }

  const handleSeleccionarCapitulo = async (capitulo: Capitulo) => {
    setCapituloSeleccionado(capitulo)
    setCargando(true)
    try {
      const contenido = await obtenerContenidoCapitulo(capitulo.id)
      setContenidoCapitulo(contenido)
      setCargando(false)
    } catch (error) {
      setError("Error al cargar el contenido del capítulo")
      setCargando(false)
    }
  }

  const handleBuscarCapitulo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaCapitulo(event.target.value)
  }

  const handleLogout = () => {
    supabase.auth.signOut()
  }

  if (cargando && !session) {
    return <div>Cargando...</div>
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Bienvenido a la <span className="text-blue-600">Biblia App</span>
        </h1>

        <p className="mt-3 text-2xl">Comienza tu estudio bíblico aquí</p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link
            href="/biblia"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Leer la Biblia &rarr;</h3>
            <p className="mt-4 text-xl">Explora los libros y capítulos de la Biblia.</p>
          </Link>

          <button
            onClick={handleLogout}
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <LogOut className="h-6 w-6 inline mr-2" />
            <h3 className="text-2xl font-bold">Cerrar Sesión &rarr;</h3>
          </button>
        </div>
      </main>
    </div>
  )
}

