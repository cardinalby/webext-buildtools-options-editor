export type PropertyDescription = {
    type: string,
    options?: { collapsed?: boolean }
}

export type ObjectSchema = {
    type: 'object',
    properties: {
        [k: string]: PropertyDescription|ObjectSchema
    },
    required?: string[],
    definitions?: { [k: string]: ObjectSchema|any }
};