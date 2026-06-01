const optionalMarker = Symbol("optional-json-schema");

function withMetadata(schema, options = {}) {
  return { ...schema, ...options };
}

function optional(schema) {
  return { ...schema, [optionalMarker]: true };
}

function object(properties = {}, options = {}) {
  const normalizedProperties = {};
  const required = [];
  for (const [name, schema] of Object.entries(properties)) {
    const { [optionalMarker]: isOptional, ...publicSchema } = schema;
    normalizedProperties[name] = publicSchema;
    if (!isOptional) required.push(name);
  }
  return withMetadata(
    {
      type: "object",
      properties: normalizedProperties,
      ...(required.length ? { required } : {}),
      additionalProperties: false,
    },
    options,
  );
}

export const Type = {
  Object: object,
  Optional: optional,
  String: (options = {}) => withMetadata({ type: "string" }, options),
  Unsafe: (schema = {}) => ({ ...schema }),
};

export function StringEnum(values, options = {}) {
  return {
    type: "string",
    enum: values,
    ...(options.description ? { description: options.description } : {}),
    ...(options.default ? { default: options.default } : {}),
  };
}
