export const VALIDATION_ERROR_CONSTANTS = {
    USERS: {
        ID: {
            NOT_EMPTY: '_id should be not empty',
            INVALID_VALUE: '_id should be string value',
        },
        EMAIL: {
            NOT_EMPTY: 'Email should be not empty',
            INVALID_VALUE: 'Email should be string value',
            MATCHES: 'Email should be valid',
        },
        NAME: {
            NOT_EMPTY: 'Name should be not empty',
            INVALID_VALUE: 'Name should be string value',
        },
        PASSWORD: {
            NOT_EMPTY: 'Password should be not empty',
            INVALID_VALUE: 'Password should be string value',
            MIN_LENGTH: 'Password minimum length is 9 characteres',
            MATCHES: 'Password invalid format. At least one upper case & one lower case & one number & one special character',
        },
        NEW_PASSWORD: {
            NOT_EMPTY: 'New password should be not empty',
            INVALID_VALUE: 'New password should be string value',
            MIN_LENGTH: 'New password minimum length is 9 characteres',
            MATCHES: 'New password invalid format. At least one upper case & one lower case & one number & one special character',
        },
        ACTIVE: {
            NOT_EMPTY: 'Active should be not empty',
            INVALID_VALUE: 'Active should be boolean value',
        },
        CREATED_AT: {
            NOT_EMPTY: 'Created at should be not empty',
            INVALID_VALUE: 'Created at should be Date value',
        },
        UPDATED_AT: {
            NOT_EMPTY: 'Updated at should be not empty',
            INVALID_VALUE: 'Updated at should be Date value',
        },
    },
};
    