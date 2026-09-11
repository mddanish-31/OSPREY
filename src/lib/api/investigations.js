/**
 * OSPREY Frontend API Client — Investigation Service
 *
 * Provides typed, error-resilient client methods for communicating with
 * the OSPREY FastAPI backend Investigation endpoints.
 */

const getApiBaseUrl = () => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "");
  }
  return "http://127.0.0.1:8000";
};

export class ApiError extends Error {
  constructor(message, status = 0, detail = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Helper to execute HTTP requests with unified error parsing and network protection.
 */
async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = null;
      let errorMessage = `Request failed with status ${response.status}`;

      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorJson;

        if (typeof errorDetail === "string") {
          errorMessage = errorDetail;
        } else if (Array.isArray(errorDetail)) {
          // FastAPI / Pydantic 422 validation errors array
          errorMessage = errorDetail
            .map((err) => (err.msg ? `${err.loc?.slice(-1)[0] || "Field"}: ${err.msg}` : JSON.stringify(err)))
            .join("; ");
        } else if (errorDetail && typeof errorDetail === "object") {
          errorMessage = errorDetail.message || JSON.stringify(errorDetail);
        }
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, errorDetail);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network errors (e.g. connection refused, CORS network fail)
    throw new ApiError(
      `Cannot connect to OSPREY backend at ${baseUrl}. Ensure the FastAPI server is running.`,
      0,
      err.message
    );
  }
}

/**
 * List paginated investigations.
 *
 * @param {object} params
 * @param {number} [params.page=1] - Page number starting from 1
 * @param {number} [params.pageSize=20] - Page size (max 100)
 * @returns {Promise<{items: Array<object>, total: number}>}
 */
export async function listInvestigations({ page = 1, pageSize = 20 } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return request(`/api/v1/investigations?${query.toString()}`, {
    method: "GET",
  });
}

/**
 * Fetch a single investigation by UUID.
 *
 * @param {string} investigationId - UUID of the investigation
 * @returns {Promise<object>}
 */
export async function getInvestigation(investigationId) {
  if (!investigationId) {
    throw new ApiError("Investigation ID is required", 400);
  }
  return request(`/api/v1/investigations/${investigationId}`, {
    method: "GET",
  });
}

/**
 * Create a new investigation record with optional GeoJSON Polygon.
 *
 * @param {object} payload
 * @param {string} payload.name - Required non-empty title/name
 * @param {string} [payload.description] - Optional incident notes
 * @param {string} [payload.status="active"] - Investigation status
 * @param {object|null} [payload.geometry] - Optional GeoJSON Polygon
 * @returns {Promise<object>} Created investigation object
 */
export async function createInvestigation({
  name,
  description = null,
  status = "active",
  geometry = null,
}) {
  return request("/api/v1/investigations", {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      status,
      geometry,
    }),
  });
}

/**
 * Check backend service health status.
 *
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  return request("/api/v1/health", { method: "GET" });
}

/**
 * Check backend database connectivity health status.
 *
 * @returns {Promise<object>}
 */
export async function checkDbHealth() {
  return request("/api/v1/health/db", { method: "GET" });
}

/**
 * List all satellite scenes associated with an investigation.
 *
 * @param {string} investigationId - UUID of the parent investigation
 * @returns {Promise<{items: Array<object>, total: number}>}
 */
export async function listSatelliteScenes(investigationId) {
  if (!investigationId) {
    throw new ApiError("Investigation ID is required", 400);
  }
  return request(`/api/v1/investigations/${investigationId}/satellite-scenes`, {
    method: "GET",
  });
}

/**
 * Fetch a single satellite scene by UUID.
 *
 * @param {string} sceneId - UUID of the satellite scene
 * @returns {Promise<object>}
 */
export async function getSatelliteScene(sceneId) {
  if (!sceneId) {
    throw new ApiError("Satellite Scene ID is required", 400);
  }
  return request(`/api/v1/satellite-scenes/${sceneId}`, {
    method: "GET",
  });
}

/**
 * Create/ingest a new Sentinel-1 satellite scene for an investigation.
 *
 * @param {string} investigationId - UUID of parent investigation
 * @param {object} payload - Satellite scene metadata and footprint
 * @returns {Promise<object>} Created satellite scene object
 */
export async function createSatelliteScene(investigationId, payload) {
  if (!investigationId) {
    throw new ApiError("Investigation ID is required", 400);
  }
  return request(`/api/v1/investigations/${investigationId}/satellite-scenes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Search Copernicus Data Space Ecosystem (CDSE) catalog for real Sentinel-1 products
 * intersecting the active investigation AOI.
 *
 * @param {string} investigationId - UUID of parent investigation
 * @param {object} payload - Query parameters (start_datetime, end_datetime, limit, product_type, etc.)
 * @returns {Promise<{source: string, results: Array<object>, count: number, has_more: boolean}>}
 */
export async function searchSentinel1Scenes(investigationId, payload) {
  if (!investigationId) {
    throw new ApiError("Investigation ID is required", 400);
  }
  return request(`/api/v1/investigations/${investigationId}/satellite-scenes/search`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Ingest authoritative Sentinel-1 metadata and footprint from CDSE by official Product ID.
 *
 * @param {string} investigationId - UUID of parent investigation
 * @param {object} payload - Import payload containing source_product_id
 * @returns {Promise<object>} Created satellite scene object with METADATA_IMPORTED status
 */
export async function importSentinel1Scene(investigationId, payload) {
  if (!investigationId) {
    throw new ApiError("Investigation ID is required", 400);
  }
  return request(`/api/v1/investigations/${investigationId}/satellite-scenes/import`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Authenticated download and integrity verification of a Sentinel-1 product binary from CDSE.
 *
 * @param {string} sceneId - UUID of the imported satellite scene
 * @returns {Promise<object>} Download result with READY_FOR_PROCESSING status and verification metadata
 */
export async function downloadSatelliteScene(sceneId) {
  if (!sceneId) {
    throw new ApiError("Satellite scene ID is required", 400);
  }
  return request(`/api/v1/satellite-scenes/${sceneId}/download`, {
    method: "POST",
  });
}


