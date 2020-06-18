export function collapseOptionalParams(schema) {
    for (const property of getOptionalFields(schema)) {
        collapseProperty(schema.properties[property]);
    }
    for (const property in schema.properties) {
        if (!schema.properties.hasOwnProperty(property)) {
            continue;
        }
        const propertyDescription = schema.properties[property];
        if (isObjectSchema(propertyDescription)) {
            collapseOptionalParams(propertyDescription);
        }
    }
    if (schema.definitions) {
        for (const key in schema.definitions) {
            if (schema.definitions.hasOwnProperty(key) &&
                isObjectSchema(schema.definitions[key])) {
                collapseOptionalParams(schema.definitions[key]);
            }
        }
    }
}
export function adjustSchema(schema) {
    if (schema.definitions) {
        setFieldRequired(asObjectSchema(schema.definitions.IChromeWebstoreOptions), 'apiAccess');
    }
}
export function setSecretsEnvVariables(editor) {
    const values = {
        'root.chromeWebstore.options.extensionId': '$(G_EXTENSION_ID)',
        'root.chromeWebstore.options.apiAccess.clientId': '$(G_CLIENT_ID)',
        'root.chromeWebstore.options.apiAccess.clientSecret': '$(G_CLIENT_SECRET)',
        'root.chromeWebstore.options.apiAccess.refreshToken': '$(G_REFRESH_TOKEN)',
        'root.firefoxAddons.options.api.jwtIssuer': '$(FF_JWT_ISSUER)',
        'root.firefoxAddons.options.api.jwtSecret': '$(FF_JWT_SECRET)',
        'root.firefoxAddons.options.deploy.extensionId': '$(FF_EXTENSION_ID)',
        'root.firefoxAddons.options.signXpi.extensionId': '$(FF_OFFLINE_EXT_ID)'
    };
    for (const key in values) {
        if (values.hasOwnProperty(key)) {
            const propertyEditor = editor.getEditor(key);
            if (propertyEditor) {
                propertyEditor.setValue(values[key]);
            }
        }
    }
}
function isObjectSchema(schema) {
    return typeof schema === 'object' &&
        schema.type === 'object' &&
        typeof schema.properties === 'object' &&
        (typeof schema.required === 'undefined' ||
            Array.isArray(schema.required));
}
function asObjectSchema(schema) {
    if (isObjectSchema(schema)) {
        return schema;
    }
    throw new Error('Not an ObjectSchema');
}
function getOptionalFields(schema) {
    const properties = Object.keys(schema.properties);
    const requiredProperties = schema.required;
    return requiredProperties === undefined
        ? properties
        : properties.filter(property => requiredProperties.indexOf(property) === -1);
}
function collapseProperty(propertyDescription) {
    propertyDescription.options = { collapsed: true };
}
function setFieldRequired(schema, property) {
    if (!schema.required) {
        schema.required = [];
    }
    schema.required.push(property);
}
