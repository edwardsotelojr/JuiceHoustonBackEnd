const mongoose = require('mongoose');
const faker = require('faker');
const { User } = require('../../src/components/users');
const { hashPassword } = require('../../src/utils/auth');
//const { formatUsername } = require('../../src/utils/helpers');

const password = 'password123';
const zipcodes = [
    77003, 77004, 77007, 77008, 77009, 77011, 77012, 77016, 77018, 77019, 77020, 77021, 77022, 
    77023, 77024, 77026, 77027, 77028, 77030, 77036, 77037, 77039, 77040, 77042, 77050, 77054,
    77055, 77057, 77063, 77076, 77080, 77087, 77088, 77091, 77092, 77093, 77096, 77098,
    77201, 77401,
  ];

  const address = [{address: "7443 Maxroy St", zipcode: 77088}, {address: "2229 San Felipe St", zipcode: 77019},
  {address: "6102 wayne St", zipcode: 77026}, {address: "2209 Emancipation ave", zipcode: 77003}, 
]

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password,
  zipcode: address[0].zipcode,
  address: address[0].address,
  phone: faker.phone
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password,
  zipcode: address[0].zipcode,
  address: address[0].address,
  phone: faker.phone
};

const userThree = {
    _id: mongoose.Types.ObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    zipcode: address[0].zipcode,
    address: address[0].address,
    phone: faker.phone
  };
  
  const userFour = {
    _id: mongoose.Types.ObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    zipcode: address[0].zipcode,
    address: address[0].address,
    phone: faker.phone
  };
  
  module.exports = {
    userOne,
    userTwo,
    userThree,
    userFour
  }