import {
  createDispatcherApplication,
  getAllDispatchers,
  getPendingDispatchers,
  getDispatcherById,
  verifyDispatcher,
  rejectDispatcher,
  listVerifiedDispatchers,
  getMyDispatcherProfile,
  listMyAssignedDealers,
  listMyOrders,
  getMyOrderById,
  verifyAssignedOrder,
  rejectAssignedOrder,
  amendAssignedOrder,
  listMyOrderArchive,
} from "../services/dispatcher.service.js";
import { deleteDispatcher as scheduleDispatcherDeletion } from "../services/admin.service.js";

/* ---------------------------------------
   Public Dispatcher Application
---------------------------------------- */

export async function createDispatcherApplicationController(req, res, next) {
  try {
    const dispatcher = await createDispatcherApplication(req.body || {});

    return res.status(201).json({
      ok: true,
      message: "Dispatcher application submitted successfully.",
      item: dispatcher,
    });
  } catch (error) {
    next(error);
  }
}

/* ---------------------------------------
   Admin Dispatcher Management
---------------------------------------- */

export async function listDispatchersController(req, res, next) {
  try {
    const items = await getAllDispatchers(req.query || {});

    return res.status(200).json({
      ok: true,
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function listPendingDispatchersController(req, res, next) {
  try {
    const items = await getPendingDispatchers();

    return res.status(200).json({
      ok: true,
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDispatcherByIdController(req, res, next) {
  try {
    const { dispatcherId } = req.params;
    const item = await getDispatcherById(dispatcherId);

    return res.status(200).json({
      ok: true,
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function approveDispatcherController(req, res, next) {
  try {
    const { dispatcherId } = req.params;
    const item = await verifyDispatcher(dispatcherId, req.body || {});

    return res.status(200).json({
      ok: true,
      message: "Dispatcher verified successfully.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectDispatcherController(req, res, next) {
  try {
    const { dispatcherId } = req.params;
    const item = await rejectDispatcher(dispatcherId, req.body || {});

    return res.status(200).json({
      ok: true,
      message: "Dispatcher rejected successfully.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function listVerifiedDispatchersController(req, res, next) {
  try {
    const items = await listVerifiedDispatchers();

    return res.status(200).json({
      ok: true,
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDispatcherController(req, res, next) {
  try {
    const { dispatcherId } = req.params;
    const item = await scheduleDispatcherDeletion({
      dispatcherId,
      confirmation: req.body?.confirmation || "",
      reason: req.body?.reason || "",
      adminUser: req.user,
    });

    return res.status(200).json({
      ok: true,
      message: "Dispatcher deletion scheduled.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

/* ---------------------------------------
   Dispatcher Self Workspace
---------------------------------------- */

export async function getMyDispatcherProfileController(req, res, next) {
  try {
    const item = await getMyDispatcherProfile({
      user: req.user,
    });

    return res.status(200).json({
      ok: true,
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMyAssignedDealersController(req, res, next) {
  try {
    const { q, status, page, limit } = req.query || {};

    const out = await listMyAssignedDealers({
      user: req.user,
      q,
      status,
      page,
      limit,
    });

    return res.status(200).json({
      ok: true,
      ...out,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMyOrdersController(req, res, next) {
  try {
    const { status, q, page, limit, archive } = req.query || {};

    const out = await listMyOrders({
      user: req.user,
      status,
      q,
      page,
      limit,
      archive,
    });

    return res.status(200).json({
      ok: true,
      ...out,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrderByIdController(req, res, next) {
  try {
    const { orderId } = req.params;

    const item = await getMyOrderById({
      user: req.user,
      orderId,
    });

    return res.status(200).json({
      ok: true,
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyAssignedOrderController(req, res, next) {
  try {
    const { orderId } = req.params;

    const item = await verifyAssignedOrder({
      user: req.user,
      orderId,
      payload: req.body || {},
    });

    return res.status(200).json({
      ok: true,
      message: "Order verified successfully.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectAssignedOrderController(req, res, next) {
  try {
    const { orderId } = req.params;

    const item = await rejectAssignedOrder({
      user: req.user,
      orderId,
      payload: req.body || {},
    });

    return res.status(200).json({
      ok: true,
      message: "Order rejected successfully.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function amendAssignedOrderController(req, res, next) {
  try {
    const { orderId } = req.params;

    const item = await amendAssignedOrder({
      user: req.user,
      orderId,
      payload: req.body || {},
    });

    return res.status(200).json({
      ok: true,
      message: "Order amended successfully.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMyOrderArchiveController(req, res, next) {
  try {
    const { q, page, limit } = req.query || {};

    const out = await listMyOrderArchive({
      user: req.user,
      q,
      page,
      limit,
    });

    return res.status(200).json({
      ok: true,
      ...out,
    });
  } catch (error) {
    next(error);
  }
}
