export const REQUEST_USER_KEY = 'user';
export const AuthType = {
    Bearer: 'Bearer',
    None: 'None',
    APIKey: 'APIKey',
};

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
    And: 'And',
    Or: 'Or',
};

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard];
