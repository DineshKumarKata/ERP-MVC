var RoleModel = require("../models/RoleModel");

class RoleDao { 

    create = async (roleData)=>{
        try {
            console.log("RoleDao - Inside of create") 
            const role = new RoleModel({  ...roleData });
            const persistanceData = await role.save();
            console.log("RoleDao - End of create") 
            return persistanceData;
        } catch (error) {
            console.error("RoleDao - create ||  Error : ", error.message);
            throw error;
        }
    }

    getDataByAggregateFilters = async (filters) => {
        try {
            console.log("RoleDao - Inside of getDataByFilters") 
            const documentsData = await RoleModel.aggregate([{$match:filters}])
            console.log("RoleDao - Inside of getDataByFilters") 
            return documentsData;
        } catch (error) {
            console.log("RoleDao - getDataByFilters || Error : ", error);
            throw error;
        }
    }

    getDataByFilters = async (filters) => {
        try {
            console.log("RoleDao - Inside of getDataByFilters") 
            const documentsData = await RoleModel.find(filters);
            console.log("RoleDao - Inside of getDataByFilters") 
            return documentsData;
        } catch (error) {
            console.log("RoleDao - getDataByFilters || Error : ", error);
            throw error;
        }
    }

    getOneDataByFilters = async (filters) => {
        try {
            console.log("RoleDao - Inside of getOneDataByFilters");
            const documentsData = await RoleModel.findOne(filters);
            console.log("RoleDao - Inside of getOneDataByFilters");
            return documentsData;
        } catch (error) {
            console.log("RoleDao - getOneDataByFilters || Error : ", error);
            throw error;
        }
    }




};
module.exports = RoleDao;