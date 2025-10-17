import { HttpStatus } from '@src/constants/httpStatus';
import { catchAsync } from '@src/utils/catchAsync';
import { sendSuccess } from '@src/utils/sendResponse';
import { Request, Response } from 'express';
import * as booking from './booking.service';
import { ApiError } from '@src/utils/ApiError';
import logger from '@src/utils/logger';


/**
 * Create a new service request
 */
export const createServiceRequest = catchAsync(async (req: Request, res: Response) => {

    const serviceRequest = await booking.createServiceRequest(req.body);
    sendSuccess(res, 'Service Request created successfully', HttpStatus.CREATED, serviceRequest);
});

/**
 * Update a service request
 */
export const updateServiceRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedRequest = await booking.updateServiceRequest(Number(id), payload);
    sendSuccess(res, 'Service request updated successfully', HttpStatus.OK, updatedRequest);
});

/**
 * Delete a service request
 */
export const deleteServiceRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await booking.deleteServiceRequest(Number(id));
    sendSuccess(res, 'Service request deleted successfully', HttpStatus.OK, null);
});

/**
 * Get all service requests
 */
export const getAllServiceRequests = catchAsync(async (_req: Request, res: Response) => {
    const requests = await booking.getAllServiceRequests();
    sendSuccess(res, 'Service requests fetched successfully', HttpStatus.OK, requests);
});

/**
 * Get service request by ID
 */
export const getServiceRequestById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const request = await booking.getServiceRequestById(Number(id));
    sendSuccess(res, 'Service request fetched successfully', HttpStatus.OK, request);
});

/**
 * Get all service requests by user ID
 */
export const getServiceRequestsByUserId = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const requests = await booking.getServiceRequestsByUserId(Number(userId));
    sendSuccess(res, `Service requests for user ${userId} fetched successfully`, HttpStatus.OK, requests);
});

//getServiceRequestsByProviderId

export const getServiceRequestsByProviderId = catchAsync(async (req: Request, res: Response) => {
    const { providerId } = req.params;
    const requests = await booking.getServiceRequestsByProviderId(Number(providerId));
    sendSuccess(res, `Service requests for provider ${providerId} fetched successfully`, HttpStatus.OK, requests);
});


// ===========Service requuest modification===========

export const createModification = catchAsync(async (req:Request, res:Response) => {
    console.log('User in request:', req.body); // Debugging line

    if (!req.user) {
        throw new ApiError('Unauthorized: User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const { serviceRequestId, reason, price, timeRequired } = req.body;


    const modification = await booking.createRequestModification(
        Number(serviceRequestId),
        {
            userId: Number(req.user.userId), // Ensure userId is a number
            reason,
            price,
            timeRequired,
        }
    );

    sendSuccess(
        res,
        'Modification request created successfully',
        HttpStatus.CREATED,
        modification
    );
});


export const getModifications = catchAsync(async (req:Request, res:Response) => {
    const { serviceRequestId } = req.params;
    const modifications = await booking.getRequestModifications(Number(serviceRequestId));
    sendSuccess(res, 'Modifications fetched successfully', HttpStatus.OK, modifications);
});

export const updateModification = catchAsync(async (req, res) => {
    const { id } = req.params;
    const modification = await booking.updateRequestModification(Number(id), req.body);
    sendSuccess(res, 'Modification updated successfully', HttpStatus.OK, modification);
});

export const deleteModification = catchAsync(async (req, res) => {
    const { id } = req.params;
    await booking.deleteRequestModification(Number(id));
    sendSuccess(res, 'Modification deleted successfully', HttpStatus.OK);
});


// Update service request status
export const updateServiceRequestStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new ApiError('Status is required', HttpStatus.BAD_REQUEST);
    }

    const updatedRequest = await booking.updateServiceRequestStatus(Number(id), status);
    sendSuccess(res, 'Service request status updated successfully', HttpStatus.OK, updatedRequest);
});