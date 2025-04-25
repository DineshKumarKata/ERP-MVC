var UserModel = require("../models/UserModel");


class UserDao { 

	create = async (userData)=>{
        try {      
            console.log("UserDao - Inside of create") 
            const user = new UserModel({  ...userData });
            const persistanceData = await user.save();
            console.log("UserDao - End of create") 
            return persistanceData;
        } catch (error) {
            console.error("UserDao - create ||  Error : ", error.message);
            throw error;
        }
    }

    getDataByAggregateFilters = async (filters) => {
            try {
                console.log("UserDao - Inside of getDataByFilters") 
                const documentsData = await UserModel.aggregate([{$match:filters}])
                console.log("UserDao - Inside of getDataByFilters") 
                return documentsData;
            } catch (error) {
                console.log("UserDao - getDataByFilters || Error : ", error);
                throw error;
            }
        }
    
        getDataByFilters = async (filters) => {
            try {
                console.log("UserDao - Inside of getDataByFilters") 
                console.log("filters::: ", filters);
                const documentsData = await UserModel.find(filters);
                console.log("documentsData::: ", documentsData);
                console.log("UserDao - Inside of getDataByFilters") 
                return documentsData;
            } catch (error) {
                console.log("UserDao - getDataByFilters || Error : ", error);
                throw error;
            }
        }
    
        getOneDataByFilters = async (filters) => {
            try {
                console.log("UserDao - Inside of getOneDataByFilters");
                console.log("filters::: ", filters);
                const documentsData = await UserModel.findOne(filters);
                console.log("documentsData::: ", documentsData);
                console.log("UserDao - Inside of getOneDataByFilters");
                return documentsData;
            } catch (error) {
                console.log("UserDao - getOneDataByFilters || Error : ", error);
                throw error;
            }
        }

    updateOneData = async (filter, updateData) => {
        try {
            console.log("UserDao - Inside of updateOneData");
            console.log("filter:", filter);
            console.log("updateData:", updateData);
            
            const result = await UserModel.updateOne(filter, updateData);
            console.log("Update result:", result);
            console.log("UserDao - End of updateOneData");
            
            return result;
        } catch (error) {
            console.error("UserDao - updateOneData || Error:", error);
            throw error;
        }
    }

};
module.exports = UserDao;