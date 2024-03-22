import { deployContract } from "./utils";


export default async function () {
  await deployContract("GuessingGame", ["0x2cd2b35a7ca7a66f45b347c27a3912232124ea6e1669d4ef7cf850571a10e7ea", "0x780E804A775A41a5F4eaC366b66Cb572547571e4"]);
}
