"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { obtenerLibros, obtenerCapitulos, obtenerContenidoCapitulo } from "@/lib/biblia-api"
import type { Libro, Capitulo } from "@/lib/tipos"

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

  useEffect(() => {
    cargarLibros()
  }, [])

  useEffect(() => {
    setLibrosFiltrados(
      libros.filter(libro => 
        libro.name.toLowerCase().includes(busquedaLibro.toLowerCase()) || 
        (libro.nameLong && libro.nameLong.toLowerCase().includes(busquedaLibro.toLowerCase()))
      )
    );
  }, [busquedaLibro, libros])

  const cargarLibros = async () => {
    try {
      setCargando(true)
      setError("")
      const librosObtenidos = await obtenerLibros()
      setLibros(librosObtenidos)
      setLibrosFiltrados(librosObtenidos)
    } catch (error) {
      setError("Error al cargar los libros. Intenta de nuevo.")
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
    } catch (error) {
      setError("Error al cargar los capítulos. Intenta de nuevo.")
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
      setError("Error al cargar el contenido del capítulo. Intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  const seleccionarLibro = (libro: Libro) => {
    setLibroSeleccionado(libro)
    setCapituloSeleccionado(null)
    setContenidoCapitulo("")
    setBusquedaLibro("")
    cargarCapitulos(libro.id)
  }

  const seleccionarCapitulo = (capitulo: Capitulo) => {
    setCapituloSeleccionado(capitulo)
    setCapitulos([]) // Ocultar capítulos después de seleccionar uno
    cargarContenidoCapitulo(capitulo.id)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-center text-4xl font-bold tracking-tight">Santa Biblia</CardTitle>
          <p className="text-center text-indigo-100 mt-2">Reina Valera 1909</p>
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
                      <Button key={libro.id} variant="ghost" className="w-full justify-start" onClick={() => seleccionarLibro(libro)}>
                        {libro.nameLong || libro.name}
                      </Button>
                    ))}
                  </ScrollArea>
                )}
              </div>

              {libroSeleccionado && !capituloSeleccionado && (
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
                    {capitulos.map((capitulo) => (
                      <Button key={capitulo.id} variant="ghost" className="w-full justify-start" onClick={() => seleccionarCapitulo(capitulo)}>
                        Capítulo {capitulo.number}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>

            {capituloSeleccionado && contenidoCapitulo && (
              <div className="mt-6 bg-white p-4 rounded-md shadow">
                <h2 className="text-2xl font-semibold text-indigo-800 text-center">
                  {libroSeleccionado?.nameLong || libroSeleccionado?.name} - Capítulo {capituloSeleccionado.number}
                </h2>
                <p className="mt-4 text-gray-700">{contenidoCapitulo}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}