import { HttpStatus } from "@src/constants/httpStatus";
import db from "@src/database/models";
import { TCreateRequestModificationInput, TUpdateRequestModificationInput } from "@src/database/models/request_modification.model";
import { TCreateServiceRequestInput, TUpdateServiceRequestInput, TServiceRequest } from "@src/database/models/service_request.model";
import { ApiError } from "@src/utils/ApiError";
import { Op } from "sequelize";


export const createServiceRequest = async (payload: TCreateServiceRequestInput) => {
    try {
        console.log('Creating service request with payload:', payload);

        // Check user exists
        const user = await db.User.findByPk(payload.userId);
        if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

        // Check provider exists
        const provider = await db.User.findByPk(payload.serviceProviderId);
        if (!provider) throw new ApiError('Service provider not found', HttpStatus.NOT_FOUND);

        // Check package exists
        const pkg = await db.Package.findByPk(payload.packageId);
        if (!pkg) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);

        // Create
        const serviceRequest = await db.ServiceRequest.create(payload);
        return serviceRequest;
    } catch (error: any) {
        console.error('Error creating service request:', error.message);
        console.error('Full error:', error); // will show MySQL constraint issues
        throw new ApiError('Failed to create service request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
};


export const updateServiceRequest = async (id: number, payload: TUpdateServiceRequestInput) => {
    const request = await db.ServiceRequest.findByPk(id);
    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);

    await request.update(payload);
    return request;
};

export const deleteServiceRequest = async (id: number) => {
    const request = await db.ServiceRequest.findByPk(id);
    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);

    await request.destroy();
};

export const getAllServiceRequests = async () => {
    return db.ServiceRequest.findAll({
        include: [
            {
                model: db.RequestModification,
                as: 'modifications',
            },
        ],
    });
};
export const getServiceRequestById = async (id: number) => {
    const request = await db.ServiceRequest.findByPk(id, {
        include: [
            {
                model: db.RequestModification,
                as: 'modifications',
            },
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            },
            {
                model: db.User,
                as: 'serviceProvider',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            },
            {
                model: db.Package,
                as: 'package',
                // attributes: ['id', 'name', 'price'],
            },
        ],
    });

    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);

    return request;
};


export const getServiceRequestsByUserId = async (userId: number) => {
    return db.ServiceRequest.findAll({ where: { userId } });
};

//getServiceRequestsByProviderId

export const getServiceRequestsByProviderId = async (providerId: number) => {
    try {
        const serviceRequests = await db.ServiceRequest.findAll({
            where: { serviceProviderId: providerId },
            include: [
                {
                    model: db.User,
                    as: "user", // make sure your association uses this alias
                    attributes: ["id", "firstName", "lastName", "email", "phone"]
                },
                {
                    model: db.Package,
                    as: "package", // match your alias in the association
                    attributes: ["id", "name", "description", "price"]
                },
                {
                    model: db.Review,
                    as: "reviews", // optional: reviews linked to this request
                    attributes: ["id", "rating", "comment", "createdAt"],
                    include: [
                        {
                            model: db.User,
                            as: "user",
                            attributes: ["id", "firstName", "lastName", "email"]
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]],
        }); getProviderStats(providerId);

        return {
            success: true,
            message: `Service requests for provider ${providerId} fetched successfully`,
            data: {
                serviceRequests: serviceRequests,
                stats: {
                    ...(await getProviderStats(providerId))
                },
            },
        };
    } catch (error) {
        console.error("Error fetching provider service requests:", error);
        return {
            success: false,
            message: "Internal Server Error",
            data: [],
        };
    }
};


export const getProviderStats = async (providerId: number) => {
  // Total bookings
  const total_booking = await db.ServiceRequest.count({
    where: { serviceProviderId: providerId },
  });

  // Total earnings (sum of completed jobs)
  const completedRequests = await db.ServiceRequest.findAll({
    include: [{ model: db.Package, as: 'package', attributes: ['price'] }],
    where: { serviceProviderId: providerId, status: "COMPLETED" },
    raw: true, // make it return plain objects
  });

  const total_earning = completedRequests.reduce((sum, sr) => {
    // Access the price from the joined package object
    const price = parseFloat((sr as any)['package.price']) || 0;
    return sum + price;
  }, 0);

  // Completion rate
  const completed_count = completedRequests.length;
  const completion_rate = total_booking ? (completed_count / total_booking) * 100 : 0;

  // Average rating
  const ratingsRaw = await db.Review.findAll({
    where: {
      providerId: providerId,
      rating: { [Op.ne]: null }
    },
    attributes: ["rating"],
    raw: true
  });

  const ratings = ratingsRaw.map(r => Number((r as any).get ? (r as any).get('rating') : (r as any).rating));
  const avg_rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  return {
    total_booking,
    total_earning,
    completion_rate,
    avg_rating,
  };
};

// ===========Service Modification===========

export const createRequestModification = async (
    serviceRequestId: number,
    payload: TCreateRequestModificationInput
) => {
    const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId);
    if (!serviceRequest) {
        throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);
    }

    const insertPayload = {
        ...payload,
        serviceRequestId,
        status: 'PENDING',
    };

    console.log("📦 Insert payload for modification:", insertPayload);

    return db.RequestModification.create(insertPayload);
};

export const getRequestModifications = async (serviceRequestId: number) => {
    return db.RequestModification.findAll({
        where: { serviceRequestId },
        include: [{ model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }],
    });
};

export const updateRequestModification = async (id: number, payload: TUpdateRequestModificationInput) => {
    const modification = await db.RequestModification.findByPk(id);
    if (!modification) throw new ApiError('Modification not found', HttpStatus.NOT_FOUND);

    await modification.update(payload);
    return modification;
};

export const deleteRequestModification = async (id: number) => {
    const modification = await db.RequestModification.findByPk(id);
    if (!modification) throw new ApiError('Modification not found', HttpStatus.NOT_FOUND);

    await modification.destroy();
    return true;
};


// Update service request status by ID
export const updateServiceRequestStatus = async (id: number, status: TServiceRequest['status']) => {
    const request = await db.ServiceRequest.findByPk(id);
    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);

    await request.update({ status });
    return request;
};
