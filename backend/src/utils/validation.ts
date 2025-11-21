export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validateRequired = (fields: any[], body: any) => {
    const missing = fields.filter((field) => !body[field]);
    if (missing.length > 0) {
        return `Missing required fields: ${missing.join(', ')}`;
    }
    return null;
};
