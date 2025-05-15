class UserDao {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        return await this.model.findOne({ _id: id });
    }
}

export default UserDao;