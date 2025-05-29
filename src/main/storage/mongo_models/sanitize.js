// utils/sanitizeMongoDoc.js

function sanitizeMongoDoc(doc) {
    if (Array.isArray(doc)) {
      return doc.map(sanitizeMongoDoc);
    }
  
    if (doc && typeof doc === "object") {
      const sanitized = {};
  
      for (const key in doc) {
        if (key === "__v") continue;
  
        const value = doc[key];
  
        if (value instanceof Date) {
          sanitized[key] = value.toISOString();
        } else if (
          value &&
          typeof value === "object" &&
          typeof value.toString === "function" &&
          value.constructor?.name === "ObjectId"
        ) {
          sanitized[key] = value.toString();
        } else if (Buffer.isBuffer(value)) {
          sanitized[key] = value.toString("base64");
        } else {
          sanitized[key] = sanitizeMongoDoc(value);
        }
      }
  
      return sanitized;
    }
  
    return doc;
  }
  
module.exports = sanitizeMongoDoc;
  