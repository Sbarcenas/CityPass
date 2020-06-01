const Realm = require("realm");

//TODO: añadir mas campos con relacion a beneficios

const Benefits = {
  name: "Benefits",
  //primaryKey: "id",
  properties: {
    id: "int", // primary key
    description: "string",
    terms: "string",
    image: { type: "string", optional: true },
    logo: { type: "string", optional: true },
    name: "string",
    status: "string",
    dateEnd: "date",
    benefitId: "int",
    nanoId: "string",
    createAt: "date"
  }
};

// return realm
export default Realm.open({ schema: [Benefits] });
