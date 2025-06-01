function recursiveIdSanitization(data, populate) {
    if (!populate || !data) return;
  
    const populateArray = Array.isArray(populate) ? populate : [populate];
  
    for (const pop of populateArray) {
      const path = pop.path;
      const nestedPopulate = pop.populate;
  
      const value = data[path];
  
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && item._id && typeof item._id !== 'string') {
            item._id = item._id.toString();
          }
          if (nestedPopulate) {
            recursiveIdSanitization(item, nestedPopulate);
          }
        });
      } else if (value && typeof value === 'object') {
        if (value._id && typeof value._id !== 'string') {
          value._id = value._id.toString();
        }
        if (nestedPopulate) {
          recursiveIdSanitization(value, nestedPopulate);
        }
      }
    }
  }
  
  /* function sanitizeMongoDoc(doc) {
    if (Array.isArray(doc)) {
      return doc.map(sanitizeMongoDoc);
    }
  
    if (doc && typeof doc === "object") {
      const sanitized = {};
  
      for (const key in doc) {
        if (key === "__v") continue; // opcional: eliminar __v
        const value = doc[key];
  
        // Convertir _id a string
        if (key === "_id" && value && typeof value === "object" && typeof value.toString === "function") {
          sanitized[key] = value.toString();
        } else {
          sanitized[key] = sanitizeMongoDoc(value);
        }
      }
  
      return sanitized;
    }
  
    return doc;
  }
   */
  ipcMain.handle("model-findOne", async (_, { modelName, query,populate }) => {
  
    try {
     
    const Model = getModel(modelName);
    console.log(Model)
    const q =Model.findOne(query)
    if(populate) q.populate(populate)
    
  
    
    let res = await q.lean();
  
    console.log(res)
    console.log(query)
  
    if(res){
      res._id = res._id.toString()
     /*  function recursiveIdSanitization(path,populate){
        if(!path.length) return path
        
        else [
          path.map((path)=>{
            return {
              ...path,
              _id:path._id.toString(),
              [populate.path]:recursiveIdSanitization(path[populate.path],populate.populate)
            }
          })
        ]
        
      }
  
      if(Array.isArray(res[populate.path]) && res[populate.path].length){
  
        recursiveIdSanitization(res[populate.path],populate)
      } */
  
      //recursiveIdSanitization(res, populate);
  
      return res ;
    }
    return null
     
    } catch (error) {
      console.log(error)
      return null
    }
  });
  // 🧩 Handlers genéricos
  ipcMain.handle("model-findAll", async (_, {modelName,query}) => {
    const Model = getModel(modelName);
    return await Model.find(query).lean();
  });
  
  ipcMain.handle("model-create", async (_, { modelName, data }) => {
    try {
      const Model = getModel(modelName);
    const doc = new Model(data);
    await doc.save();
   
    const plain = doc.toObject();
      plain._id = plain._id.toString(); // Forzar a string
  
      return plain;
    } catch (error) {
      console.log(error)
  
      return error.code
    }
  }); 
  
    ipcMain.handle("model-update", async (_, { modelName, id, data }) => {
      const Model = getModel(modelName);
      const updated = await Model.findByIdAndUpdate(id, data, { new: true }).lean();
      return updated;
    });
  
  ipcMain.handle("model-delete", async (_, { modelName, id }) => {
  
    try {
      const Model = getModel(modelName);
    const res = await Model.deleteOne({_id:id});
   
  
    return { success: true };
    } catch (error) {
      console.log(error)
      return {success:false}
    }
    
  });