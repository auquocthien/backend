const ApiError = require('../ApiError');
const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');

class UserService {
    constructor() {
        this.User = AppDataSource.getRepository(User);
    }

    async login(payload) {
        try {
            const user = await this.User.findOneBy({ Username: payload.username, Password: payload.password });
            return user;
        } catch (error) {
            console.log(error);
            throw new ApiError("Error occurred while logging in.", 500); // Ném lỗi nếu có lỗi xảy ra
        }
    }

    async create(payload) {
        try {
            const newUser = new User();

            newUser.FullName = payload.fullName;
            newUser.Username = payload.userName;
            newUser.Password = payload.password;
            newUser.Revenue = 0;
            newUser.ManagerID = payload.managerID;
            newUser.ReferencesID = payload.referencesID;

            return await this.User.save(newUser);
        } catch (error) {
            console.log(error);
            throw new ApiError(550, "Error occurred while creating user."); // Ném lỗi nếu có lỗi xảy ra
        }
    }

    async getSubordinates(userID) {
        try {
            // Hàm đệ qui để lấy các cấp dưới của một người dùng
            const getSubordinatesRecursive = async (userID) => {
                // Truy vấn người dùng dựa trên userID và tải cấp dưới của họ
                const user = await this.User.findOne({
                    where: { UserID: userID },
                    relations: ['subordinates']
                });

                // Nếu không tìm thấy người dùng, trả về null
                if (!user) return null;

                // Lấy danh sách các cấp dưới của người dùng
                const subordinates = user.subordinates;

                // Nếu người dùng không có cấp dưới nào, trả về người dùng
                if (!subordinates || subordinates.length === 0) {
                    return user;
                }

                // Duyệt qua từng cấp dưới và thực hiện truy vấn đệ qui
                const subordinatesWithChildren = await Promise.all(subordinates.map(async (subordinate) => {
                    const children = await getSubordinatesRecursive(subordinate.UserID);
                    return children;
                }));

                // Trả về người dùng cùng với danh sách các cấp dưới của họ
                return {
                    ...user,
                    subordinates: subordinatesWithChildren
                };
            };

            // Gọi hàm đệ qui với userID ban đầu
            const result = await getSubordinatesRecursive(userID);
            return result;
        } catch (error) {
            console.error("Error occurred while fetching subordinates:", error);
            throw new ApiError(500, "Error occurred while fetching subordinates.");
        }
    }


    async getReferralOrManager(userID) {
        try {
            const referral = await this.User.findOne({ where: { UserID: userID } });
            return referral;
        } catch (error) {
            console.error("Error occurred while fetching referral:", error);
            throw new ApiError(500, "Error occurred while fetching referral.");
        }
    }

    async getReferredUsers(userID) {
        try {
            const referredUsers = await this.User.find({ where: { ReferencesID: userID } });
            return referredUsers;
        } catch (error) {
            console.error("Error occurred while fetching referred users:", error);
            throw new ApiError(500, "Error occurred while fetching referred users.");
        }
    }

    async updateRevenue(id, amount) {
        try {
            const user = await this.User.findOneBy({ UserID: id })
            user.PerRevenue = parseInt(user.PerRevenue) + amount
            await this.User.save(user)

            var managerID = user.ManagerID
            console.log(managerID)
            while (managerID) {
                const manager = await this.User.findOneBy({ UserID: managerID })
                manager.SubRevenue = parseInt(manager.SubRevenue) + amount

                await this.User.save(manager)
                managerID = manager.ManagerID
            }

            return user
        } catch (error) {
            console.log(error)
            throw new ApiError(500, "Error occurred while updating revenue.")
        }
    }
}

module.exports = UserService;
