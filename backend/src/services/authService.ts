import User from '../models/User';
import Hospital from '../models/Hospital';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/tokens';
import { logAuditEvent } from './auditService';
import { Types } from 'mongoose';

export const registerHospitalAdmin = async (data: any, ip?: string, userAgent?: string) => {
    const { hospitalName, adminName, email, password } = data;

    // Generate code from name (simple slug)
    const hospitalCode = hospitalName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    // Ensure uniqueness? For now let's assume it works or append random if needed.
    // Mongoose will throw if duplicate.

    const hospital = await Hospital.create({
        name: hospitalName,
        code: hospitalCode + '-' + Math.floor(Math.random() * 1000), // Simple unique
        plan: 'lite',
    });

    const passwordHash = await hashPassword(password);

    const user = await User.create({
        hospitalId: hospital._id,
        name: adminName,
        email,
        passwordHash,
        roles: ['SUPERADMIN'],
    });

    await logAuditEvent({
        hospitalId: hospital._id as Types.ObjectId,
        userId: user._id as Types.ObjectId,
        action: 'HOSPITAL_REGISTERED',
        module: 'AUTH',
        newValue: { hospitalId: hospital._id, userId: user._id },
        ip,
        userAgent,
    });

    const token = generateToken({
        userId: user._id.toString(),
        hospitalId: hospital._id.toString(),
        roles: user.roles,
    });

    return { user, hospital, token };
};

export const login = async (data: any) => {
    const { email, password } = data;

    const users = await User.find({ email });

    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }

    let validUser = null;
    for (const user of users) {
        const isMatch = await comparePassword(password, user.passwordHash);
        if (isMatch) {
            validUser = user;
            break;
        }
    }

    if (!validUser) {
        throw new Error('Invalid credentials');
    }

    // Fetch hospital to return with login
    const hospital = await Hospital.findById(validUser.hospitalId);

    const token = generateToken({
        userId: validUser._id.toString(),
        hospitalId: validUser.hospitalId.toString(),
        roles: validUser.roles,
    });

    return { user: validUser, hospital, token };
};
