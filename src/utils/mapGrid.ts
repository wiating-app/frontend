import { LatLngBounds } from 'leaflet'
import { Bounds } from '../api/getPoints'

/**
 * Grid cell sizes in degrees.
 * Using different sizes for latitude and longitude to make cells more square-like.
 * At mid-latitudes (e.g., 50°), 1° longitude ≈ 0.64 × 1° latitude in distance,
 * so we use a larger longitude cell size to compensate.
 */
const GRID_CELL_SIZE_LAT = 2.0 // Latitude cell size (north-south)
const GRID_CELL_SIZE_LNG = 3.0 // Longitude cell size (east-west)

/**
 * Rounds a coordinate down to the nearest grid cell boundary
 */
function roundDownToGrid(value: number, cellSize: number): number {
  return Math.floor(value / cellSize) * cellSize
}

/**
 * Rounds a coordinate up to the nearest grid cell boundary
 */
function roundUpToGrid(value: number, cellSize: number): number {
  return Math.ceil(value / cellSize) * cellSize
}

/**
 * Gets the grid cell ID for given coordinates.
 * The cell ID is the southwest corner coordinates rounded to grid boundaries.
 * Format: "lat,lng" (e.g., "50.0,16.0")
 */
export function getGridCellId(lat: number, lng: number): string {
  const cellLat = roundDownToGrid(lat, GRID_CELL_SIZE_LAT)
  const cellLng = roundDownToGrid(lng, GRID_CELL_SIZE_LNG)
  return `${cellLat},${cellLng}`
}

/**
 * Parses a grid cell ID and returns the southwest corner coordinates
 */
function parseGridCellId(cellId: string): { lat: number; lng: number } {
  const [lat, lng] = cellId.split(',').map(Number)
  return { lat, lng }
}

/**
 * Gets the bounds for a grid cell given its cell ID.
 * Returns bounds in the format expected by getPoints API
 */
export function getGridCellBounds(cellId: string): Bounds {
  const { lat, lng } = parseGridCellId(cellId)
  return {
    bottom_left: {
      lat,
      lon: lng,
    },
    top_right: {
      lat: lat + GRID_CELL_SIZE_LAT,
      lon: lng + GRID_CELL_SIZE_LNG,
    },
  }
}

/**
 * Gets all grid cells that are visible (intersect) with the given map bounds.
 * Returns an array of grid cell IDs.
 */
export function getVisibleGridCells(bounds: LatLngBounds): string[] {
  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()

  // Round to grid boundaries to find the range of cells
  const minLat = roundDownToGrid(southWest.lat, GRID_CELL_SIZE_LAT)
  const maxLat = roundUpToGrid(northEast.lat, GRID_CELL_SIZE_LAT)
  const minLng = roundDownToGrid(southWest.lng, GRID_CELL_SIZE_LNG)
  const maxLng = roundUpToGrid(northEast.lng, GRID_CELL_SIZE_LNG)

  const cells: string[] = []

  // Handle longitude wrapping at -180/180 boundary
  // If the bounds cross the date line, we need to handle it specially
  if (minLng > maxLng) {
    // Crosses the date line - split into two ranges
    // From minLng to 180
    for (let lat = minLat; lat < maxLat; lat += GRID_CELL_SIZE_LAT) {
      for (let lng = minLng; lng <= 180; lng += GRID_CELL_SIZE_LNG) {
        cells.push(`${lat},${lng}`)
      }
    }
    // From -180 to maxLng
    for (let lat = minLat; lat < maxLat; lat += GRID_CELL_SIZE_LAT) {
      for (let lng = -180; lng < maxLng; lng += GRID_CELL_SIZE_LNG) {
        cells.push(`${lat},${lng}`)
      }
    }
  } else {
    // Normal case - no date line crossing
    for (let lat = minLat; lat < maxLat; lat += GRID_CELL_SIZE_LAT) {
      for (let lng = minLng; lng < maxLng; lng += GRID_CELL_SIZE_LNG) {
        cells.push(`${lat},${lng}`)
      }
    }
  }

  return cells
}
