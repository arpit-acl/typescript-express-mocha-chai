import userModel from '../models/user.model';
import moduleModel from '../models/modules.model';

export default async () => {
    // check for super user
    await addSuperUser()

    // check for modules
    await addModules()
}

export const addSuperUser = async () => {
    const superUser = await userModel.findOne({ userType: 'superAdmin' });
    if (!superUser) {
        await userModel.create({
            email: 'superadmin@company.com',
            password: 'super@admin',
            userType: 'superAdmin'
        })
    }
}

export const addModules = async () => {
    const modulesData = [
        {
            name: 'policy'
        },
        {
            name: 'role'
        },
        {
            name: 'device'
        }
    ]
    const promiseArr : any = [];
    modulesData.forEach(e => {
        const pr = new Promise(async (resolve, reject) => {
            await moduleModel.updateOne({
                name: e.name
            }, {
                name: e.name
            }, {
                upsert: true
            });
            resolve(true);
        })
        promiseArr.push(pr);
    });
    await Promise.all(promiseArr);
}
