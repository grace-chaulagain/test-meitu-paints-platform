import { api, getApiErrorMessage } from "../../api/client.js";

function unwrap(response) {
  return response?.data || {};
}

function throwApiError(error, fallback) {
  throw new Error(getApiErrorMessage(error, fallback));
}

// ----------------------------
// Dispatcher applications
// ----------------------------

export async function createDispatcherApplication(payload = {}) {
  try {
    const res = await api.post("/api/dispatchers/apply", payload);
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to submit dispatcher application");
  }
}

export async function getDispatcherApplications(params = {}) {
  try {
    const res = await api.get("/api/admin/dispatcher-applications", {
      params,
    });
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to load dispatcher applications");
  }
}

// ----------------------------
// Admin dispatcher management
// ----------------------------

export async function getDispatchers(params = {}) {
  try {
    const res = await api.get("/api/admin/dispatchers", { params });
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to load dispatchers");
  }
}

export async function getVerifiedDispatchers(params = {}) {
  try {
    const res = await api.get("/api/admin/dispatchers/verified", { params });
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to load verified dispatchers");
  }
}

export async function getDispatcherById(dispatcherId) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.get(`/api/admin/dispatchers/${dispatcherId}`);
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to load dispatcher details");
  }
}

export async function createDispatcher(payload = {}) {
  try {
    const res = await api.post("/api/admin/dispatchers", payload);
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to create dispatcher");
  }
}

export async function updateDispatcher(dispatcherId, payload = {}) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.patch(
      `/api/admin/dispatchers/${dispatcherId}`,
      payload,
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to update dispatcher");
  }
}

export async function verifyDispatcher(dispatcherId, payload = {}) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.patch(
      `/api/admin/dispatchers/${dispatcherId}/verify`,
      payload,
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to verify dispatcher");
  }
}

export async function rejectDispatcher(dispatcherId, payload = {}) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.patch(
      `/api/admin/dispatchers/${dispatcherId}/reject`,
      payload,
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to reject dispatcher");
  }
}

export async function setDispatcherActive(dispatcherId, isActive) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.patch(
      `/api/admin/dispatchers/${dispatcherId}/active`,
      {
        isActive: Boolean(isActive),
      },
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to update dispatcher status");
  }
}

export async function deleteDispatcher(dispatcherId, payload = {}) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.delete(`/api/admin/dispatchers/${dispatcherId}`, {
      data: payload,
    });
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to schedule dispatcher deletion");
  }
}

export async function undoDispatcherDeletion(dispatcherId) {
  try {
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.post(
      `/api/admin/dispatchers/${dispatcherId}/undo-delete`,
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to undo dispatcher deletion");
  }
}

// ----------------------------
// Dealer routing helpers
// ----------------------------

export async function assignDispatcherToDealer(dealerId, dispatcherId) {
  try {
    if (!dealerId) {
      throw new Error("Dealer ID is required");
    }
    if (!dispatcherId) {
      throw new Error("Dispatcher ID is required");
    }

    const res = await api.post(
      `/api/admin/dealers/${dealerId}/assign-dispatcher`,
      {
        dispatcherId,
      },
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to assign dispatcher to dealer");
  }
}

export async function unassignDispatcherFromDealer(dealerId) {
  try {
    if (!dealerId) {
      throw new Error("Dealer ID is required");
    }

    const res = await api.post(
      `/api/admin/dealers/${dealerId}/unassign-dispatcher`,
    );
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to unassign dispatcher from dealer");
  }
}

export async function updateDealerRouting(
  dealerId,
  { fulfillmentMode, dispatcherId = null } = {},
) {
  try {
    if (!dealerId) {
      throw new Error("Dealer ID is required");
    }
    if (!fulfillmentMode) {
      throw new Error("Fulfillment mode is required");
    }

    const res = await api.patch(`/api/admin/dealers/${dealerId}/routing`, {
      fulfillmentMode,
      dispatcherId,
    });
    return unwrap(res);
  } catch (error) {
    throwApiError(error, "Failed to update dealer routing");
  }
}

// ----------------------------
// Convenience filters
// ----------------------------

export async function getPendingDispatchers(params = {}) {
  return getDispatchers({ ...params, status: "PENDING" });
}

export async function getRejectedDispatchers(params = {}) {
  return getDispatchers({ ...params, status: "REJECTED" });
}
