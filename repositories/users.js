const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a new repository requires a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    //Open the file called this.filename
    //Read contents
    //parse contents
    //Return parsed data
    const contents = JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );

    return contents;
  }

  async create(attrs) {
    //{email:'asdfasdfs', password: 'passwordsdfs'}
    const records = await this.getAll();
    attrs.id = this.randomId();
    records.push(attrs);
    //write the updated 'records' array back into this.filename
    await this.writeAll(records);
    return attrs;
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecord = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecord);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Cannot find record with id: ${id}`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository("users.json");
