import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { navData } from "./nav-data"
import { priorities, statuses } from "./data"

const farms = Array.from({ length: 100 }, () => ({
  id: `DE23_${faker.number.int({ min: 100, max: 999 })}_${faker.number.int({ min: 1000, max: 15000 })}`,
  year: faker.date.past().getFullYear(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  // choose 1-3 networks
  networks: faker.helpers.arrayElements(navData.networks, { min: 1, max: 2 }).map(l => l.value),
  countryCode: faker.location.countryCode(),
  address: faker.location.streetAddress(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  status: faker.helpers.arrayElement(statuses).value,
  priority: faker.helpers.arrayElement(priorities).value,
}))

fs.writeFileSync(
  path.join(__dirname, "farms.json"),
  JSON.stringify(farms, null, 2)
)

console.log("✅ farms data generated.")