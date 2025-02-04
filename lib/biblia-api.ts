const API_KEY = process.env.PUBLIC_BIBLE_API_KEY
const API_URL = "https://api.scripture.api.bible/v1/bibles"
const BIBLE_ID = "592420522e16049f-01" // Reina Valera 1909

import type { Libro, Capitulo } from "./tipos"

// Función auxiliar para crear los headers
const getHeaders = () => {
  if (!API_KEY) {
    throw new Error("API_KEY no está definida")
  }
  return {
    "api-key": API_KEY,
  }
}

export async function obtenerLibros(): Promise<Libro[]> {
  try {
    const response = await fetch(`${API_URL}/${BIBLE_ID}/books`, {
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error("Error al obtener los libros")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching books:", error)
    throw error
  }
}

export async function obtenerCapitulos(idLibro: string): Promise<Capitulo[]> {
  try {
    const response = await fetch(`${API_URL}/${BIBLE_ID}/books/${idLibro}/chapters`, {
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error("Error al obtener los capítulos")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching chapters:", error)
    throw error
  }
}

export async function obtenerContenidoCapitulo(idCapitulo: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/${BIBLE_ID}/chapters/${idCapitulo}?content-type=text`, {
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error("Error al obtener el contenido del capítulo")
    }

    const data = await response.json()
    return data.data.content
  } catch (error) {
    console.error("Error fetching chapter content:", error)
    throw error
  }
}