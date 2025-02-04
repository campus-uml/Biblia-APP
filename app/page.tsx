"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { obtenerLibros, obtenerCapitulos, obtenerContenidoCapitulo } from "@/lib/biblia-api"
import type { Libro, Capitulo } from "@/lib/tipos"
import { supabase } from "@/lib/supabase"
import { Book, ChevronRight, LogOut } from "lucide-react"
import Login from "@/components/Login"
import type { Session } from "@supabase/supabase-js"

export default function PaginaPrincipal() {
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

  useEffect(() => {
    const filtrados = libros.filter(
      (libro) =>
        libro.name.toLowerCase().includes(busquedaLibro.toLowerCase()) ||
        (libro.nameLong && libro.nameLong.toLowerCase().includes(busquedaLibro.toLowerCase())),
    )
    setLibrosFiltrados(filtrados)
  }, [busquedaLibro, libros])

  const cargarLibros = async () => {
    try {
      setCargando(true)
      setError("")
      const librosObtenidos = await obtenerLibros()
      setLibros(librosObtenidos)
      setLibrosFiltrados(librosObtenidos)
    } catch (error) {
      setError("Error al cargar los libros. Por favor, intenta de nuevo.")
      console.error("Error:", error)
    } finally {
      setCargando(false)
    }
  }

  const cargarCapitulos = async (idLibro: string) => {
    try {
      setCargando(true)
      setError("")
      const capitulosObtenidos = await obtenerCapitulos(idLibro)
      setCapitulos(capitulosObtenidos)
      setBusquedaCapitulo("")
    } catch (error) {
      setError("Error al cargar los capítulos. Por favor, intenta de nuevo.")
      console.error("Error:", error)
    } finally {
      setCargando(false)
    }
  }

  const cargarContenidoCapitulo = async (idCapitulo: string) => {
    try {
      setCargando(true)
      setError("")
      const contenido = await obtenerContenidoCapitulo(idCapitulo)
      setContenidoCapitulo(contenido)
    } catch (error) {
      setError("Error al cargar el contenido. Por favor, intenta de nuevo.")
      console.error("Error:", error)
    } finally {
      setCargando(false)
    }
  }

  const seleccionarLibro = (libro: Libro) => {
    setLibroSeleccionado(libro)
    cargarCapitulos(libro.id)
    setBusquedaLibro("")
    setCapituloSeleccionado(null)
    setContenidoCapitulo("")
  }

  const seleccionarCapitulo = (capitulo: Capitulo) => {
    setCapituloSeleccionado(capitulo)
    cargarContenidoCapitulo(capitulo.id)
  }

  const formatearContenido = (contenido: string) => {
    if (contenido.includes("<verse")) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(contenido, "text/html")
      const verses = doc.querySelectorAll("verse")
      let formattedContent = ""

      verses.forEach((verse) => {
        const number = verse.getAttribute("number")
        const text = verse.textContent?.trim()
        formattedContent += `
          <p class="verse">
            <span class="verse-number">${number}</span>
            <span class="verse-text">${text}</span>
          </p>
        `
      })

      return formattedContent
    }
    return contenido
  }

  if (!session) {
    return <Login />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg relative">
          <CardTitle className="text-center text-4xl font-bold tracking-tight">Santa Biblia</CardTitle>
          <p className="text-center text-indigo-100 mt-2">Reina Valera 1909</p>
          <Button
            onClick={() => supabase.auth.signOut()}
            className="absolute top-4 right-4 bg-white text-indigo-600 hover:bg-indigo-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {error && <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Buscar Libro</label>
                <Input
                  type="text"
                  placeholder="Buscar libro..."
                  value={busquedaLibro}
                  onChange={(e) => setBusquedaLibro(e.target.value)}
                  className="mb-2"
                />
                {busquedaLibro && (
                  <ScrollArea className="h-40 border rounded-md p-2">
                    {librosFiltrados.map((libro) => (
                      <Button
                        key={libro.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => seleccionarLibro(libro)}
                      >
                        <Book className="w-4 h-4 mr-2" />
                        {libro.nameLong || libro.name}
                      </Button>
                    ))}
                  </ScrollArea>
                )}
                {libroSeleccionado && (
                  <p className="mt-2 font-medium">
                    Libro seleccionado: {libroSeleccionado.nameLong || libroSeleccionado.name}
                  </p>
                )}
              </div>

              {libroSeleccionado && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Buscar Capítulo</label>
                  <Input
                    type="text"
                    placeholder="Buscar capítulo..."
                    value={busquedaCapitulo}
                    onChange={(e) => setBusquedaCapitulo(e.target.value)}
                    className="mb-2"
                  />
                  <ScrollArea className="h-40 border rounded-md p-2">
                    {capitulos
                      .filter((cap) => cap.number.toString().includes(busquedaCapitulo))
                      .map((capitulo) => (
                        <Button
                          key={capitulo.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => seleccionarCapitulo(capitulo)}
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          Capítulo {capitulo.number}
                        </Button>
                      ))}
                  </ScrollArea>
                </div>
              )}
            </div>

            {libroSeleccionado && capituloSeleccionado && (
              <h2 className="text-2xl font-semibold text-center mt-6 text-indigo-800">
                {libroSeleccionado.nameLong || libroSeleccionado.name} - Capítulo {capituloSeleccionado.number}
              </h2>
            )}

            {contenidoCapitulo && (
              <ScrollArea className="h-[60vh] mt-6 rounded-md border-2 border-indigo-100 bg-white shadow-inner">
                <div className="bible-content">
                  <div dangerouslySetInnerHTML={{ __html: formatearContenido(contenidoCapitulo) }} />
                </div>
              </ScrollArea>
            )}

            {cargando && (
              <div className="text-center py-8">
                <div
                  className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Cargando...
                  </span>
                </div>
                <p className="mt-4 text-lg text-indigo-600">Cargando...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

