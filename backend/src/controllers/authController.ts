import { getHospitalAIFeatures } from '../services/featureService';

export const registerHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Expects: hospitalName, adminName, email, password
        const result = await authService.registerHospitalAdmin(req.body, req.ip, req.headers['user-agent']);

        const aiFeatures = getHospitalAIFeatures(result.hospital.planTier);
        const hospitalWithFeatures = { ...result.hospital.toObject(), aiFeatures };

        sendSuccess(res, { ...result, hospital: hospitalWithFeatures }, 'Hospital registered successfully', 201);
    } catch (error: any) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await authService.login(req.body);
        sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            sendError(res, 'Invalid credentials', 401, 'AUTH_FAILED');
            return;
        }
        next(error);
    }
};
