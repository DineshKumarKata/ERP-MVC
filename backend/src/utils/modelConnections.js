const dbManager = require('./dbManager');

// Models that use ad_process database
const adProcessModels = {
    admission_form: 'admission',
    choice_filling: 'admission',
    entrance_exams_m: 'admission'
};

// Models that use ad_master database
const adMasterModels = {
    student_adm_regs: 'academic',
    campus_ms: 'academic',
    prog_branch_ms: 'academic'
};

// Function to get the correct connection for a model
const getModelConnection = async (modelName) => {
    const dbName = adProcessModels[modelName] || adMasterModels[modelName];
    if (!dbName) {
        throw new Error(`No database configuration found for model: ${modelName}`);
    }
    return await dbManager.connect(dbName);
};

module.exports = {
    getModelConnection,
    adProcessModels,
    adMasterModels
}; 