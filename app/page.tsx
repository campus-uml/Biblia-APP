"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { obtenerLibros, obtenerCapitulos, obtenerContenidoCapitulo } from "@/lib/biblia-api"
import type { Libro, Capitulo } from "@/lib/tipos"
import Image from "next/image"

export default function PaginaPrincipal() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [libroSeleccionado, setLibroSeleccionado] = useState<string>("")
  const [nombreLibroSeleccionado, setNombreLibroSeleccionado] = useState<string>("")
  const [capitulos, setCapitulos] = useState<Capitulo[]>([])
  const [capituloSeleccionado, setCapituloSeleccionado] = useState<string>("")
  const [contenidoCapitulo, setContenidoCapitulo] = useState<string>("")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    cargarLibros()
  }, [])

  const cargarLibros = async () => {
    try {
      setCargando(true)
      setError("")
      const librosObtenidos = await obtenerLibros()
      setLibros(librosObtenidos)
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

  const manejarCambioLibro = (valor: string) => {
    setLibroSeleccionado(valor)
    const libro = libros.find((l) => l.id === valor)
    setNombreLibroSeleccionado(libro?.nameLong || libro?.name || "")
    setCapituloSeleccionado("")
    setContenidoCapitulo("")
    cargarCapitulos(valor)
  }

  const manejarCambioCapitulo = (valor: string) => {
    setCapituloSeleccionado(valor)
    cargarContenidoCapitulo(valor)
  }

  const formatearContenido = (contenido: string) => {
    return contenido.replace(/<verse number="(\d+)">(.+?)<\/verse>/g, (match, number, text) => {
      return `<span class="verse"><span class="verse-number">${number}</span>${text}</span>`
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg flex items-center justify-center p-6">
          <div>
            <CardTitle className="text-center text-4xl font-bold tracking-tight">Santa Biblia</CardTitle>
            <p className="text-center text-indigo-100 mt-2">Reina Valera 1909</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {error && <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Seleccionar Libro</label>
                <Select onValueChange={manejarCambioLibro} disabled={cargando}>
                  <SelectTrigger className="border-2 border-indigo-200 focus:border-indigo-500 transition-colors">
                    <SelectValue placeholder="Selecciona un libro" />
                  </SelectTrigger>
                  <SelectContent>
                    {libros.map((libro) => (
                      <SelectItem key={libro.id} value={libro.id}>
                        {libro.nameLong || libro.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {libroSeleccionado && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Seleccionar Capítulo</label>
                  <Select onValueChange={manejarCambioCapitulo} disabled={cargando}>
                    <SelectTrigger className="border-2 border-indigo-200 focus:border-indigo-500 transition-colors">
                      <SelectValue placeholder="Selecciona un capítulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {capitulos.map((capitulo) => (
                        <SelectItem key={capitulo.id} value={capitulo.id}>
                          Capítulo {capitulo.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {nombreLibroSeleccionado && capituloSeleccionado && (
              <h2 className="text-2xl font-semibold text-center mt-6 text-indigo-800">
                {nombreLibroSeleccionado} - Capítulo {capitulos.find((c) => c.id === capituloSeleccionado)?.number}
              </h2>
            )}

            {contenidoCapitulo && (
              <ScrollArea className="h-[60vh] mt-6 rounded-md border-2 border-indigo-100 p-6 bg-white shadow-inner">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div
                    dangerouslySetInnerHTML={{ __html: formatearContenido(contenidoCapitulo) }}
                    className="bible-content"
                  />
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
