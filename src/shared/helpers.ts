import { Prisma } from '@prisma/client';

// Hàm này kiểm tra xem lỗi có phải là vi phạm ràng buộc duy nhất hay không
export function isUniqueConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

// Hàm này kiểm tra xem lỗi có phải là lỗi không tìm thấy hay không
export function isNotFoundError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}
