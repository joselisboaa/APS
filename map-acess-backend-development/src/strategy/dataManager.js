class DataManager {
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy) {
      this.strategy = strategy;
    }
  
    async findAll(data) {
      return this.strategy.findAll(data);
    }
  
    async findById(id) {
      return this.strategy.findById(id);
    }
  
    async create(data) {
      return this.strategy.create(data);
    }
  
    async update(data) {
      return this.strategy.update(data);
    }
  
    async deleteById(data) {
      return this.strategy.deleteById(data);
    }
  }
  