const API_KEY = "7648df66a8283f2572bcc2f3f5680b0a"
const API_URL = "https://api.scripture.api.bible/v1/bibles"
const BIBLE_ID = "592420522e16049f-01" // Reina Valera 1909

import type { Libro, Capitulo } from "./tipos"

export async function obtenerLibros(): Promise<Libro[]> {
  try {
    const response = await fetch(`${API_URL}/${BIBLE_ID}/books`, {
      headers: {
        "api-key": API_KEY,
      },
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
      headers: {
        "api-key": API_KEY,
      },
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
      headers: {
        "api-key": API_KEY,
      },
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

